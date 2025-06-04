

import { Sails, TransactionBuilder } from "sails-js";
import { SailsIdlParser } from "sails-js-parser";
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { GearApi, GearKeyring, HexString, IUpdateVoucherParams } from "@gear-js/api";
import { 
    UrlArrayData, 
    CallbackType, 
    SailsCallbacks, 
    SailsCommandOptions, 
    AccountSigner, 
    SailsQueryOptions,
    ISailsCalls,
    WalletSigner,
} from "./types";
import { Codec, CodecClass, IKeyringPair } from "@polkadot/types/types";
import { Signer } from "@polkadot/api/types";

export class SailsCalls {
    private sails: Sails;
    private gearApi: GearApi;
    private contractId: HexString | null;
    private idl: boolean | null;
    private accountToSignVouchers: KeyringPair | null;
    private regexCompleteUrl = /^[a-zA-Z0-9]+\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+$/;
    private regexNoContractId = /^[a-zA-Z0-9]+\/[a-zA-Z0-9]+$/;

    private constructor(
        sails: Sails, 
        api: GearApi, 
        contractId: HexString | null, 
        idl: string | null,
        accountToSignVouchers: KeyringPair | null
    ) {
        this.sails = sails;
        this.contractId = contractId;
        this.idl = false;
        this.accountToSignVouchers = accountToSignVouchers;
        this.gearApi = api;
        this.sails.setApi(api);

        if (idl) {
            try {
                this.sails.parseIdl(idl);
                this.idl = true;
            } catch (e) {
                console.error('Idl not set, it is incorrect');
            }
        } 
    }

    /**
     * ## Returs a new SailsCalls instance
     * Static method that returns a new instance of SailsCalls
     * @param data Optional parameter to set initial contractId, idl and network
     * @returns SailsCalls instance
     * @example
     * // Returns SailsCalls instance with no contract id 
     * // and IDL. With network: ws://localhost:9944
     * const sailsCalls = await SailsCalls.new();
     * 
     * // Returns SailsCalls instance with no contract id 
     * // and IDL. With Network: wss://testnet.vara.network
     * const sailsCalls = await SailsCalls.new({
     *     network: 'wss://testnet.vara.network'
     * });
     * 
     * // Returns SailsCalls instance with no contract id.
     * // With IDL and Network: wss://testnet.vara.network
     * const sailsCalls = await SailsCalls.new({
     *     network: 'wss://testnet.vara.network',
     *     idl: CONTRACT.idl // String idl
     * });
     * 
     * // Returns SailsCalls instance with no IDL.
     * // With contract id and Network: wss://testnet.vara.network
     * const sailsCalls = await SailsCalls.new({
     *     network: 'wss://testnet.vara.network',
     *     contractId: CONTRACT.contractId
     * });
     * 
     * // Returns SailsCalls instance with contract id, IDL and 
     * // Network: wss://testnet.vara.network
     * const sailsCalls = await SailsCalls.new({
     *     network: 'wss://testnet.vara.network',
     *     contractId: CONTRACT.contractId,
     *     idl: CONTRACT.idl // String idl
     * });
     * 
     * // Returns SailsCalls instance with contract id, IDL, with 
     * // voucher signer and Network: wss://testnet.vara.network
     * * const sailsCalls = await SailsCalls.new({
     *     network: 'wss://testnet.vara.network',
     *     contractId: CONTRACT.contractId,
     *     idl: CONTRACT.idl // String idl,
     *     voucherSignerData: {
     *         sponsorName: 'Name',
     *         sponsorMnemonic: 'strong void ...'
     *     }
     * });
     */
    static new = (data?: ISailsCalls): Promise<SailsCalls> => {
        return new Promise(async resolve => {
            const parser = await SailsIdlParser.new();
            const sailsInstance = new Sails(parser);

            let contractId: HexString | null = null;
            let idl: string | null = null;
            let network: string = "";
            let voucherSigner: KeyringPair | null = null;
            

            if (data) {
                contractId = data.contractId
                    ? data.contractId
                    : null;
                idl = data.idl 
                    ? data.idl 
                    : null;
                network = data.network 
                    ? data.network 
                    : 'ws://localhost:9944'
                
                if (data.voucherSignerData) {
                    const { sponsorName, sponsorMnemonic } = data.voucherSignerData;

                    try {
                        voucherSigner = await GearKeyring.fromMnemonic(sponsorMnemonic, sponsorName);
                    } catch (e) {
                        console.error('Error while set signer account, voucher signer not set');
                    } 
                }
            }

            const api = await GearApi.create({ 
                providerAddress: network 
            });

            resolve(new SailsCalls(sailsInstance, api, contractId, idl, voucherSigner));
        });
    }

    /**
     * ## SailsCalls command
     * Method to call a command in the contract (to change state).
     * 
     * @param url Url form of the method: 'ContractId/Service/Method' or 'Service/Method' 
     * in case that contract id is set in SailsCalls instance
     * @param signerData Signer that will sign the extrinsic (with wallet or KeyringPair)
     * @param options Optional, arguments for method and callbacks for each state of extrinsic
     * @returns Promise with response of the method
     * @example
     * const contractId = '0xc234d08426b...b03b83afc4d2fd';
     * const voucherId = '0xc0403jdj03...jfi39gn32l2fw';
     * const sailsCalls = await SailsCalls.new({
     *     network: 'wss://testnet.vara.network',
     *     idl: CONTRACT.idl // String idl
     * });
     * 
     * // Call with 'wallet' signer 
     * const { signer } = await web3FromSource(account.meta.source);
     * 
     * const response = await sailsCalls.command(
     *     `${contractId}/ServiceName/MethodName`,
     *     {
     *         userAddress: account.decodedAddress,
     *         signer
     *     }
     * );
     * 
     * // Call with KeyringPair
     * const accountName = 'WalletName';
     * const mnemonic = "strong word ...";
     * const keyringPair = await GearKeyring.fromMnemonic(
     *     sponsorMnemonic, 
     *     sponsorName
     * );
     * 
     * const response = await sailsCalls.command(
     *     `${contractId}/ServiceName/MethodName`,
     *     keyringPair
     * );
     * 
     * // Call with contract id set
     * // If it is not specified, it will throw an error
     * sailsCalls.withContractId('0xsjiqw...');
     * const response = await sailsCalls.command(
     *     `ServiceName/MethodName`,
     *     keyringPair
     * );
     * 
     * // call using voucher
     * const response = await sailsCalls.command(
     *     `ServiceName/MethodName`,
     *     keyringPair,
     *     {
     *         voucherId
     *     }
     * );
     * 
     * // call with associated value
     * // It is necessary that the account has tokens available
     * const response = await sailsCalls.command(
     *     `${contractId}/ServiceName/MethodName`,
     *     {
     *         userAddress: account.decodedAddress,
     *         signer
     *     },
     *     {
     *         // Send one token
     *         tokensToSend: 1_000_000_000_000n,
     *     }
     * );
     * 
     * // Call with all callbacks (all are optionals)
     * // It includes async-await calls
     * const response = await sailsCalls.commamd(
     *     `ServiceName/MethodName`,
     *     keyringPair,
     *     {
     *         callbacks: {
     *             onLoad() {
     *                 console.log('Message to send is loading');
     *             },
     *             onLoadAsync() {
     *                 return new Promise(async resolve => {
     *                     console.log('Loading message with async');
     *                     resolve();
     *                 });
     *             },
     *             onBlock(blockHash) {
     *                 console.log(`Block: ${blockHash}`);
     *             },
     *             onBlockAsync(blockHash) {
     *                 return new Promise(async resolve => {
     *                     console.log(`Block async: ${blockHash}`);
     *                     resolve();
     *                 });
     *             },
     *             onSuccess() {
     *                 console.log('Message send successfully!');
     *             },
     *             onSuccessAsync() {
     *                 return new Promise(async resolve => {
     *                     console.log('Message send!, with async');
     *                     resolve();
     *                 });
     *             },
     *             onError() {
     *                 console.log('An error ocurred!');
     *             },
     *             onErrorAsync() {
     *                 return new Promise(async resolve => {
     *                     console.log('An error ocurred!, with async');
     *                     resolve();
     *                 });
     *             }
     *         }
     *     }
     * );
     * 
     * // Call with arguments
     * const response = await sailsCalls.command(
     *     `${contractId}/ServiceName/MethodName`,
     *     keyringPair,
     *     {
     *         callArguments: [
     *             "Hello!",
     *             {
     *                 name: "DAVID",
     *                 age: 22
     *             }
     *             // More arguments
     *         ]
     *     }
     * );
     * 
     * // A call with all options
     * const response = await sailsCalls.commamd(
     *     `${contractId}/ServiceName/MethodName`,
     *     {
     *         userAddress: account.decodedAddress,
     *         signer
     *     },
     *     {
     *         voucherId,
     *         tokensToSend: 1_000_000_000_000n,
     *         callArguments: [
     *             "Hello!",
     *             {
     *                 name: "DAVID",
     *                 age: 22
     *             }
     *             // More arguments
     *         ],
     *         callbacks: {
     *             onLoad() {
     *                 console.log('Message to send is loading');
     *             },
     *             onLoadAsync() {
     *                 return new Promise(async resolve => {
     *                     console.log('Loading message with async');
     *                     resolve();
     *                 });
     *             },
     *             onBlock(blockHash) {
     *                 console.log(`Block: ${blockHash}`);
     *             },
     *             onBlockAsync(blockHash) {
     *                 return new Promise(async resolve => {
     *                     console.log(`Block async: ${blockHash}`);
     *                     resolve();
     *                 });
     *             },
     *             onSuccess() {
     *                 console.log('Message send successfully!');
     *             },
     *             onSuccessAsync() {
     *                 return new Promise(async resolve => {
     *                     console.log('Message send!, with async');
     *                     resolve();
     *                 });
     *             },
     *             onError() {
     *                 console.log('An error ocurred!');
     *             },
     *             onErrorAsync() {
     *                 return new Promise(async resolve => {
     *                     console.log('An error ocurred!, with async');
     *                     resolve();
     *                 });
     *             }
     *         }
     *     }
     * );
     */
    command = (url: string, signerData: AccountSigner, options?: SailsCommandOptions): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.urlIsCorrect(url)) {
                    const response = await this.executeCommand(
                        url,
                        signerData,
                        options
                    )

                    resolve(response);
                    return;
                }
                
            } catch (e) {
                reject(e);
                return;
            }

            try  {
                if (!this.contractId) {
                    reject("Contract Id not set");
                    return;
                }
                if (this.urlNoContractIdIsCorrect(url)) {
                    const response = await this.executeCommand(
                        this.contractId + '/' + url,
                        signerData,
                        options
                    )

                    resolve(response);
                    return;
                }
            } catch (e) {
                reject(e);
                return;
            }

            reject(`Url is not valid: ${url}`);
        });
    }
    
    /**
     * ## SailsCalls query
     * Method to call a query in the contract (read state)
     * @param url Url form of the method: 'ContractId/Service/Method' or 'Service/Method' 
     * in case that contract id is set in SailsCalls instance
     * @param options arguments for query and callbacks for each state of query, the user address is optional 
     * @returns Promise with response of the query
     * @example
     * const contractId = '0xc234d08426b...b03b83afc4d2fd';
     * const sailsCalls = await SailsCalls.new({
     *     network: 'wss://testnet.vara.network',
     *     idl: CONTRACT.idl // String idl
     * });
     * 
     * // Simple query 
     * // The addres that SailsCalls will use is the 'zero' address
     * // because userId is not specified
     * const response = await sailsCalls.query(
     *     `${contractId}/ServiceName/MethodName`
     * );
     * 
     * // Simple query with user id
     * const response = await sailsCalls.query(
     *     `${contractId}/ServiceName/MethodName`,
     *     {
     *         userId: account.decodedAddress
     *     }
     * );
     * 
     * // Query with contract id set 
     * // If it is not specified, it will throw an error
     * sailsCalls..withContractId('0xsjiqw...');
     * const response = await sailsCalls.query(
     *     `ServiceName/MethodName`,
     *     {
     *         userId: account.decodedAddress
     *     }
     * );
     * 
     * // Query with arguments
     * const response = await sailsCalls.query(
     *     `ServiceName/MethodName`,
     *     {
     *         userId: account.decodedAddress,
     *         callArguments: [
     *             "Hello",
     *             {
     *                 name: 'David',
     *                 age: 22,
     *             },
     *             // etc
     *         ]
     *     }
     * );
     * 
     * // Query with callbacks
     * const response = await sailsCalls.query(
     *     `ServiceName/MethodName`,
     *     {
     *         userId: account.decodedAddress,
     *         callbacks: {
     *             onLoad() {
     *                 console.log('Message to send is loading');
     *             },
     *             onLoadAsync() {
     *                 return new Promise(async resolve => {
     *                     console.log('Loading message with async');
     *                     resolve();
     *                 });
     *             },
     *             onSuccess() {
     *                 console.log('Message send successfully!');
     *             },
     *             onSuccessAsync() {
     *                 return new Promise(async resolve => {
     *                     console.log('Message send!, with async');
     *                     resolve();
     *                 });
     *             },
     *             onError() {
     *                 console.log('An error ocurred!');
     *             },
     *             onErrorAsync() {
     *                 return new Promise(async resolve => {
     *                     console.log('An error ocurred!, with async');
     *                     resolve();
     *                 });
     *             }
     *         }
     *     }
     * );
     * 
     * 
     * // Query with all options:
     * const response = await sailsCalls.query(
     *     `ServiceName/MethodName`,
     *     {
     *         userId: account.decodedAddress,
     *         callArguments: [
     *             "Hello",
     *             {
     *                 name: 'David',
     *                 age: 22,
     *             },
     *             // etc
     *         ],
     *         callbacks: {
     *             onLoad() {
     *                 console.log('Message to send is loading');
     *             },
     *             onLoadAsync() {
     *                 return new Promise(async resolve => {
     *                     console.log('Loading message with async');
     *                     resolve();
     *                 });
     *             },
     *             onSuccess() {
     *                 console.log('Message send successfully!');
     *             },
     *             onSuccessAsync() {
     *                 return new Promise(async resolve => {
     *                     console.log('Message send!, with async');
     *                     resolve();
     *                 });
     *             },
     *             onError() {
     *                 console.log('An error ocurred!');
     *             },
     *             onErrorAsync() {
     *                 return new Promise(async resolve => {
     *                     console.log('An error ocurred!, with async');
     *                     resolve();
     *                 });
     *             }
     *         }
     *     }
     * );
     * 
     */
    query = (url: string, options?: SailsQueryOptions): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            const sailsOptions = options
                ? options
                : {};

            try {
                if (this.urlIsCorrect(url)) {
                    const response = await this.executeQuery(
                        url,
                        sailsOptions
                    )

                    resolve(response);
                    return;
                }
            } catch (e) {
                reject(e);
                return;
            }

            try  {
                if (!this.contractId) {
                    reject("Contract Id not set");
                    return;
                }
                if (this.urlNoContractIdIsCorrect(url)) {
                    const response = await this.executeQuery(
                        this.contractId + '/' + url,
                        sailsOptions
                    )

                    resolve(response);
                    return;
                }
            } catch (e) {
                reject(e);
                return;
            }

            reject(`Url is not valid: ${url}`);
        });
    }

    private executeCommand = (url: string, signerData: AccountSigner, options?: SailsCommandOptions): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            if (!this.idl) {
                reject('idl not specified');
                return;
            }

            const temp = this.urlData(url);

            if (typeof temp === 'string') {
                reject(temp);
                return;
            }

            const { 
                callArguments, 
                callbacks, 
                tokensToSend,
                voucherId
            } = options 
                ? options 
                : { 
                    callArguments: undefined, 
                    callbacks: undefined,
                    tokensToSend: undefined,
                    voucherId: undefined
                  };

            const [
                contractAddress,
                serviceName,
                methodName
            ] = temp;

            this.sails.setProgramId(contractAddress);

            await this.processCallBack('asynconload', callbacks);
            this.processCallBack('onload', callbacks);

            let transaction: TransactionBuilder<unknown>;

            try {
                const services = Object.keys(this.sails.services);

                if (services.indexOf(serviceName) === -1) {
                    reject(`Service does not exists: '${serviceName}'\nServices: [${services}]`);
                    return;
                }

                const functions = Object.keys(this.sails.services[serviceName].functions);

                if (functions.indexOf(methodName) === -1) {
                    reject(`Function does not exists in ${serviceName}: '${methodName}'\nFunctions: [${functions}]`);
                    return;
                }
                
                
                transaction = callArguments
                    ? this.sails.services[serviceName].functions[methodName](...callArguments)
                    : this.sails.services[serviceName].functions[methodName]();
            } catch (e) {
                reject('Error when building command');
                return;
            }

            if ("signer" in signerData) {
                const { userAddress, signer } = signerData as WalletSigner;
                transaction.withAccount(userAddress, { signer: (signer as string | CodecClass<Codec, any[]>) as Signer });
            } else {
                const keyringPair = signerData as IKeyringPair;
                transaction.withAccount(keyringPair);
            }

            if (tokensToSend) {
                transaction.withValue(tokensToSend);
            }

            if (voucherId) {
                transaction.withVoucher(voucherId);
            }

            try {
                await transaction.calculateGas(false, 10);

                const { blockHash, response } = await transaction.signAndSend();

                console.log(`blockhash: ${blockHash}`);

                await this.processCallBack('asynconblock', callbacks, blockHash);
                this.processCallBack('onblock', callbacks, blockHash);

                const serviceResponse = await response();

                await this.processCallBack('asynconsuccess', callbacks);
                this.processCallBack('onsuccess', callbacks);

                resolve(serviceResponse);
            } catch(e) {
                await this.processCallBack('asynconerror', callbacks);
                this.processCallBack('onerror', callbacks);

                reject('Error while sign message or while sending message');
            }
        });
    }

    private executeQuery = (url: string, options: SailsQueryOptions): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            if (!this.idl) {
                reject('idl not specified');
                return;
            }

            const temp = this.urlData(url);

            if (typeof temp === 'string') {
                reject(temp);
                return
            }

            const { userId, callArguments, callbacks } = options;
            

            const [
                contractAddress,
                serviceName,
                methodName
            ] = temp;

            this.sails.setProgramId(contractAddress);

            try {
                await this.processCallBack('asynconload', callbacks);
                this.processCallBack('onload', callbacks);

                const services = Object.keys(this.sails.services);

                if (services.indexOf(serviceName) === -1) {
                    reject(`Service does not exists: '${serviceName}'\nServices: [${services}]`);
                    return;
                }

                const queries = Object.keys(this.sails.services[serviceName].queries);

                if (queries.indexOf(methodName) === -1) {
                    reject(`Query does not exists in ${serviceName}: '${methodName}'\nQueries: [${queries}]`);
                    return;
                }
                
                const queryMethod = this.sails
                    .services[serviceName]
                    .queries[methodName];

                const address = userId
                    ? userId
                    : '0x0000000000000000000000000000000000000000000000000000000000000000'

                const queryResponse = callArguments
                    ? await queryMethod(address, undefined, undefined, ...callArguments)
                    : await queryMethod(address);

                await this.processCallBack('asynconsuccess', callbacks);
                this.processCallBack('onsuccess', callbacks);
                
                resolve(queryResponse);
            } catch (e) {
                await this.processCallBack('asynconerror', callbacks);
                this.processCallBack('onerror', callbacks);
                
                reject('Error while calling query method');
            }
        });
    }

    /**
     * ## Set account to sign feature vouchers
     * @param sponsorMnemonic Sponsor mnemonic to sign vouchers
     * @param sponsorName Sponsor name to sign vouchers
     * @returns void that indicates that signer was set
     * @example
     * const sails = awais SailsCalls.new();
     * await sails.withAccountToSignVouchers({
     *     sponsorName: 'SponsorName',
     *     sponsorMnemonic: 'strong await ...'
     * });
     */
    withAccountToSignVouchers = (
        sponsorMnemonic: string,
        sponsorName: string
    ): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            try {
                const voucherSigner = await GearKeyring.fromMnemonic(sponsorMnemonic, sponsorName);
                this.accountToSignVouchers = voucherSigner;

                resolve();
            } catch (e) {
                reject('Error while set signer account, voucher signer not set');
            } 
        });
    }

    /**
     * ## Creates a new voucher
     * Create a new voucher for an address to the stored contract id
     * The instance need to have the contract id "stored" to be able to do this action
     * @param address User address to afiliate voucher
     * @param initialTokensInVoucher initial tokens for the voucher
     * @param initialExpiredTimeInBlocks initial time expiration in blocks
     * @param callbacks callback for each state of the voucher action
     * @returns issued voucher id
     * @example
     * const userAddress = account.decodedAddress; // 0xjfm2...
     * const contractId = '0xeejnf2...';
     * // You can set the contract id at start of SailsCalls
     * const sails = await SailsCalls.new({
     *     contractId
     * });
     * 
     * sails.withContractId(contractId); // or later with its method
     * 
     * const voucherId = await sails.createVoucher(
     *     userAddress, 
     *     3, // 3 Varas
     *     1_200, // Expiration time in blocks (one hour)
     *     { // All callbacks are optionals
     *         onLoad() {
     *             console.log('Voucher will be created');
     *         },
     *         onLoadAsync() {
     *             return new Promise(async resolve => {
     *                 console.log('Async actions');
     *                 console.log('Voucher will be created');
     *                 resolve();
     *             }
     *         },
     *         onSuccess() {
     *             console.log('Voucher created!');
     *         },
     *         onSuccessAsync() {
     *             return new Promise(async resolve => {
     *                 console.log('Async actions');
     *                 console.log('Voucher created!');
     *                 resolve();
     *             }
     *         },
     *         onError() {
     *             console.log('Error while creating voucher');
     *         },
     *         onErrorAsync() {
     *             return new Promise(async resolve => {
     *                 console.log('Async actions');
     *                 console.log('Error while creating voucher');
     *                 resolve();
     *             }
     *         }
     *     }
     * );
     * 
     */
    createVoucher = (
        userAddress: HexString,
        initialTokensInVoucher: number,
        initialExpiredTimeInBlocks: number,
        callbacks?: SailsCallbacks
    ): Promise<HexString> => {
        return new Promise(async (resolve, reject) => {
            if (!this.contractId) {
                reject('No contract id not set');
                return;
            }

            try {
                const voucherId = this.generateVoucher(
                    userAddress,
                    [this.contractId],
                    initialTokensInVoucher,
                    initialExpiredTimeInBlocks,
                    callbacks
                );

                resolve(voucherId);
            } catch (e) {
                reject(e);
            }
        });
    }

     /**
     * ## Creates a new voucher
     * Create a new voucher for an address to specified contracts id
     * The function create a voucher for an user address and specified contracts id
     * @param address User address to afiliate voucher
     * @param contractsId Contracts id to afilliate the voucher
     * @param initialTokensInVoucher initial tokens for the voucher
     * @param initialExpiredTimeInBlocks initial time expiration in blocks
     * @param callbacks callback for each state of the voucher action
     * @returns issued voucher id
     * @example
     * const userAddress = account.decodedAddress; // 0xjfm2...
     * const contractId = '0xeejnf2...';
     * // You can set the contract id at start of SailsCalls
     * const sails = await SailsCalls.new();
     * 
     * const voucherId = await sails.createVoucherWithContractId(
     *     userAddress, 
     *     [contractId],
     *     3, // 3 Varas
     *     1_200, // Expiration time in blocks (one hour)
     *     { // All callbacks are optionals
     *         onLoad() {
     *             console.log('Voucher will be created');
     *         },
     *         onLoadAsync() {
     *             return new Promise(async resolve => {
     *                 console.log('Async actions');
     *                 console.log('Voucher will be created');
     *                 resolve();
     *             }
     *         },
     *         onSuccess() {
     *             console.log('Voucher created!');
     *         },
     *         onSuccessAsync() {
     *             return new Promise(async resolve => {
     *                 console.log('Async actions');
     *                 console.log('Voucher created!');
     *                 resolve();
     *             }
     *         },
     *         onError() {
     *             console.log('Error while creating voucher');
     *         },
     *         onErrorAsync() {
     *             return new Promise(async resolve => {
     *                 console.log('Async actions');
     *                 console.log('Error while creating voucher');
     *                 resolve();
     *             }
     *         }
     *     }
     * );
     * 
     */
    createVoucherWithContractsId = (
        userAddress: HexString,
        contractsId: HexString[],
        initialTokensInVoucher: number,
        initialExpiredTimeInBlocks: number,
        callbacks?: SailsCallbacks
    ): Promise<HexString> => {
        return new Promise(async (resolve, reject) => {
            try {
                const voucherId = this.generateVoucher(
                    userAddress,
                    contractsId,
                    initialTokensInVoucher,
                    initialExpiredTimeInBlocks,
                    callbacks
                );

                resolve(voucherId);
            } catch (e) {
                reject(e);
            }
        });
    }


    private generateVoucher = (
        userAddress: HexString,
        contractsId: HexString[],
        initialTokensInVoucher: number,
        initialExpiredTimeInBlocks: number,
        callbacks?: SailsCallbacks
    ): Promise<HexString> => {
        return new Promise(async (resolve, reject) => {
            if (!this.accountToSignVouchers) {
                reject('Account to sign vouchers is not set');
                return;
            }

            if (initialTokensInVoucher < 2) {
                reject('Min limit of initial tokens is 2');
                return;
            }

            if (initialExpiredTimeInBlocks < 20) {
                reject('Min limit of blocks is 20');
                return;
            }

            const voucherIssued = await this.gearApi.voucher.issue(
                userAddress,
                1e12 * initialTokensInVoucher,
                initialExpiredTimeInBlocks,
                contractsId
            );

            try {
                await this.signVoucherAction(
                    voucherIssued.extrinsic,
                    callbacks
                );

                resolve(voucherIssued.voucherId);
            } catch (e) {
                reject(e);
            }
        });
    }


    /**
     * ## Renew a voucher at specified blocks
     * @param userAddress address affiliated with the voucher
     * @param voucherId voucher id to renew 
     * @param numOfBlocks number of blocks (min 20)
     * @param callbacks optional callbacks to each state of the voucher action
     * @returns void
     * @example
     * const userAddress = account.decodedAddress; // 0xjfm2...
     * const contractId = '0xeejnf2...';
     * const sails = await SailsCalls.new();
     * 
     * await sails.renewVoucherAmountOfBlocks(
     *     userAddress,
     *     contractId,
     *     1_200, // 1200 blocks = an hour 
     *     { // All callbacks are optionals
     *         onLoad() {
     *             console.log('Voucher will be renewed');
     *         },
     *         onLoadAsync() {
     *             return new Promise(async resolve => {
     *                 console.log('Async actions');
     *                 console.log('Voucher will be renewed');
     *                 resolve();
     *             }
     *         },
     *         onSuccess() {
     *             console.log('Voucher will be renewed');
     *         },
     *         onSuccessAsync() {
     *             return new Promise(async resolve => {
     *                 console.log('Async actions');
     *                 console.log('Voucher will be renewed');
     *                 resolve();
     *             }
     *         },
     *         onError() {
     *             console.log('Voucher will be renewed');
     *         },
     *         onErrorAsync() {
     *             return new Promise(async resolve => {
     *                 console.log('Async actions');
     *                 console.log('Voucher will be renewed');
     *                 resolve();
     *             }
     *         }
     *     }
     * );
     */
    renewVoucherAmountOfBlocks = (
        userAddress: HexString,
        voucherId: HexString,
        numOfBlocks: number,
        callbacks?: SailsCallbacks
    ): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            if (numOfBlocks < 20) {
                reject('Minimum block quantity is 20!');
                return;
            }

            const newVoucherData: IUpdateVoucherParams = {
                prolongDuration: numOfBlocks,
            };

            const voucherUpdate = this.gearApi.voucher.update(userAddress, voucherId, newVoucherData);

            try {
                await this.signVoucherAction(
                    voucherUpdate,
                    callbacks
                );

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }


    /**
     * ## Adds tokens to a voucher
     * @param userAddress address associated with the voucher id
     * @param voucherId voucher id to add the tokens
     * @param numOfTokens address associated with the voucher id
     * @param callbacks optional callbacks to each state of the voucher action
     * @returns void
     * @example
     * const userAddress = account.decodedAddress; // 0xjfm2...
     * const voucherId = '0xeejnf2...';
     * const sails = await SailsCalls.new();
     * 
     * await sails.addTokensToVoucher(
     *     userAddress,
     *     voucherId,
     *     2, // Two tokens
     *     { // All callbacks are optionals
     *         onLoad() {
     *             console.log('Will add tokens to voucher');
     *         },
     *         onLoadAsync() {
     *             return new Promise(async resolve => {
     *                 console.log('Async actions');
     *                 console.log('Will add tokens to voucher');
     *                 resolve();
     *             }
     *         },
     *         onSuccess() {
     *             console.log('Tokens added to voucher!');
     *         },
     *         onSuccessAsync() {
     *             return new Promise(async resolve => {
     *                 console.log('Async actions');
     *                 console.log('Tokens added to voucher!');
     *                 resolve();
     *             }
     *         },
     *         onError() {
     *             console.log('Error while adding tokens to voucher');
     *         },
     *         onErrorAsync() {
     *             return new Promise(async resolve => {
     *                 console.log('Async actions');
     *                 console.log('Error while adding tokens to voucher');
     *                 resolve();
     *             }
     *         }
     *     }
     * );
     */
    addTokensToVoucher = (
        userAddress: HexString,
        voucherId: string, 
        numOfTokens: number,
        callbacks?: SailsCallbacks
    ): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            if (numOfTokens < 0) {
                reject('Cant assign negative tokens!');
                return;
            }

            const newVoucherData: IUpdateVoucherParams = {
                balanceTopUp: 1e12 * numOfTokens
            };

            const voucherUpdate = this.gearApi.voucher.update(userAddress, voucherId, newVoucherData);

            try {
                await this.signVoucherAction(
                    voucherUpdate,
                    callbacks
                );

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }    


    /**
     * ## Obtain all vouchers from an account in a contract
     * @param userAddress user address associated with the voucher
     * @param contractId Optional, contract id of the contract, if not specified, stored contract id will be used
     * @returns list of vouchers id asociated with the user address and contract id.
     * @example
     * const userAddress = account.decodedAddress; // 0xjfm2...
     * const contractId = '0xeejnf2...';
     * const sails = await SailsCalls.new({
     *     contractId
     * });
     * // Will get vouchers from a contract id
     * const vouchersId = await sails.vouchersInContract(
     *     userAddress,
     *     contractId
     * );
     * 
     * // Will get vouchers from stored contract id 
     * const vouchersId = await sails.vouchersInContract(
     *     userAddress
     * );
     * 
     * console.log(vouchersId);
     */
    vouchersInContract = (
        userAddress: HexString, 
        contractId?: HexString
    ): Promise<HexString[]> => {
        return new Promise(async (resolve, reject) => {
            if (!contractId && !this.contractId) {
                reject('Contract id not set');
                return;
            }

            let temp = contractId
                ? contractId
                : this.contractId 
                ? this.contractId
                : undefined;

            

            const vouchersData = await this
                .gearApi
                .voucher
                .getAllForAccount(
                    userAddress, 
                    temp
                );
            const vouchersId = Object.keys(vouchersData);
            
            resolve(vouchersId as HexString[]);
        });
    }

    /**
     * ## Method to know if a voucher has expired
     * @param userAddress user address associated with the voucher
     * @param voucherId voucher id to check
     * @returns Boolean value to check if the voucher is expired
     * @example
     * const userAddress = account.decodedAddress; // 0xjfm2...
     * const contractId = '0xeejnf2...';
     * const sails = await SailsCalls.new();
     * 
     * const expired = await sails.voucherIsExpired(
     *     userAddress,
     *     contractId
     * );
     * 
     * if (expired) console.log('Voucher expired!');
     */
    voucherIsExpired = (
        userAddress: HexString, 
        voucherId: HexString
    ): Promise<boolean> => {
        return new Promise(async resolve => {
            const voucherData = await this
                .gearApi
                .voucher
                .getDetails(userAddress, voucherId);
            const blockHash = await this
                .gearApi
                .blocks
                .getFinalizedHead();
            const blocks = await this
                .gearApi
                .blocks
                .getBlockNumber(blockHash as Uint8Array);

            resolve(blocks.toNumber() > voucherData.expiry);
        });
    }

    /**
     * ## Get the balance from a voucher
     * Gets the balance (num of tokens) from a voucher
     * @param voucherId voucher id
     * @returns balance of the voucher
     * @example
     * const voucherId = '0xeejnf2...';
     * const sails = await SailsCalls.new();
     * 
     * const voucherBalance = await sails.voucherBalance(voucherId);
     * 
     * // prints 'Voucher balance: 5'
     * console.log(`Voucher balance: ${voucherBalance}`);
     */
    voucherBalance = (voucherId: HexString): Promise<number> => {
        return new Promise(async resolve => {
            const voucherBalance = await this.gearApi.balance.findOut(voucherId);
            const voucherBalanceFormated = Number(
                BigInt(voucherBalance.toString()) / 1_000_000_000_000n
            );

            resolve(voucherBalanceFormated);
        });
    }


    private signVoucherAction = (extrinsic: any, callbacks?: SailsCallbacks): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            if (!this.accountToSignVouchers) {
                reject('Account to sign vouchers is not set');
                return;
            }

            this.processCallBack('onload', callbacks);
            await this.processCallBack('asynconload', callbacks);

            try {
                await extrinsic.signAndSend(this.accountToSignVouchers, async (event: any) => {
                    console.log(event.toHuman());
                    const extrinsicJSON: any = event.toHuman();
                    if (extrinsicJSON && extrinsicJSON.status !== 'Ready') {
                        const objectKey = Object.keys(extrinsicJSON.status)[0];
                        if (objectKey === 'Finalized') {
                            this.processCallBack('onsuccess', callbacks);
                            await this.processCallBack('asynconsuccess', callbacks);
                            resolve();
                        }
                    }
                });
            } catch (e) {
                this.processCallBack('onerror', callbacks);
                await this.processCallBack('asynconerror', callbacks);

                console.log(e);

                reject('Error while sign voucher action');
            }
        });
    }


    /**
     * ## Create a new signless account
     * @returns New KeyringPair (Signless account)
     * @example
     * const name = 'CustomName';
     * const sails = await SailsCalls.new();
     * // KeyringPair name will be: signlessPair
     * const signlessAccount = await sails.createNewPairAddress();
     * 
     * // KeyringPair name will be: CustomName
     * const signlessAccount = await sails.createNewPairAddress(name);
     */
    createNewKeyringPair = (nameOfSignlessAccount?: string): Promise<KeyringPair> => {
        return new Promise(async (resolve, reject) => {
            try {
                const name = nameOfSignlessAccount
                    ? nameOfSignlessAccount
                    : 'signlessPair';
                const newPair = await GearKeyring.create(name);
                resolve(newPair.keyring);
            } catch (e) {
                console.log("Error creating new account pair!");
                reject(e);
            }
        });
    }

    /**
     * ## Lock a keyringPair
     * Function to obtain the "locked" version of the signless account
     * @param pair KeyringPair of signless account to lock
     * @param password String to be used to lock the KeyringPair of the signless account
     * @returns a KeyringPair$Json from a locked signless account
     * @example
     * const sails = await SailsCalls.new();
     * const signlessAccount = await sails.createNewPairAddress();
     * const locketKeyringPair = sails.lockeyringPair(
     *     signlessAccount,
     *     "password"
     * );
     */
    lockkeyringPair = (pair: KeyringPair, password: string): KeyringPair$Json => {
        return pair.toJson(password);
    }

    /**
     * ##  Unlocks a locker KeyringPair
     * Function to unlock the "locked" version of the signless account (a "try" is needed in case the password is incorrect)
     * @param pair Locked signless account
     * @param password string that was previously used to block the signless account
     * @returns The KeyringPair of the locked signless account
     * @example
     * const sails = await SailsCalls.new();
     * const signlessAccount = await sails.createNewPairAddress();
     * const lockedKeyringPair = sails.lockeyringPair(
     *     signlessAccount,
     *     "password"
     * );
     * const unlockedKeyringPair = sails.unlockKeyringPair(
     *     lockedKeyringPair,
     *     'password'
     * );
     */
    unlockKeyringPair = (pair: KeyringPair$Json, password: string): KeyringPair => {
        return GearKeyring.fromJson(pair, password);
    }

    /**
     * ## Format keyringPair from contract
     * Gives a correct format to the blocked signless account that was obtained from the contract, so that it can be unblocked
     * @param signlessData Account blocked from giving the correct format
     * @returns Correct signless account (KeyringPair) for later use
     * @example
     * const contractId = '0xdf234...';
     * const noWalletAddress = '0x7d7dw2...';
     * const idl = '...';
     * const sails = await SailsCalls.new({
     *     contractId,
     *     idl
     * });
     * 
     * // Note: Usage example if is used the contract format for signless accounts
     * 
     * const keyringPairFromContract = await sails.query(
     *     'QueryService/SignlessAccountData', // Service and method example
     *     {
     *         callArguments: [
     *             noWalletAddress
     *         ]
     *     }
     * );
     * 
     * const { signlessAccountData } = contractState;
     * 
     * const lockedSignlessData = sails.formatContractSignlessData(
     *     signlessAccountData,
     *     'AccountName'
     * );
     * 
     * console.log('Locked signless account');
     * console.log(lockedSignlessData);
     */
    formatContractSignlessData = (signlessData: any, signlessName: string): KeyringPair$Json => {
        const temp = {
            encoding: {
                content: ['pkcs8','sr25519'],
                type: ['scrypt','xsalsa20-poly1305'],
                version: '3'
            },
            meta: {
                name: signlessName
            }
        };

        const formatEncryptedSignlessData = Object.assign(signlessData, temp);

        return formatEncryptedSignlessData;
    }

    /**
     * ## Modify locked KeyringPair
     * Gives the correct format to the information of a locked signless account to send it to the contract
     * @param pair locked signless account to format it
     * @returns locked signless account with the correct format
     * @example
     * const sails = await SailsCalls.new();
     * const keyringPair = await sails.createNewKeyringPair();
     * const lockedKeyringPair = await sails.lockkeyringPair(
     *     keyringPair,
     *     'password'
     * );
     * 
     * // It contains the correct locked KeyringPair format for contract
     * const modifiedLockedKeyringPair = sails.modifyPairToContract(lockedKeyringPair);
     * 
     * console.log(modifiedLockedKeyringPair);
     */
    modifyPairToContract = (pair: KeyringPair$Json) => {
        const signlessToSend = JSON.parse(JSON.stringify(pair));
        delete signlessToSend['encoding'];
        delete signlessToSend['meta'];
    
        return signlessToSend;
    }


    /**
     * ## Change network for SailsCalls instance
     * Set a network for a SailsCalls instance
     * @param network Network to connect 
     * @example
     * const sails = await SailsCalls.new();
     * sails.withNetwork('wss://testnet.vara.network');
     */
    withNetwork = async (network: string) => {
        const api = await GearApi.create({ 
            providerAddress: network 
        });

        this.gearApi = api;
        this.sails.setApi(api);
    }

    /**
     * ## Change IDL for SailsCalls instance
     * Set IDL to use for a SailsCalls instance.
     *      
     * Throw an error in case of incorrect IDL
     * @param idl string IDL
     * @example
     * const idl = `
     *     service Ping {
     *           Ping : (test: str) -> PingEvent;
     *           query Pong : () -> PingEvent;
     *     };
     * `;
     * const sails = await SailsCalls.new();
     * sails.withIDL(idl);
     */
    withIDL = (idl: string) => {
        try {
            this.sails.parseIdl(idl);
            this.idl = true;
        } catch (e) {
            this.idl = false;
            console.error('Idl not set, it is incorrect');
        }
    }

    /**
     * ## Change contract for SailsCalls instance
     * Set contract id to use for SailsCalls instance
     * @param contractId id of contract
     * @example
     * const contractId = '0xc1211fecb75b2390...00ae3f5dcf6d6f845b3';
     * const sails = await SailsCalls.new();
     * sails.withContractId(contractId);
     */
    withContractId = (contractId: HexString) => {
        this.contractId = contractId;
    }

    private urlIsCorrect = (url: string) => {
        return this.regexCompleteUrl.test(url);
    }

    private urlNoContractIdIsCorrect = (url: string) => {
        return this.regexNoContractId.test(url);
    }

    private urlData = (url: string): UrlArrayData | string => {
        const urlDataArray = url.split('/');

        if (urlDataArray.length < 3 || urlDataArray.length > 3) 
            return 'the url is incorrect';
        
        return urlDataArray as UrlArrayData;
    }

    private processCallBack = async (toCall: CallbackType, callbacks?: SailsCallbacks, block?: HexString) => {
        if (!callbacks) return;
        let callback: (() => void) | undefined;
        switch (toCall) {
            case 'onsuccess': 
                callback = callbacks.onSuccess;
                if (callback) callback();
                break;
            case 'onerror':
                callback = callbacks.onError;
                if (callback) callback();
                break;
            case 'onload':
                callback = callbacks.onLoad;
                if (callback) callback();
                break;
            case 'onblock':
                callback = callbacks.onBlock;
                if (callback) {
                    const func = callback as (blockHash?: HexString) => void;
                    func(block);
                }
                break;
            case 'asynconsuccess':
                callback = callbacks.onSuccessAsync;
                if (callback) await callback();
                break;
            case 'asynconerror':
                callback = callbacks.onErrorAsync;
                if (callback) await callback();
                return;
            case 'asynconload':
                callback = callbacks.onLoadAsync;
                if (callback) await callback();
                return;
            case 'asynconblock':
                callback = callbacks.onBlockAsync;
                if (callback) {
                    const func = callback as (blockHash?: HexString) => Promise<void>;
                    await func(block);
                }
                return;
        }
    }
    
}
