import ReactDOM from "react-dom/client"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"

import { App } from "./app"

import "@gear-js/vara-ui/dist/style.css"
import "@/shared/assets/styles/index.scss"
import "@/styles.css"

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
}

const theme = extendTheme({ colors })

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
)
