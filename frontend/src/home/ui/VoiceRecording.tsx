import React, { useEffect, useState } from "react";
import {
  Button,
  Icon,
  Tooltip,
  Text,
  VStack,
  Box,
  Select,
  HStack,
} from "@chakra-ui/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useAlert } from "@gear-js/react-hooks";

interface VoiceRecorderButtonProps {
  onResult: (text: string) => void;
}

const languageOptions = [
  { code: "auto", label: "Auto Detect 🌐" },
  { code: "en-US", label: "English 🇺🇸" },
  { code: "es-MX", label: "Español 🇲🇽" },
  { code: "zh-CN", label: "中文 🇨🇳" },
  { code: "ru-RU", label: "Русский 🇷🇺" },
];

function getBrowserLanguage(): string {
  const lang = navigator.language;
  return languageOptions.find((opt) => opt.code === lang)
    ? lang
    : "en-US";
}

function VoiceRecorderButton({ onResult }: VoiceRecorderButtonProps) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const gearAlert = useAlert();

  const [selectedLanguage, setSelectedLanguage] = useState("auto");

  useEffect(() => {
    if (!listening && transcript) {
      onResult(transcript);
      resetTranscript();
    }
  }, [listening]);

  useEffect(() => {
    if (listening && transcript.length > 1000) {
      console.log("Transcript too long, stopping...");
      gearAlert.error("Transcript is too long, stopping...");
      SpeechRecognition.stopListening();
      onResult(transcript);
      resetTranscript();
    }
  }, [transcript, listening]);

  const getEffectiveLanguage = () => {
    return selectedLanguage === "auto" ? getBrowserLanguage() : selectedLanguage;
  };

  const handleClick = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support voice recognition.");
      return;
    }

    if (!listening) {
      SpeechRecognition.startListening({
        continuous: true,
        language: getEffectiveLanguage(),
      });
    } else {
      SpeechRecognition.stopListening();
    }
  };

  const getListeningMessage = () => {
    const lang = getEffectiveLanguage();
    if (lang.startsWith("es")) return "Di algo...";
    if (lang.startsWith("zh")) return "说点什么...";
    if (lang.startsWith("ru")) return "Скажите что-нибудь...";
    return "Say something...";
  };

  return (
    <HStack 
      spacing={4} 
      // align="start"
      // align='start' 
      w="71%"
    >
      <HStack spacing={3}>
        <Tooltip
          label={listening ? "Stop recording" : "Start recording"}
          hasArrow
        >
          <Button
            onClick={handleClick}
            size="lg"
            p={4}
            bg={listening ? "black" : "white"}
            color={listening ? "white" : "black"}
            border="2px solid"
            borderColor="gray.700"
            boxShadow="lg"
            transition="all 0.3s ease-in-out"
            _hover={{
              transform: "scale(1.05)",
              bg: listening ? "gray.800" : "gray.100",
            }}
            _active={{
              transform: "scale(0.98)",
              boxShadow: "inset 0 0 10px rgba(255,255,255,0.1)",
            }}
          >
            <Icon
              as={listening ? FaMicrophoneSlash : FaMicrophone}
              boxSize={6}
            />
          </Button>
        </Tooltip>

        <Select
          size="sm"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          borderColor="gray.500"
          w="160px"
        >
          {languageOptions.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </Select>
      </HStack>

      {listening && (
        <Box
          bg="blackAlpha.700"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="md"
          p={4}
          w="100%"
          maxW="81%"
          boxShadow="md"
          fontFamily="mono"
        >
          <Text fontSize="sm" color="green.300" fontWeight="semibold" mb={1}>
            🎙️ Voice Input Active
          </Text>

          <Text
            fontSize="sm"
            color="whiteAlpha.900"
            noOfLines={4}
            whiteSpace="pre-wrap"
          >
            {transcript || getListeningMessage()}
          </Text>
        </Box>
      )}
    </HStack>
  );
}

export { VoiceRecorderButton };