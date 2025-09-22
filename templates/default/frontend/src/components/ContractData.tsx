import { myTokenModuleMyTokenAbi } from "../generated";
import { useReadContracts } from "wagmi";
import { Mint } from "./Mint";

export function ContractData(params: {
  contractAddress: `0x${string}`,
  userAddresses?: readonly `0x${string}`[],
}) {
  const userAddressesSet = new Set(params.userAddresses);

  const myTokenContract = {
    address: params.contractAddress,
    abi: myTokenModuleMyTokenAbi
  } as const;

  const contractData = useReadContracts({
    contracts: [{
      ...myTokenContract,
      functionName: "minter"
    }, {
      ...myTokenContract,
      functionName: "totalSupply"
    }, {
      ...myTokenContract,
      functionName: "symbol"
    }, {
      ...myTokenContract,
      functionName: "decimals"
    }, ...(params.userAddresses ?? []).map(addr => ({
      ...myTokenContract,
      abi: myTokenModuleMyTokenAbi,
      functionName: "balanceOf",
      args: [addr]
    }))
    ]
  });

  let error: string | null = null;

  if (contractData.error !== null) {
    error = contractData.error.toString();
  } else {
    error = contractData.data?.find(el => el.error !== undefined)?.toString() || null;
  }

  if (error !== null) {
    return (
      <p>
        Loading contract data for <span className="font-bold">{params.contractAddress}</span> failed!<br />
        <code style={{ whiteSpace: "pre-wrap" }}>{error}</code>
      </p>
    );
  }

  if (contractData.isLoading || contractData?.data === undefined || contractData.data.some(el => el === undefined)) {
    return (
      <p>
        Loading contract data for <span className="font-bold">{params.contractAddress}</span>...
      </p>
    );
  }

  const owner = contractData.data[0].result as `0x${string}`;
  const isOwner = owner && (userAddressesSet.has(owner));
  const totalSupply = contractData.data[1].result as bigint;
  const tokenName = contractData.data[2].result as string;
  const decimals = contractData.data[3].result as number;
  const balances = contractData.data.slice(4).map(el => el.result as bigint);

  const formatMoney = (amount: bigint): string => (
    String(Number(amount / 10n ** (BigInt(decimals) - 3n)) / 1000)
    + " "
    + tokenName
  );

  return (
    <>
      <p>
        Smart contract address: <span className="font-bold">{params.contractAddress}</span>
      </p>
      <p>
        Smart contract owner: <span className="font-bold">{owner}</span>
        {isOwner && (<> (that's you!!)</>)}
      </p>
      <p>
        Total supply: <span className="font-bold">{formatMoney(totalSupply)}</span>
      </p>

      {(params.userAddresses && params.userAddresses.length > 0) && (
        <div className="border rounded-md my-5 p-2 w-full align-top">
          <h3 className="font-bold text-lg">Balances</h3>
          <div className="w-full grid grid-cols-2">
            {balances.map((val, index) => [
              <div key={index.toString() + "_addr"} className="text-left">{params.userAddresses![index]}</div>,
              <div key={index.toString() + "_value"} className="text-right">{formatMoney(val)}</div>
            ]).flat()}
          </div>
        </div>
      )}

      {isOwner ? (
        <Mint contractAddress={params.contractAddress} ownerAddress={owner} decimals={decimals} symbol={tokenName} />
      ) : (
        <></>
      )}
    </>
  );
}

