import { AGENT_API_KEY } from "@/consts"
import axios from "axios"

import { client_idl_code } from "@/components/home/api/agent_calls/idl"
import type { AgentResponse } from "@/components/home/models/agent_call"

const API_URL = "https://vara-code-gen-ia-api.vercel.app/ia-generator/"
const FRONTEND_SAILSCALLS = "sailscalls_frontend_agent"
const FRONTEND_SAILSJS = "sailsjs_frontend_agent"
const FRONTEND_WALLETCONNECT = "walletconnect_frontend_agent"
const FRONTEND_GEARJS = "gearjs_frontend_agent"
const FRONTEND_GEARHOOKS = "gearhooks_frontend_agent"

export const sendFrontendGearHooksQuestion = (question: string, idl: string): Promise<string> => {
  const url = API_URL + FRONTEND_GEARHOOKS
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

    const hooksComponent = response.answer.replace(/javascript|```|jsx|typescript/g, "")

    resolve(hooksComponent)
  })
}

export const sendFrontendGearjsQuestion = (question: string): Promise<string> => {
  const url = API_URL + FRONTEND_GEARJS
  let response: AgentResponse | null = null
  let client_code: string

  return new Promise(async (resolve, reject) => {
    try {
      const temp = await axios.post(
        url,
        {
          question: question,
        },
        {
          headers: {
            "X-API-Key": AGENT_API_KEY,
          },
        }
      )
      // client_code = await client_idl_code(idl);

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

    const sailsCallsComponent = response.answer.replace(/javascript|```|jsx|typescript/g, "")

    resolve(sailsCallsComponent)
  })
}

export const sendFrontendSailsjsQuestion = (question: string, idl: string): Promise<string> => {
  const url = API_URL + FRONTEND_SAILSJS
  let response: AgentResponse | null = null

  return new Promise(async (resolve, reject) => {
    try {
      const temp = await axios.post(
        url,
        {
          question: question + "\n\nidl:\n" + idl,
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

    const sailsJsComponent = response.answer.replace(/javascript|```|jsx|tsx|typescript/g, "")

    resolve(sailsJsComponent)
  })
}
