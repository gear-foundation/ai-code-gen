import { useEffect, useState } from "react"
import { useAccount } from "@gear-js/react-hooks"
import { web3Enable } from "@polkadot/extension-dapp"

import { name as appName } from "../../../package.json"

export const useEnableWeb3 = () => {
  const { wallets } = useAccount()
  const [isEnable, setIsEnable] = useState(false)
  const [web3IsEnable, setWeb3IsEnable] = useState(false)

  useEffect(() => {
    if (!wallets) return
    if (isEnable) return

    const syncWeb3 = async () => {
      await web3Enable(appName)
      setWeb3IsEnable(true)
      setIsEnable(true)
    }

    syncWeb3()
  }, [wallets])

  return {
    web3IsEnable,
  }
}
