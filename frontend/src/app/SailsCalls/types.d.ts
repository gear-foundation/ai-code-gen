import { HexString } from "@gear-js/api";
import { 
    IKeyringPair, 
    Signer 
} from "@polkadot/types/types";

/**
 * ## Inteface with optional initial values for Sails Calls
 */
export interface ISailsCalls { 
    /**
     * ## Contract id to send messages
     */
    contractId?: HexString,
    /**
     * ## String idl
     */
    idl?: string,
    /**
     * ## Network that SailsCalls will use
     */
    network?: string,
    /**
     * ## Sponsor data that will sign the voucher, voucher updates, etc
     */
    voucherSignerData?: SponsorData
}

export interface SponsorData {
    sponsorName: string,
    sponsorMnemonic: string
}

/**
 * ## Query options
 */
export interface SailsQueryOptions { 
    /**
     * ## User id for the query
     * An ID is required for queries, in this case,
     * the user address, if not specified, address 
     * zero will be used
     */
    userId?: HexString,
    /**
     * ### Arguments, if any, for query method
     * Specify in the array all arguments for service method
     */
    callArguments?: any[],
    /**
     * ### Callbacks for each state of the command
     */
    callbacks?: SailsCallbacks
}

/**
 * ## Command options
 */
export interface SailsCommandOptions {
    /**
     * ### Arguments, if any, for command method
     * Specify in the array all arguments for service method
     */
    callArguments?: any[],
    /**
     * ### Callbacks for each state of the command
     * Callback available:
     * - onSuccess
     * - onError
     * - onLoad
     * - onBlock
     * - onSuccessAsync
     * - onErrorAsync
     * - onLoadAsync
     * - onBlockAsync
     */
    callbacks?: SailsCallbacks,
    /**
     * ## Value (tokens) associated with the message
     * @example
     * const options: SailsCommandOptions = {
     *     // One token
     *     tokensToSend: 1_000_000_000_000n
     * };
     */
    tokensToSend?: bigint,
    /**
     * ## Voucher id that will be used in the current message
     * If voucher id is set, it will be used for current message (HexString).
     */
    voucherId?: HexString
}

export interface WalletSigner {
    userAddress: HexString,
    signer: Signer,
}

/**
 * ## Callbacks that SailsCalls calls in each state of transaction
 */
export interface SailsCallbacks {
    /**
     * ### On success callback
     * Will run this callback if the message was send successfully or 
     * an action with vouchers execute successfully
     * 
     * @returns void
     */
    onSuccess?: () => void,
    /**
     * ### On error callback
     * Will run this callback if something went wrong.
     * 
     * @returns void
     */
    onError?: () => void,
    /**
     * ### On load callback
     * Will run this callback when the message or a voucher action 
     * will be loaded.
     * 
     * @returns void
     */
    onLoad?: () => void,
    /**
     * ### On block callback
     * Will run this callback when command get its blockhash.
     * 
     * It does not work in queries and voucher actions
     * 
     * @param blockHash Optional parameter, gives blockhash of transaction
     * @returns void
     */
    onBlock?: (blockHash?: HexString) => void,
    /**
     * ### On success async callback
     * Will run this callback when if the message was send successfully or 
     * a voucher action execute successfully.
     * Will stop the execution of the command or query to execute the callback.
     * 
     * @returns Promise that the command or query will execute
     */
    onSuccessAsync?: () => Promise<void>,
    /**
     * ### On error async callback
     * Will run this callback if something went wrong.
     * Will stop the execution of the command or query to execute the callback.
     * 
     * @returns Promise that the command or query will execute
     */
    onErrorAsync?: () => Promise<void>,
    /**
     * ### On load async callback
     * Will run this callback when the message or a voucher action will be loaded.
     * Will stop the execution of the command or query to execute the callback.
     * 
     * @returns Promise that the command or query will execute
     */
    onLoadAsync?: () => Promise<void>,
    /**
     * ### On block async callback 
     * Will run this callback when command get its blockhash.
     * Will stop the execution of the command to execute the callback.
     * 
     * It does not work in queries and voucher actions
     * 
     * @param blockHash Optional parameter, gives blockhash of transaction
     * @returns Promise that the command will execute
     */
    onBlockAsync?: (blockHash?: HexString) => Promise<void>,
}
export type ContractId = HexString;
export type ServiceName = string;
export type MethodName = string;
export type UrlArrayData = [ContractId, ServiceName, MethodName];
export type CallbackType = 'onsuccess' 
    | 'asynconsuccess' 
    | 'onerror' 
    | 'asynconerror' 
    | 'onload' 
    | 'asynconload' 
    | 'onblock' 
    | 'asynconblock'; 

export type AccountSigner = IKeyringPair | WalletSigner;