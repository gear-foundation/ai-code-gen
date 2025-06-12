import { ADDRESS, AGENT_API_KEY } from "@/app/consts"
import axios from "axios"

import { AgentResponse } from "@/components/home/models/agent_call"

const API_URL = ADDRESS.BACKEND
const IDL_CLIENT_URL = "client_server_agent"

export const client_idl_code = (idl: string): Promise<string> => {
  const url = API_URL + IDL_CLIENT_URL

  return new Promise(async (resolve, reject) => {
    let response: AgentResponse | null = null

    try {
      const temp = await axios.post(
        url,
        {
          question: idl,
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

    resolve(response.answer.replace(/javascript|```|jsx|typescript/g, ""))
  })
}
