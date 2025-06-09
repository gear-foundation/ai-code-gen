import { ADDRESS, AGENT_API_KEY } from "@/app/consts"
import axios from "axios"

import { AgentResponse } from "@/components/home/models/agent_call"

const API_URL = ADDRESS.BACKEND
const CONTRACT_SERVICE_URL = "service_smartcontract_agent"
const CONTRACT_LIB_URL = "lib_smartcontract_agent"
const CONTRACT_OPTIMIZATION = "optimization_smartcontract_agent"
const CONTRACT_AUDIT = "audit_smartcontract"

export const sendContractAuditQuestion = (currentCode: string): Promise<[string, string]> => {
  return new Promise(async (resolve, reject) => {
    const url_contract_service = API_URL + CONTRACT_AUDIT

    let response: AgentResponse | null = null

    try {
      const temp = await axios.post(
        url_contract_service,
        {
          question: currentCode,
        },
        {
          headers: {
            "X-API-Key": AGENT_API_KEY,
          },
        }
      )

      response = temp.data
    } catch (e) {
      console.log(e)
      const error_message = (e as Error).message
      reject(`Error: ${error_message}`)
      return
    }

    if (!response) {
      reject("Not answer received")
      return
    }

    if ("error" in response) {
      reject(`Error: ${response.error}`)
      return
    }

    let { answer } = response

    if (!answer) {
      reject("No response from server")
      return
    }

    if (typeof answer !== "string") {
      const serializedAnswer = JSON.stringify(answer, null, 2)
      console.log("Unexpected format for data.answer:" + answer)
      reject(serializedAnswer)
      return
    }

    let correctCode =
      answer.search("#[program]") != -1 || answer.search("#[service]") == -1 || answer.search("sails_rs::service") == -1

    if (!correctCode) {
      reject("Code error!! Review the structure of your service code")
    }

    const contractLib = await contract_lib(answer)

    resolve([contractLib, answer.replace(/rust|```/g, "")])
  })
}

export const sendContractOptimizationQuestion = (
  question: string,
  currentContractCode: string,
  historyString: string
): Promise<[string, string]> => {
  return new Promise(async (resolve, reject) => {
    const url_contract_service = API_URL + CONTRACT_OPTIMIZATION

    let response: AgentResponse | null = null

    const agentQuestion = `
        current code: ${currentContractCode}\n
        current prompt: ${question}\n\n
        ${historyString}
        `

    try {
      const temp = await axios.post(
        url_contract_service,
        {
          question: agentQuestion,
        },
        {
          headers: {
            "X-API-Key": AGENT_API_KEY,
          },
        }
      )

      response = temp.data
    } catch (e) {
      console.log(e)
      const error_message = (e as Error).message
      reject(`Error: ${error_message}`)
      return
    }

    if (!response) {
      reject("Not answer received")
      return
    }

    if ("error" in response) {
      reject(`Error: ${response.error}`)
      return
    }

    if (!response.answer) {
      reject("No response from server")
      return
    }

    if (typeof response.answer !== "string") {
      const serializedAnswer = JSON.stringify(response.answer, null, 2)
      console.log("Unexpected format for data.answer:" + response.answer)
      reject(serializedAnswer)
      return
    }

    const contractLib = await contract_lib(response.answer)

    resolve([contractLib, response.answer.replace(/rust|```/g, "")])
  })
}

export const sendContractQuestion = (question: string): Promise<[string, string]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const contractService = await contract_service(question)
      const contractLib = await contract_lib(contractService)

      resolve([contractLib, contractService])
    } catch (e) {
      console.log(e)
      const error_message = (e as Error).message
      reject(`Error: ${error_message}`)
    }
  })
}

export const sendContractDefiQuestion = (question: string): Promise<String> => {
  return new Promise(async (resolve, reject) => {
    const url_contract_service = API_URL + CONTRACT_SERVICE_URL

    let response: AgentResponse | null = null

    try {
      const temp = await axios.post(
        url_contract_service,
        {
          question,
        },
        {
          headers: {
            "X-API-Key": AGENT_API_KEY,
          },
        }
      )

      response = temp.data
    } catch (e) {
      console.log(e)
      const error_message = (e as Error).message
      reject(`Error: ${error_message}`)
      return
    }

    if (!response) {
      reject("Not answer received")
      return
    }

    if ("error" in response) {
      reject(`Error: ${response.error}`)
      return
    }

    if (!response.answer) {
      reject("No response from server")
      return
    }

    if (typeof response.answer !== "string") {
      const serializedAnswer = JSON.stringify(response.answer, null, 2)
      console.log("Unexpected format for data.answer:" + response.answer)
      reject(serializedAnswer)
      return
    }

    const rustCodeRegex = /rust([\s\S]*?)/g
    const matches = response.answer.match(rustCodeRegex) || []

    if (matches.length < 1) {
      console.log("Invalid code!!!")
      // reject('Code provided by agent is not in rust language');
      // return;
    }

    const extractedRustCode = response.answer.replace(/rust|```/g, "")

    resolve(extractedRustCode)
  })
}

const contract_service = (question: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const url_contract_service = API_URL + CONTRACT_SERVICE_URL

    let response: AgentResponse | null = null

    try {
      const temp = await axios.post(
        url_contract_service,
        {
          question,
        },
        {
          headers: {
            "X-API-Key": AGENT_API_KEY,
          },
        }
      )

      response = temp.data
    } catch (e) {
      console.log(e)
      const error_message = (e as Error).message
      reject(`Error: ${error_message}`)
      return
    }

    if (!response) {
      reject("Not answer received")
      return
    }

    if ("error" in response) {
      reject(`Error: ${response.error}`)
      return
    }

    if (!response.answer) {
      reject("No response from server")
      return
    }

    if (typeof response.answer !== "string") {
      const serializedAnswer = JSON.stringify(response.answer, null, 2)
      console.log("Unexpected format for data.answer:" + response.answer)
      reject(serializedAnswer)
      return
    }

    const rustCodeRegex = /rust([\s\S]*?)/g
    const matches = response.answer.match(rustCodeRegex) || []

    if (matches.length < 1) {
      // reject('Code provided by agent is not in rust language');
      // return;
      console.log("Invalid code!!!")
    }

    const extractedRustCode = response.answer.replace(/rust|```/g, "")

    resolve(extractedRustCode)
  })
}

const contract_lib = (contractService: String): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const url_contract_service = API_URL + CONTRACT_LIB_URL

    let response: AgentResponse | null = null

    try {
      const temp = await axios.post(
        url_contract_service,
        {
          question: contractService,
        },
        {
          headers: {
            "X-API-Key": AGENT_API_KEY,
          },
        }
      )

      response = temp.data
    } catch (e) {
      console.log(e)
      const error_message = (e as Error).message
      reject(`Error: ${error_message}`)
      return
    }

    if (!response) {
      reject("Not answer received")
      return
    }

    if ("error" in response) {
      reject(`Error: ${response.error}`)
      return
    }

    if (!response.answer) {
      reject("No response from server")
      return
    }

    if (typeof response.answer !== "string") {
      const serializedAnswer = JSON.stringify(response.answer, null, 2)
      console.log("Unexpected format for data.answer:" + response.answer)
      reject(serializedAnswer)
      return
    }

    const rustCodeRegex = /rust([\s\S]*?)/g
    const matches = response.answer.match(rustCodeRegex) || []

    if (matches.length < 1) {
      console.log("Invalid code!!! creacion de lib")
      // reject('Code provided by agent is not in rust language');
      // return;
    }

    const extractedRustCode = response.answer.replace(/rust|```/g, "")

    resolve(extractedRustCode)
  })
}
