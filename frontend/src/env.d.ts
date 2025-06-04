interface ImportMetaEnv {
  readonly VITE_NODE_ADDRESS: string;
  readonly VITE_AGENT_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
