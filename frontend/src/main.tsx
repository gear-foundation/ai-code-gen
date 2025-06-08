import React from "react"
import ReactDOM from "react-dom/client"

import { App } from "./app"

import "@gear-js/vara-ui/dist/style.css"
import "@/shared/assets/styles/index.scss"
import "@/styles.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
