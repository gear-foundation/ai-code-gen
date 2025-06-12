import { useRef } from "react"
import { AddIcon } from "@/shared/assets/images"
import { useAlert } from "@gear-js/react-hooks"
import { Button } from "@gear-js/vara-ui"
import clsx from "clsx"

import styles from "../../styles/Buttons/button.module.scss"

interface Props {
  title?: string
  onRustFileSubmit: (fileContent: string, fileName: string) => void
  disableButton?: boolean
}

export const ButtonUploadRustCode = ({
  title = "Upload rust code",
  onRustFileSubmit,
  disableButton = false,
}: Props) => {
  const alert = useAlert()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => {
    if (!inputRef.current) return

    inputRef.current.click()
  }

  const handleSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    const file = files ? files[0] : null

    if (!file) return

    if (!file.name.endsWith(".rs")) {
      console.warn("Invalid file extension")
      console.error("Invalid file extension")
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const content = reader.result as string
      const fileName = file.name
      onRustFileSubmit(content, fileName)
    }

    reader.onerror = () => {
      console.error("Error while reading file content")
    }

    reader.readAsText(file)
  }

  return (
    <>
      <Button
        text={title}
        icon={AddIcon}
        size="x-small"
        isLoading={disableButton}
        onClick={handleClick}
        //onClick={handleOnSubmitPrompt}
        color={"transparent"}
        className="[&_svg]:!size-3.5"
      />
      <input type="file" accept=".rs" hidden ref={inputRef} onChange={handleSelectedFile} />
    </>
  )
}
