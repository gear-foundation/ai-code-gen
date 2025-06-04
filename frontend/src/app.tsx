import { useAccount, useApi } from "@gear-js/react-hooks";
import { withProviders } from "@/app/hocs";
import { useEnableWeb3 } from "./app/hooks";
import { Routing } from "./router/AppRoutes";
import "@gear-js/vara-ui/dist/style.css";

function Component() {
  const { isApiReady } = useApi();
  const { isAccountReady, account } = useAccount();
  const { web3IsEnable } = useEnableWeb3();
  const isAppReady = isApiReady && isAccountReady && web3IsEnable;

  // Put your contract id and idl
  // useInitSails({
  //   network: 'wss://testnet.vara.network',
  //   contractId: CONTRACT_DATA.programId,
  //   idl: CONTRACT_DATA.idl,
  //   // You need to put name and mnemonic sponsor if you 
  //   // will use vouchers feature (vouchers are used for gasless,
  //   // and signless accounts)
  //   vouchersSigner: {
  //     sponsorName,
  //     sponsorMnemonic
  //   }
  // });

  // App with context
  return (
    <>
      {/* <Header isAccountVisible={isAccountReady} /> */}
      {/* {isAppReady ? <Routing /> : <ApiLoader />} */}
      <Routing />
    </>
  );
}

export const App = withProviders(Component);















