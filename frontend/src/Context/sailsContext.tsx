import React, { createContext, useState } from "react";
import SailsCalls from "@/app/SailsCalls";

interface Props {
    children: JSX.Element
}

interface SailsContextI {
    sails: SailsCalls | null,
    setSails:  React.Dispatch<React.SetStateAction<SailsCalls | null>> | null
}

export interface InitSailsI {
    idl?: string,
    network?: string
}

export const sailsContext = createContext<SailsContextI>({
    sails: null,
    setSails: null
});

export const SailsProvider = ({ children }: Props) => {
    const [sails, setSails] = useState<SailsCalls | null>(null);

    return (
        <sailsContext.Provider
            value={{
                sails,
                setSails
            }}
        >
            { children }
        </sailsContext.Provider>
    );
}