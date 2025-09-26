TODO:
Conhecer o funcionamento do modulo src/utils/template-loader.ts
Conhecer os testes.

ROADMAP:

[Moonshot]
CLI For Developers and Business with Claude Code UX terminal, but for a given pre-defined technology.
Ex: Web3. That's our bootstrap tech.
Prioritize Integrate already existing available MCPs for existing tools. But for those unavailable but essential tools, embedded cli should be used.

An sdk of sdks...
documentation go beyond its and inherits the included embedded-tooling/embedded-sdk docs

All this to disponibilize tools for builders build projects.

- This is project overall and not limited to sdk codebase only.

[Business]
How to use ahrefs to discover good ranking tools and build them.
Build solutions for already existing demand
why web3? Build unstopabble apps

[Campaign]
Share technical reserches conducted during the development. Thirdweb contracts for example. There is a lof of tangents and outreach we can obtain from blog posts, threads and educational content about pieces of the process or the vision we are building.

[LandingPage]:
use Reactbits.dev:

- https://reactbits.dev/components/card-swap
- https://reactbits.dev/components/spotlight-card
- https://reactbits.dev/animations/electric-border
- https://reactbits.dev/backgrounds/faulty-terminal or https://reactbits.dev/backgrounds/dot-grid

[Thirdweb_CONTRACTS_CODEBASE]
we must streess which contracts from thirweb can be deployed on polkavm. For this we need to get the current foundry repository https://github.com/thirdweb-dev/contracts/tree/main/contracts and test it using hardhat because polkavm still doesn't work with foundry, we need to figure out if best way of doing this research is with local networks or live testnet. Preferably local fork.

we must deploy an feedbacks.kitdot.dev route with feedback pages with simple html forms that submit to our n8n workflows who manages the data.
Ideally we must have a way to add multiple feedbacks to be used from different agents in different processes.
Ongoing open form...
Hackathon forms....
Buildathon forms....
and more can be brainstormed.

[Tests]
We should have more tests. One that simulates all user actions within cli possibilities of templates on a empty environment.

[Features]
Embedded cli/sdks
pop cli v0.9.0 above to run local nodes with polkavm for testing.
leverage scaffold-eth, examples, components https://scaffoldeth.io/
These should be dynamic for, front-end templates only if projects are full-stack or front-end only while pop cli if fulls tack or smart contracts only.
Can we use just launching chains and keep all ink related contracts off? should we? do we gain performance or just limit the developers?
Option to select contracts from pre-build and tested contracts [after thirdweb-contracts were tested on polkavm]
cli params, user can type init -i and the dependencies will be initialized within each project folder.

- Get Started with Your Polkadot DApp should not have instructions do user do npm install if he previously allowed the cli to run the dependency install...

[UX]
Use ink https://github.com/vadimdemedes/ink to have-link experience and components on terminal. Search other deps on claude code.

[Documentation]
Should embedded documentation of cli/sdks being used on the project.
Our wiki should have documentation for each template explaining their big dependencies why being used and how to extend.
have llmstxt for our public resources.
We should research and decide if we will Use https://www.algolia.com/ for AI integration on the docs.
Is there a way we can build a "Map of Maps?" to somehow embedd from all other ecosystem maps of tools and Dapps.
Ideally, all and each template should have an tree of links to feed user's AI within selected templates.

[AI_Integrations]:
how can we make the sdk usable by lovable or other AI generators? THe user should be able to say "use the template XXX from kitdot" or similar commands.

AI Agents and Assistants:
The one who knows all the links...
[TO_IMPLEMENT_FURTHER] Could be connected with SEO data too
Create an workflow to ask different published GPT Agents about polkadot-substrate/etheruem. etc. to ask their link knowledge tree.

- Create GPT Agent with main useful links to help builders.

[Branding]
Ethereum Elements with Polkadot Color Palet.

[Templates]
Add templates for OTP code generation.
Add template with wallet-only (wallet-connect/thirweb and other kits)
Add template PIX integration.
Could we also generate gh projects based on templates? generate wiki?

- [ ] https://github.com/reown-com/appkit-web-examples

React quick-starts/react-quick-start:

- [x] Add button to export PK
- [ ] Fix: First time loading the app on stating (real deploy with saphire devnet) is showing empty items.
- [ ] Apply our brand to the template.
- [ ] Adicionar um exemplo funcional de contrato Oracle, que demonstre a inicialização e a interação com o contrato diretamente no template.

[Research]

- [ ] R&D: Test how to initialize contracts inside contracts.
- [ ] R&D: Pay transactions with any asset -> Leads to templates of it.
- [ ] R&D: Account Abstraction on PolkaVM -> Leads to templates of it.
      What are all the tools from ETH Ecosystem that worths bringing? How many PRs can we open to add "assetHub" within their list of chains...
