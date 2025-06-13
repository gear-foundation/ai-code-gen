import { useCallback, useEffect, useState } from "react"

interface UseClipboardReturn {
  hasCopied: boolean
  onCopy: () => void
  setValue: (value: string) => void
}

export const useClipboard = (initialValue?: string): UseClipboardReturn => {
  const [value, setValue] = useState(initialValue || "")
  const [hasCopied, setHasCopied] = useState(false)

  useEffect(() => {
    setValue(initialValue || "")
  }, [initialValue])

  const onCopy = useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value)
      } else {
        // Fallback для старых браузеров
        const textArea = document.createElement("textarea")
        textArea.value = value
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const successful = document.execCommand("copy")
        document.body.removeChild(textArea)

        if (!successful) {
          throw new Error("Failed to copy using execCommand")
        }
      }

      setHasCopied(true)

      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      setHasCopied(false)
    }
  }, [value])

  return {
    hasCopied,
    onCopy,
    setValue,
  }
}
