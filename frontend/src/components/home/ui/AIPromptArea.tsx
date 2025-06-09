import { useEffect, useRef, useState } from "react"
import { CorrectIcon } from "@/shared/assets/images"
import { useClipboard } from "@/shared/hooks/use-clipboard"
import { cn } from "@/shared/utils/cn"
import { useAlert } from "@gear-js/react-hooks"
import { Button, buttonStyles, Select, Textarea } from "@gear-js/vara-ui"
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

  useEffect(() => {
    setPromptText(defaultPrompt)
  }, [defaultPrompt])

  return (
    <AIInteractionContainer
      interactionTitle="PROMPT"
      leftSideChildren={
        <>
          <Button
            text={hasCopied ? "" : "Fork repo"}
            size={"x-small"}
            icon={hasCopied ? CorrectIcon : undefined}
            color="grey"
            isLoading={disableComponents}
            className={"whitespace-nowrap"}
            onClick={onCopy}
          />

          <a
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
            rel="noreferrer"
            className={cn(
              buttonStyles.button,
              buttonStyles.transparent,
              buttonStyles["x-small"],
              "leading-none whitespace-nowrap"
            )}
          >
            <GitpodIcon className="*:fill-current *:text-current" />
            Open in Gitpod
          </a>
        </>
      }
    >
      <Textarea
        value={promptText}
        onChange={handlePromptText}
        disabled={disableComponents}
        placeholder="Add your instruction"
        name="prompt"
        rows={0}
        className="flex min-h-40 grow flex-col *:grow *:!rounded-[10px] *:bg-background"
      />
      {optionSelected === "Smart Contracts" && (
        <div className="flex items-center justify-end gap-4">
          <ButtonUploadRustCode
            title="service.rs"
            onRustFileSubmit={handleSubmitServiceRustFIle}
            disableButton={disableComponents}
          />
          <ButtonUploadRustCode
            title="lib.rs"
            onRustFileSubmit={handleSubmitLibrsRustFile}
            disableButton={disableComponents}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {optionVariants && (
          <Select
            name={"Variants"}
            size={"large"}
            className="grow basis-50 *:bg-background *:!py-1.25 md:grow-0"
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
              size={"x-small"}
              isLoading={disableComponents}
              disabled={codeAlreadyAudited}
              onClick={handleOnAuditContract}
            />
            <Button text="Update" size={"x-small"} isLoading={disableComponents} onClick={handleOnUpdateContract} />
          </>
        )}
        <Button
          text="Generate"
          size={"x-small"}
          isLoading={disableComponents}
          onClick={handleOnSubmitPrompt}
          className="grow md:grow-0"
        />

        <ButtonUploadIDL
          onIDLFileSubmit={handleSubmitIDL}
          disableButton={disableComponents}
          className="grow md:grow-0"
        />

        {idlName && <p className="flex grow basis-50 items-center justify-center font-medium md:grow-0">{idlName}</p>}
      </div>
    </AIInteractionContainer>
  )
}
