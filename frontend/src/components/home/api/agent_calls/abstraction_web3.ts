import { ADDRESS, AGENT_API_KEY } from "@/app/consts"
import axios from "axios"

import { client_idl_code } from "@/components/home/api/agent_calls/idl"
import type { AgentResponse } from "@/components/home/models/agent_call"

const API_URL = ADDRESS.BACKEND
const WEB3ABSTRACTION_GASLESS_FRONTEND = "gasless_frontend_agent"
const WEB3ABSTRACTION_GASLESS_SERVER = "gasless_server_script_web3abstraction_agent"
const WEB3ABSTRACTION_GASLESS_EZ_TRANSACTIONS = "gasless_ez_web3abstraction_agent"
const WEB3ABSTRACTION_SIGNLESS_EZ_TRANSACTIONS = "signless_ez_web3abstraction_agent"

export const sendWeb3AbstractionGasLessFrontendQuestion = (question: string): Promise<string> => {
  const url = API_URL + WEB3ABSTRACTION_GASLESS_FRONTEND
  let response: AgentResponse | null = null
  let client_code: string

  return new Promise(async (resolve, reject) => {
    try {
      const temp = await axios.post(
        url,
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

    const gaslessComponent = response.answer.replace(/javascript|```|jsx|typescript/g, "")

    resolve(gaslessComponent)
  })
}

export const sendWeb3AbstractionGasLessServerQuestion = (question: string): Promise<[string, string]> => {
  const url = API_URL + WEB3ABSTRACTION_GASLESS_SERVER
  let response: AgentResponse | null = null
  let client_code: string

  return new Promise(async (resolve, reject) => {
    try {
      const temp = await axios.post(
        url,
        {
          question,
        },
        {
          headers: {
            "X-API-Key": AGENT_API_KEY,
          },
        }
      )
      client_code = await client_idl_code(question)
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

    const gaslessComponent = response.answer.replace(/javascript|```|jsx|typescript/g, "")

    resolve([gaslessComponent, client_code])
  })
}

export const sendWeb3AbstractionGasLessEzTransactionsQuestion = (question: string): Promise<string> => {
  const url = API_URL + WEB3ABSTRACTION_GASLESS_EZ_TRANSACTIONS
  let response: AgentResponse | null = null
  let client_code: string

  return new Promise(async (resolve, reject) => {
    try {
      const temp = await axios.post(
        url,
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

    const gaslessComponent = response.answer.replace(/javascript|```|jsx|typescript/g, "")

    resolve(gaslessComponent)
  })
}

export const sendWeb3AbstractionSignlessEzTransactionsQuestion = (question: string, idl: string): Promise<string> => {
  const url = API_URL + WEB3ABSTRACTION_SIGNLESS_EZ_TRANSACTIONS
  let response: AgentResponse | null = null

  return new Promise(async (resolve, reject) => {
    try {
      const temp = await axios.post(
        url,
        {
          question: question + "\n\nIdl:\n" + idl,
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

    const gaslessComponent = response.answer.replace(/javascript|```|jsx|typescript/g, "")

    resolve(gaslessComponent)
  })
}
