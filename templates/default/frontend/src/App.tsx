import { useAccount } from "wagmi";
import "./App.css";
import { myTokenModuleMyTokenAddress } from "./generated";

import polkadotLogo from "./assets/polkadot-logo.svg";
import { ContractData } from "./components/ContractData";

const contractAddress = myTokenModuleMyTokenAddress[420420422];

function App() {
  const accountData = useAccount();

  return (
    <>
      <img src={polkadotLogo} className="mx-auto h-52	p-4 logo" alt="Polkadot logo" />
      {accountData.connector !== undefined ? (
        <div className="container mx-auto p-2 leading-6">
          <h2 className="text-2xl font-bold">Success!</h2>
          <p>Metamask wallet connected!</p>
          <p>
            Connected to chain ID: <span className="font-bold">{accountData.chainId}</span>
          </p>

          <p>
            {accountData.addresses && accountData.addresses.length > 0 ? (
              <><b>{accountData.addresses.length}</b> addresses connected!</>
            ) : (
              <>No addresses connected</>
            )}
          </p>
        </div>
      ) : (
        <div className="container mx-auto p-2 leading-6">
          Metamask wallet not connected or installed. Chain interaction is disabled.
        </div>
      )}

      <ContractData contractAddress={contractAddress} userAddresses={accountData.addresses} />
    </>
  );
}

export default App;
