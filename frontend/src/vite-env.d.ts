/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*.svg" {
  import * as React from "react"
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}

declare module "vite-plugin-eslint" {
  import { Plugin } from "vite"
  export default function eslintPlugin(options?: {
    cache?: boolean
    include?: string | string[]
    exclude?: string | string[]
    throwOnError?: boolean
    throwOnWarning?: boolean
    overrideConfig?: any
    overrideConfigFile?: string
    fix?: boolean
  }): Plugin
}

declare module "vite-plugin-node-stdlib-browser" {
  import { Plugin } from "vite"
  export default function nodeStdlibBrowser(): Plugin
}
