import { HexString } from "@gear-js/api";
import {KeyringPair} from "@polkadot/keyring/types";
import { createContext, useContext, useState } from "react";

interface Props {
    children: JSX.Element
}

interface DAppContextI {
    currentVoucherId: HexString | null, 
    signlessAccount: KeyringPair | null,
    noWalletSignlessAccountName: string | null,
    setSignlessAccount: React.Dispatch<React.SetStateAction<KeyringPair | null>> | null,
    setNoWalletSignlessAccountName: React.Dispatch<React.SetStateAction<string | null>> | null,
    setCurrentVoucherId: React.Dispatch<React.SetStateAction<HexString | null>> | null
}

export const dAppContext = createContext<DAppContextI>({
    currentVoucherId: null,
    signlessAccount: null,
    noWalletSignlessAccountName: null,
    setSignlessAccount: null,
    setNoWalletSignlessAccountName: null,
    setCurrentVoucherId: null
});   

export const DAppContextProvider = ({ children }: Props)  => {
    const [currentVoucherId, setCurrentVoucherId] = useState<HexString | null>(() => null);
    const [signlessAccount, setSignlessAccount] = useState<KeyringPair | null>(null);
    const [noWalletSignlessAccountName, setNoWalletSignlessAccountName] = useState<string | null>(null);

    return (
        <dAppContext.Provider 
            value={{
                currentVoucherId,
                signlessAccount,
                noWalletSignlessAccountName,
                setCurrentVoucherId,
                setSignlessAccount,
                setNoWalletSignlessAccountName
            }}
        >
            {children}
        </dAppContext.Provider>
    );
};

export const useDAppContext = () => {
    const {
        currentVoucherId,
        signlessAccount,
        noWalletSignlessAccountName,
        setSignlessAccount,
        setNoWalletSignlessAccountName,
        setCurrentVoucherId
    } = useContext(dAppContext);

    return {
        currentVoucherId,
        signlessAccount,
        noWalletSignlessAccountName,
        setSignlessAccount: setSignlessAccount as React.Dispatch<React.SetStateAction<KeyringPair | null>>,
        setNoWalletSignlessAccountName: setNoWalletSignlessAccountName as React.Dispatch<React.SetStateAction<string | null>>,
        setCurrentVoucherId: setCurrentVoucherId as React.Dispatch<React.SetStateAction<HexString | null>>
    }
};