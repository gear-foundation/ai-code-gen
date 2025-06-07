import { useEffect, useRef, useState } from "react"
import { AddIcon, CorrectIcon } from "@/shared/assets/images"
import { Textarea, useClipboard } from "@chakra-ui/react"
import { useAlert } from "@gear-js/react-hooks"
import { Button, Select } from "@gear-js/vara-ui"
import clsx from "clsx"

import { GitpodIcon } from "../assets"
import type { AIJavascriptComponentsOptions, AIPromptOptions } from "../models/ai_options"
import styles from "../styles/ai_prompt_area.module.scss"
import { AIInteractionContainer } from "./AIInteractionContainer"
import { ButtonUploadIDL } from "./Buttons/ButtonUploadIDL"
import { ButtonUploadRustCode } from "./Buttons/ButtonUploadRustCode"

const GITCLONE = "git clone "

interface Props {
  onSubmitPrompt: (prompt: string, idl: string | null, updateContract?: boolean, auditContract?: boolean) => void
  onPromptChange?: (prompt: string) => void
  onIdlChange: () => void
  onServiceRustCodeChange: (code: string) => void
  onLibRustCodeChange: (code: string) => void
  disableComponents?: boolean
  defaultPrompt?: string
  optionVariants?: string[]
  optionSelected?: AIPromptOptions
  optionVariantSelected?: AIJavascriptComponentsOptions
  onOptionVariantSelected?: (optionSelected: AIJavascriptComponentsOptions) => void
  updateContractButtonEnable?: boolean
  codeAlreadyAudited?: boolean
}

export const AIPromptArea = ({
  onSubmitPrompt,
  onPromptChange,
  onIdlChange,
  onServiceRustCodeChange,
  onLibRustCodeChange,
  disableComponents = false,
  defaultPrompt = "",
  optionVariants,
  optionSelected = "Frontend",
  optionVariantSelected = "Gearjs",
  onOptionVariantSelected = () => {},
  updateContractButtonEnable = false,
  codeAlreadyAudited = false,
}: Props) => {
  const fileRef = useRef<string | null>(null)
  const rustLibFileRef = useRef<string | null>(null)
  const rustServiceFileRef = useRef<string | null>(null)
  const aRef = useRef<HTMLAnchorElement | null>(null)
  const [promptText, setPromptText] = useState(defaultPrompt)
  const [idlName, setIdlName] = useState<string | null>(null)

  const { hasCopied, onCopy } = useClipboard(
    optionSelected === "Frontend"
      ? GITCLONE + "https://gitpod.io/new/#https://github.com/Vara-Lab/dapp-template.git"
      : optionSelected === "Smart Contracts"
        ? GITCLONE + "https://gitpod.io/new/#https://github.com/Vara-Lab/Smart-Program-Template.git"
        : optionSelected === "Server"
          ? GITCLONE + "https://gitpod.io/new/#https://github.com/Vara-Lab/Server-Template.git"
          : (optionSelected === "Web3 abstraction" && optionVariantSelected === "GasLess/ez-transactions") ||
              (optionSelected === "Web3 abstraction" && optionVariantSelected === "SignLess/ez-transactions")
            ? GITCLONE + "https://gitpod.io/new/#https://github.com/Vara-Lab/ez-dApp-Template.git"
            : GITCLONE + "https://gitpod.io/new/#https://github.com/Vara-Lab/dapp-template.git"
  )
  const alert = useAlert()

  const handleSubmitIDL = (fileContent: string, fileName: string) => {
    fileRef.current = fileContent
    setIdlName(fileName)
    onIdlChange()
  }

  const handleSubmitLibrsRustFile = (fileContent: string, _filename: string) => {
    rustLibFileRef.current = fileContent
    onLibRustCodeChange(fileContent)
  }

  const handleSubmitServiceRustFIle = (fileContent: string, _filename: string) => {
    rustServiceFileRef.current = fileContent
    onServiceRustCodeChange(fileContent)
  }

  const handlePromptText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    if (value.length > 1000) {
      alert.error("Prompt is too long")
      console.log("Prompt is too long")
      return
    }

    setPromptText(value)

    if (onPromptChange) onPromptChange(value)
  }

  const handleOnUpdateContract = () => {
    onSubmitPrompt(promptText, fileRef.current, true)
  }

  const handleOnAuditContract = () => {
    onSubmitPrompt(promptText, fileRef.current, false, true)
  }

  const handleOnSubmitPrompt = () => {
    onSubmitPrompt(promptText, fileRef.current, true)
  }

  const handleAnchorCLick = () => {
    if (!aRef.current) return

    aRef.current.click()
  }

  useEffect(() => {
    setPromptText(defaultPrompt)
  }, [defaultPrompt])

  return (
    <AIInteractionContainer
      interactionTitle="PROMPT"
      leftSideChildren={
        <>
          {optionVariants && (
            <Select
              className={styles.selectFrontendOptions}
              disabled={disableComponents}
              value={optionVariantSelected}
              onChange={(e) => {
                const indexVariantSelected = optionVariants.indexOf(e.target.value)
                const variantSelected = optionVariants[indexVariantSelected] as AIJavascriptComponentsOptions
                onOptionVariantSelected(variantSelected)
              }}
              options={optionVariants.map((value) => {
                return {
                  label: value,
                  value,
                  // selected: value === optionVariantSelected,
                }
              })}
            />
          )}
          {updateContractButtonEnable && (
            <>
              <Button
                text="Audit"
                size="x-large"
                isLoading={disableComponents}
                disabled={codeAlreadyAudited}
                onClick={handleOnAuditContract}
                className={clsx(styles.button, styles.buttonGreen)}
              />
              <Button
                text="Update"
                size="x-large"
                isLoading={disableComponents}
                onClick={handleOnUpdateContract}
                className={clsx(styles.button, styles.buttonGreen)}
              />
            </>
          )}
          <Button
            text="Generate"
            size="x-large"
            isLoading={disableComponents}
            onClick={handleOnSubmitPrompt}
            className={clsx(styles.button, styles.buttonGreen)}
          />
          <a
            ref={aRef}
            href={
              optionSelected === "Frontend"
                ? "https://gitpod.io/new/#https://github.com/Vara-Lab/dapp-template.git"
                : optionSelected === "Smart Contracts"
                  ? "https://gitpod.io/new/#https://github.com/Vara-Lab/Smart-Program-Template.git"
                  : optionSelected === "Server"
                    ? "https://gitpod.io/new/#https://github.com/Vara-Lab/Server-Template.git"
                    : (optionSelected === "Web3 abstraction" && optionVariantSelected === "GasLess/ez-transactions") ||
                        (optionSelected === "Web3 abstraction" && optionVariantSelected === "SignLess/ez-transactions")
                      ? "https://gitpod.io/new/#https://github.com/Vara-Lab/ez-dApp-Template.git"
                      : "https://gitpod.io/new/#https://github.com/Vara-Lab/dapp-template.git"
            }
            target="_blank"
            style={{ display: "none" }} rel="noreferrer"
          />

          <Button
            text="Open in Gitpod"
            icon={GitpodIcon}
            color="contrast"
            isLoading={disableComponents}
            className={clsx(styles.button)}
            onClick={handleAnchorCLick}
          />

          <Button
            text={hasCopied ? "" : "Copy repository"}
            icon={hasCopied ? CorrectIcon : undefined}
            color="contrast"
            isLoading={disableComponents}
            className={clsx([styles.button, styles.buttonFixedSizeCopyRepo])}
            onClick={onCopy}
          />

          <ButtonUploadIDL onIDLFileSubmit={handleSubmitIDL} disableButton={disableComponents} />
          <p className={styles.idlName}>{idlName ? idlName : ""}</p>
        </>
      }
    >
      <Textarea
        focusBorderColor="green.400"
        borderColor="gray.200"
        backgroundColor="white"
        borderRadius={14}
        padding="30px 30px"
        resize="none"
        disabled={disableComponents}
        flex={1}
        placeholder="Add your instruction"
        value={promptText}
        onChange={handlePromptText}
      />
      {optionSelected == "Smart Contracts" && (
        <div className={styles.contractButtonsAdditionContainer}>
          <ButtonUploadRustCode
            title="Add service.rs"
            onRustFileSubmit={handleSubmitServiceRustFIle}
            disableButton={disableComponents}
          />
          <ButtonUploadRustCode
            title="Add lib.rs"
            onRustFileSubmit={handleSubmitLibrsRustFile}
            disableButton={disableComponents}
          />
        </div>
      )}
    </AIInteractionContainer>
  )
}
