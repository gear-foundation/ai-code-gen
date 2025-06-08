import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  HStack,
  Icon,
  Text,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/voice-record"
import { useAlert } from "@gear-js/react-hooks"
import { Mic, MicOff } from "lucide-react"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"

interface VoiceRecorderButtonProps {
  onResult: (text: string) => void
}

const languageOptions = [
  { code: "auto", label: "Auto Detect 🌐" },
  { code: "en-US", label: "English 🇺🇸" },
  { code: "es-MX", label: "Español 🇲🇽" },
  { code: "zh-CN", label: "中文 🇨🇳" },
  { code: "ru-RU", label: "Русский 🇷🇺" },
]

function getBrowserLanguage(): string {
  const lang = navigator.language
  return languageOptions.find((opt) => opt.code === lang) ? lang : "en-US"
}

export function VoiceRecorderButton({ onResult }: VoiceRecorderButtonProps) {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition()
  const gearAlert = useAlert()

  const [selectedLanguage, setSelectedLanguage] = useState("auto")

  useEffect(() => {
    if (!listening && transcript) {
      onResult(transcript)
      resetTranscript()
    }
  }, [listening])

  useEffect(() => {
    if (listening && transcript.length > 1000) {
      console.log("Transcript too long, stopping...")
      gearAlert.error("Transcript is too long, stopping...")
      SpeechRecognition.stopListening()
      onResult(transcript)
      resetTranscript()
    }
  }, [transcript, listening])

  const getEffectiveLanguage = () => {
    return selectedLanguage === "auto" ? getBrowserLanguage() : selectedLanguage
  }

  const handleClick = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support voice recognition.")
      return
    }

    if (!listening) {
      SpeechRecognition.startListening({
        continuous: true,
        language: getEffectiveLanguage(),
      })
    } else {
      SpeechRecognition.stopListening()
    }
  }

  const getListeningMessage = () => {
    const lang = getEffectiveLanguage()
    if (lang.startsWith("es")) return "Di algo..."
    if (lang.startsWith("zh")) return "说点什么..."
    if (lang.startsWith("ru")) return "Скажите что-нибудь..."
    return "Say something..."
  }

  return (
    <TooltipProvider>
      <HStack spacing={4} className="w-[71%]">
        <HStack spacing={3}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleClick}
                size="lg"
                className={`border-2 p-4 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-98 ${
                  listening
                    ? "border-gray-700 bg-black text-white hover:bg-gray-800"
                    : "border-gray-700 bg-white text-black hover:bg-gray-100"
                } `}
              >
                <Icon as={listening ? MicOff : Mic} size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <Text size="sm">{listening ? "Stop recording" : "Start recording"}</Text>
            </TooltipContent>
          </Tooltip>

          <select
            className="w-40 rounded-md border border-gray-500 bg-white px-3 py-2 text-sm"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languageOptions.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </HStack>

        {listening && (
          <Box className="w-full max-w-[81%] rounded-md border border-white/20 bg-black/70 p-4 font-mono shadow-md">
            <Text size="sm" className="mb-1 font-semibold text-green-300">
              🎙️ Voice Input Active
            </Text>

            <Text size="sm" className="line-clamp-4 whitespace-pre-wrap text-white/90">
              {transcript || getListeningMessage()}
            </Text>
          </Box>
        )}
      </HStack>
    </TooltipProvider>
  )
}
