import { useEffect, useContext } from "react";
import { sailsContext } from "@/Context";
import { HexString } from "@gear-js/api";
import { SponsorData } from "../SailsCalls/types";
import SailsCalls from "../SailsCalls"

export interface InitSailsI {
    contractId?: HexString,
    idl?: string,
    network?: string,
    vouchersSigner?: SponsorData
}


/**
 * ## hook that initializes an instance of Sails
 * @param data An optional argument that specify initial values for Sails
 * @example
 * const Component = () => {
 *     // Init Sails with network: ws://localhost:9944
 *     useInitSails(); 
 * }
 * 
 * const Component = () => {
 *     // Init Sails with network: wss://testnet.vara.network
 *     useInitSails(
 *         network: 'wss://testnet.vara.network'
 *     );
 * }
 * 
 * const Component = () => {
 *     // Init Sails with initial Contract Id 
 *     // and network: wss://testnet.vara.network
 *     useInitSails(
 *         network: 'wss://testnet.vara.network',
 *         contractId: CONTRACT.contractId
 *     );
 * }
 * 
 * const Component = () => {
 *     // Init Sails with initial IDL and 
 *     // network: wss://testnet.vara.network
 *     useInitSails(
 *         network: 'wss://testnet.vara.network',
 *         idl: CONTRACT.idl
 *     );
 * }
 * 
 * const Component = () => {
 *     // Init Sails with initial Contract Id, 
 *     // IDL and network: wss://testnet.vara.network
 *     useInitSails(
 *         network: 'wss://testnet.vara.network',
 *         contractId: CONTRACT.contractId,
 *         idl: CONTRACT.idl
 *     );
 * }
 */

export const useInitSails = async (data?: InitSailsI) => {
    let { setSails } = useContext(sailsContext);

    useEffect(() => {
        const initSails = async () => {
            let network = "";
            let contractId: HexString | undefined = undefined;
            let idl = undefined;
            let voucherSignerData: SponsorData | undefined = undefined;

            if (data) {
                contractId = data.contractId;
                idl = data.idl;

                network = data.network
                    ? data.network
                    : 'ws://localhost:9944';

                voucherSignerData = data.vouchersSigner
                    ? data.vouchersSigner
                    : undefined;
            }

            const sailsInstance = await SailsCalls.new({
                network,
                contractId,
                idl,
                voucherSignerData 
            });

            if (setSails) setSails(sailsInstance);
        };

        initSails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

/**
 * ## Hook that returns the instance of Sails
 * If initiated, returns a Sails instance, otherwise return null
 * @returns Instance of SailsCalls or null
 * @example 
 * const Component = () => {
 *     const sails = useSailsCalls();
 * }
 */
export const useSailsCalls = (): SailsCalls | null => {
    let { sails } = useContext(sailsContext);
    return sails;
}