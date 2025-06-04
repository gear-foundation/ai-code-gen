import { useInitSails } from "./useSailsUtils";
import { sponsorName, sponsorMnemonic } from "../consts";
import { HexString } from "@gear-js/api";

interface SailsConfigProps {
  network: string;
  contractId: HexString;
  idl: string;
}

export function useSailsConfig({ network, contractId, idl }: SailsConfigProps) {
  useInitSails({
    network: network,
    contractId: contractId,
    idl: idl,
    vouchersSigner: {
      sponsorName,
      sponsorMnemonic,
    },
  });
}