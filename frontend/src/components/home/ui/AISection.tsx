import { useEffect, useRef, useState } from "react"
import { CopyIcon, CorrectIcon, GreenCorrectIcon } from "@/shared/assets/images"
import { useClipboard } from "@/shared/hooks/use-clipboard"
import { useAlert } from "@gear-js/react-hooks"
import { Button } from "@gear-js/vara-ui"

import {
  client_idl_code as clientIdlCode,
  sendContractAuditQuestion,
  sendContractOptimizationQuestion,
  sendContractQuestion,
  sendFrontendGearHooksQuestion,
  sendFrontendGearjsQuestion,
  sendFrontendSailsjsQuestion,
  sendServerQuestion,
  sendWeb3AbstractionGasLessEzTransactionsQuestion,
  sendWeb3AbstractionGasLessFrontendQuestion,
  sendWeb3AbstractionGasLessServerQuestion,
  sendWeb3AbstractionSignlessEzTransactionsQuestion,
} from "../api/agent_calls"
import { AgentResponse } from "../models/agent_question"
import type { AIJavascriptComponentsOptions, AIPromptOptions } from "../models/ai_options"
import styles from "../styles/ai_section.module.scss"
import { AIOptionSelection } from "./AIOptionSelection"
import { AIPromptArea } from "./AIPromptArea"
import { AIResponse } from "./AIResponse"

type AgentCode = string | null

interface ResponseTitles {
  [key: string]: string | [string, string]
}

interface Data {
  responseTitle: string | [string, string]
  optionSelected: AIPromptOptions
  frontendOptionSelected: AIJavascriptComponentsOptions
}

interface AIJavascriptComponents {
  optionFrontendVariantSelected: AIJavascriptComponentsOptions
  optionAbstractionVariantSelected: AIJavascriptComponentsOptions
  frontendVariantSelected: boolean
}

const options = ["Frontend", "Smart Contracts", "Server", "Web3 abstraction"]
const responseTitles: ResponseTitles = {
  Frontend: ["REACT COMPONENT", "LIB"],
  "Smart Contracts": ["LIB.RS", "SERVICE"],
  Server: ["SCRIPT", "LIB"],
  "Web3 abstraction": "ABSTRACTION",
}
const AIFrontendComponentsOptions = [
  "Gearjs",
  "Sailsjs",
  "GearHooks",
  // 'WalletConnect',
  // 'SailsCalls',
]

const AIAbstractionComponentsOptions = [
  // "GasLess/Frontend",
  "GasLess/Server",
  "GasLess/ez-transactions",
  "SignLess/ez-transactions",
]

export const AISection = () => {
  const [prompts, setPrompts] = useState(["", "", "", ""])
  const [waitingForAgent, setWaitingForAgent] = useState(false)
  const [optionSelected, setOptionSelected] = useState<AIPromptOptions>("Frontend")

  const [javascriptComponentSelected, setJavascriptComponentSelected] = useState<AIJavascriptComponents>({
    optionFrontendVariantSelected: "Gearjs",
    // optionAbstractionVariantSelected: 'GasLess/Frontend',
    optionAbstractionVariantSelected: "GasLess/Server",
    frontendVariantSelected: true,
  })

  const [contractInAudit, setContractInAudit] = useState(false)
  const [contractAudited, setContractAudited] = useState(false)

  const [aiResponseTitle, setAIResponseTitle] = useState(responseTitles[optionSelected])
  const [codes, setCodes] = useState<[AgentCode, AgentCode]>([null, null])
  const [idlData, setIdlData] = useState({
    idl: "",
    client: "",
    idlChanged: false,
  })
  const [firstOptionSelected, setFirstOptionSelected] = useState(false)
  const [dataToUse, setDataToUse] = useState<Data>({
    responseTitle: "",
    optionSelected: "Frontend",
    frontendOptionSelected: "Gearjs",
  })

  const [contractHistory, setContractHistory] = useState<AgentResponse[]>([])
  const currentContractCode = useRef<{ lib: string; service: string }>({
    lib: "",
    service: "",
  })

  const alert = useAlert()

  const { hasCopied, onCopy } = useClipboard(
    (dataToUse.optionSelected === "Frontend" && dataToUse.frontendOptionSelected === "Gearjs") ||
      (dataToUse.optionSelected === "Web3 abstraction" && dataToUse.frontendOptionSelected === "GasLess/Frontend") // ||
      ? // dataToUse.frontendOptionSelected === 'GasLess/Server' ||
        // dataToUse.frontendOptionSelected === 'GasLess/ez-transactions'
        (codes[0] as string)
      : (codes[firstOptionSelected ? 0 : 1] as string)
  )

  const handleOnSubmitPrompt = async (
    prompt: string,
    idl: string | null = "",
    updateContract = false,
    auditContract = false
  ) => {
    if (prompt.length === 0 && !auditContract) {
      console.error("prompt cant be empty")
      alert.error("Prompt cant be empty")
      return
    }

    const optionJavascriptSelected = javascriptComponentSelected.frontendVariantSelected
      ? javascriptComponentSelected.optionFrontendVariantSelected
      : javascriptComponentSelected.optionAbstractionVariantSelected

    setDataToUse({
      responseTitle: aiResponseTitle,
      optionSelected,
      frontendOptionSelected: optionJavascriptSelected, // optionFrontendVariantSelected
    })

    setWaitingForAgent(true)
    if (!auditContract) setCodes([null, null])
    else setContractInAudit(true)
    let codesToSet: [AgentCode, AgentCode] = [null, null]
    let clientCode = ""

    try {
      switch (optionSelected) {
        case "Frontend":
          const { optionFrontendVariantSelected } = javascriptComponentSelected

          if (optionFrontendVariantSelected === "Gearjs") {
            console.log("Sending frontend Gearjs question ...")
            codesToSet = [await sendFrontendGearjsQuestion(prompt), null]
            break
          }

          if (!idl) {
            setWaitingForAgent(false)
            alert.error("the idl is missing")
            return
          }

          if (idlData.idlChanged) {
            console.log("Generating client code ...")
            clientCode = await clientIdlCode(idl)
            setIdlData({
              idl,
              client: clientCode,
              idlChanged: false,
            })
          } else {
            clientCode = idlData.client
          }

          switch (optionFrontendVariantSelected) {
            case "Sailsjs":
              console.log("Sending frontend SailsJs question ...")
              codesToSet = [await sendFrontendSailsjsQuestion(prompt, idl), clientCode]
              break
            case "GearHooks":
              console.log("Sending frontend Gear Hooks question ...")
              codesToSet = [await sendFrontendGearHooksQuestion(prompt, idl), clientCode]
              break
          }
          break
        case "Smart Contracts":
          console.log("Sendind contract question ...")

          let serviceCode = codes[1] ? codes[1].trim() : ""

          // if (serviceCode.length < 1) {
          //   alert.error('Cant send ');
          // }

          if (auditContract) {
            console.log("Sending contract audit question ...")

            const currentContractCodeString = `
              ${currentContractCode.current.lib}\n\n
              ${currentContractCode.current.service}
            `

            codesToSet = await sendContractAuditQuestion(currentContractCodeString)

            currentContractCode.current.lib = codesToSet[0] as string
            currentContractCode.current.service = codesToSet[1] as string

            setContractInAudit(false)
            setContractAudited(true)
            break
          }

          // setContractAudited(false);

          if (updateContract && contractHistory.length > 8) {
            alert.error("cant be optimized further")
            setWaitingForAgent(false)
            // setContractOptimizationSelected(false);
            setCodes([currentContractCode.current.lib, currentContractCode.current.service])
            return
          }

          // if (contractOptimizationSelected && contractHistory.length > 0 && contractHistory.length < 9) {
          if (updateContract && (contractHistory.length > 0 || serviceCode.length > 0) && contractHistory.length < 9) {
            console.log("Sending contract update question ...")
            const contractCode = `
            ${currentContractCode.current.lib}\n
            ${currentContractCode.current.service}
            `

            codesToSet = await sendContractOptimizationQuestion(prompt, contractCode, formatContractHistory())

            setContractHistory([
              ...contractHistory,
              {
                userPrompt: prompt,
                agentResponse: `${codesToSet[0]}\n${codesToSet[1]}`,
              },
            ])

            currentContractCode.current.lib = codesToSet[0] as string
            currentContractCode.current.service = codesToSet[1] as string

            break
          }

          codesToSet = await sendContractQuestion(prompt)

          currentContractCode.current.lib = codesToSet[0] as string
          currentContractCode.current.service = codesToSet[1] as string

          setContractHistory([
            {
              userPrompt: prompt,
              agentResponse: `${codesToSet[0]}\n${codesToSet[1]}`,
            },
          ])
          break
        case "Server":
          if (!idl) {
            setWaitingForAgent(false)
            alert.error("the idl is missing")
            return
          }

          if (idlData.idlChanged) {
            console.log("Generating client code ...")
            clientCode = await clientIdlCode(idl)
            setIdlData({
              idl,
              client: clientCode,
              idlChanged: false,
            })
          } else {
            clientCode = idlData.client
          }

          console.log("Sending server question ...")
          codesToSet = [await sendServerQuestion(prompt, idl), clientCode]
          break
        case "Web3 abstraction":
          const { optionAbstractionVariantSelected } = javascriptComponentSelected

          console.log("sending web3 abstraction question ...")

          if (optionAbstractionVariantSelected === "GasLess/Frontend") {
            codesToSet = [await sendWeb3AbstractionGasLessFrontendQuestion(prompt), null]
            break
          }

          if (optionAbstractionVariantSelected === "GasLess/Server") {
            codesToSet = await sendWeb3AbstractionGasLessServerQuestion(prompt)
            break
          }

          // if (optionAbstractionVariantSelected === 'SignLess/ez-transactions') {
          //   if (!idl) {
          //     setWaitingForAgent(false);
          //     alert.error('the idl is missing');
          //     return;
          //   }

          //   if (idlData.idlChanged) {
          //     console.log('Generating client code ...');
          //     clientCode = await clientIdlCode(idl);
          //     setIdlData({
          //       idl,
          //       client: clientCode,
          //       idlChanged: false
          //     });
          //   } else {
          //     clientCode = idlData.client;
          //   }

          //   console.log('sending web3 abstraction question ...');

          //   codesToSet = [await sendWeb3AbstractionSignlessEzTransactionsQuestion(prompt, idl), clientCode];
          //   break;
          // }

          if (!idl) {
            setWaitingForAgent(false)
            alert.error("the idl is missing")
            return
          }

          if (idlData.idlChanged) {
            console.log("Generating client code ...")
            clientCode = await clientIdlCode(idl)
            setIdlData({
              idl,
              client: clientCode,
              idlChanged: false,
            })
          } else {
            clientCode = idlData.client
          }

          switch (optionAbstractionVariantSelected) {
            case "SignLess/ez-transactions":
              codesToSet = [await sendWeb3AbstractionSignlessEzTransactionsQuestion(prompt, idl), clientCode]
              break
            case "GasLess/ez-transactions":
              codesToSet = [await sendWeb3AbstractionGasLessEzTransactionsQuestion(prompt), clientCode]
              break
          }

          break
        default:
          alert.error("No option selected")
      }
    } catch (e) {
      console.log(e)
      alert.error(String(e))
      setWaitingForAgent(false)
      setContractAudited(true)
      setContractInAudit(false)
      return
    }

    setCodes(codesToSet)
    setWaitingForAgent(false)
  }

  const handleOnPromptChange = (promptUpdated: string) => {
    const aiIndexOptionSelected = options.indexOf(optionSelected)
    const userPrompts = [...prompts]
    userPrompts[aiIndexOptionSelected] = promptUpdated
    setPrompts(userPrompts)
  }

  const handleSelected = (_name: string, id: AIPromptOptions) => {
    const aiIndexOptionSelected = options.indexOf(id)
    const title = responseTitles[options[aiIndexOptionSelected]]

    setAIResponseTitle(title)
    setOptionSelected(id)
  }

  const formatContractHistory = (): string => {
    let history = "History:"

    contractHistory.forEach((item) => {
      history += `\n\nuser: ${item.userPrompt}\nassistant: ${item.agentResponse}`
    })

    return history
  }

  useEffect(() => {
    if (optionSelected === "Frontend") {
      setJavascriptComponentSelected({
        ...javascriptComponentSelected,
        frontendVariantSelected: true,
      })
    }

    if (optionSelected === "Web3 abstraction") {
      setJavascriptComponentSelected({
        ...javascriptComponentSelected,
        frontendVariantSelected: false,
      })
    }
  }, [optionSelected])

  return (
    <div className="grid gap-4">
      <AIOptionSelection
        options={options}
        selected={handleSelected}
        currentSelected={optionSelected}
        waitingForResponse={waitingForAgent}
      />
      <AIPromptArea
        onSubmitPrompt={handleOnSubmitPrompt}
        onPromptChange={handleOnPromptChange}
        onLibRustCodeChange={(code: string) => {
          // let serviceCode = codes[1] ?? ' ';

          const optionJavascriptSelected = javascriptComponentSelected.frontendVariantSelected
            ? javascriptComponentSelected.optionFrontendVariantSelected
            : javascriptComponentSelected.optionAbstractionVariantSelected

          setDataToUse({
            responseTitle: responseTitles["Smart Contracts"],
            optionSelected: "Smart Contracts",
            frontendOptionSelected: optionJavascriptSelected,
          })

          let serviceCode = codes[1] ?? ""
          let serviceCodeToSet = serviceCode.length > 1 ? serviceCode : " "

          currentContractCode.current.lib = code

          setCodes([code, serviceCodeToSet])
        }}
        onServiceRustCodeChange={(code: string) => {
          // let libCode = codes[0] ?? ' ';

          const optionJavascriptSelected = javascriptComponentSelected.frontendVariantSelected
            ? javascriptComponentSelected.optionFrontendVariantSelected
            : javascriptComponentSelected.optionAbstractionVariantSelected

          setDataToUse({
            responseTitle: responseTitles["Smart Contracts"],
            optionSelected: "Smart Contracts",
            frontendOptionSelected: optionJavascriptSelected,
          })

          let libCode = codes[0] ?? ""
          let libCodeToSet = libCode.length > 1 ? libCode : " "

          currentContractCode.current.service = code

          setCodes([
            // libCode,
            libCodeToSet,
            code,
          ])
        }}
        onIdlChange={() => {
          setIdlData({
            ...idlData,
            idlChanged: true,
          })
        }}
        defaultPrompt={prompts[options.indexOf(optionSelected)]}
        disableComponents={waitingForAgent}
        optionVariants={
          optionSelected === "Frontend"
            ? AIFrontendComponentsOptions
            : optionSelected === "Web3 abstraction"
              ? AIAbstractionComponentsOptions
              : undefined
        }
        optionVariantSelected={
          // optionSelected === 'Frontend' ? optionFrontendVariantSelected : undefined
          optionSelected === "Frontend"
            ? javascriptComponentSelected.optionFrontendVariantSelected
            : optionSelected === "Web3 abstraction"
              ? javascriptComponentSelected.optionAbstractionVariantSelected
              : undefined
        }
        optionSelected={optionSelected}
        onOptionVariantSelected={
          optionSelected === "Frontend" || optionSelected === "Web3 abstraction"
            ? (optionSelected) => {
                // setOptionFrontendVariantSelected(optionSelected);
                if (javascriptComponentSelected.frontendVariantSelected) {
                  setJavascriptComponentSelected({
                    ...javascriptComponentSelected,
                    optionFrontendVariantSelected: optionSelected as AIJavascriptComponentsOptions,
                  })
                } else {
                  setJavascriptComponentSelected({
                    ...javascriptComponentSelected,
                    optionAbstractionVariantSelected: optionSelected as AIJavascriptComponentsOptions,
                  })
                }
              }
            : undefined
        }
        // isContractQuestion={optionSelected === 'Smart Contracts'}
        updateContractButtonEnable={
          dataToUse.optionSelected === "Smart Contracts" &&
          optionSelected === "Smart Contracts" &&
          (contractHistory.length > 0 || currentContractCode.current.service.length > 0)
        }
        // updateContractButtonEnable={dataToUse.optionSelected == 'Smart Contracts' && contractHistory.length > 0}
        codeAlreadyAudited={contractAudited}
      />

      {/* <VoiceRecorderButton
          onResult={handleOnPromptChange}
        /> */}

      {codes[0] && (
        <AIResponse
          onCodeChange={(newCode) => {
            setContractAudited(false)
            if (optionSelected === "Smart Contracts") {
              if (firstOptionSelected) {
                currentContractCode.current.lib = newCode
                setCodes([newCode, codes[1]])
              } else {
                currentContractCode.current.service = newCode
                setCodes([codes[0], newCode])
              }
            }
          }}
          isUnderReview={contractInAudit}
          editable={optionSelected === "Smart Contracts" && !waitingForAgent}
          responseTitle={
            dataToUse.optionSelected !== "Web3 abstraction"
              ? dataToUse.responseTitle[firstOptionSelected ? 0 : 1]
              : "Abstraction"
          }
          code={
            (dataToUse.optionSelected === "Frontend" && dataToUse.frontendOptionSelected === "Gearjs") ||
            (dataToUse.optionSelected === "Web3 abstraction" && dataToUse.frontendOptionSelected === "GasLess/Frontend") // ||
              ? // dataToUse.frontendOptionSelected === 'GasLess/Server' ||
                // dataToUse.frontendOptionSelected === 'GasLess/ez-transactions'
                (codes[0] as string)
              : (codes[firstOptionSelected ? 0 : 1] as string)
          }
          lang={dataToUse.optionSelected === "Smart Contracts" ? "rust" : "javascript"}
          cornerLeftButtons={
            <>
              {!(
                (
                  (dataToUse.optionSelected === "Frontend" && dataToUse.frontendOptionSelected === "Gearjs") ||
                  (dataToUse.optionSelected === "Web3 abstraction" &&
                    dataToUse.frontendOptionSelected === "GasLess/Frontend")
                ) // ||
                // dataToUse.frontendOptionSelected === 'GasLess/Server' ||
                // dataToUse.frontendOptionSelected === 'GasLess/ez-transactions'
              ) && (
                <>
                  {dataToUse.optionSelected === "Smart Contracts" &&
                    optionSelected === "Smart Contracts" &&
                    contractAudited && (
                      // optionSelected == 'Smart Contracts' && contractAudited && (
                      <div className={styles.correctAuditMessageContainer}>
                        <GreenCorrectIcon className={styles.correctAuditMessageIcon} />
                        <p>Audited</p>
                      </div>
                    )}
                  <Button
                    text={dataToUse.optionSelected === "Smart Contracts" ? "service" : "lib"}
                    size="x-large"
                    color={!firstOptionSelected ? "primary" : "contrast"}
                    className={styles.button}
                    onClick={() => {
                      setFirstOptionSelected(false)
                    }}
                  />
                  <Button
                    text={
                      dataToUse.optionSelected === "Frontend"
                        ? "Component"
                        : dataToUse.optionSelected === "Server"
                          ? "Script"
                          : dataToUse.optionSelected === "Smart Contracts"
                            ? "lib.rs"
                            : "Abstraction"
                    }
                    size="x-large"
                    // color='contrast'
                    color={firstOptionSelected ? "primary" : "contrast"}
                    className={styles.button}
                    onClick={() => {
                      setFirstOptionSelected(true)
                    }}
                  />
                </>
              )}
              <Button
                icon={hasCopied ? CorrectIcon : CopyIcon}
                size="x-large"
                color="contrast"
                className={styles.button}
                onClick={onCopy}
              />
            </>
          }
        />
      )}
    </div>
  )
}
