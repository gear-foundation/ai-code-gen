import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import nodePolyfills from "vite-plugin-node-stdlib-browser"
import eslint from "vite-plugin-eslint"
import svgr from "vite-plugin-svgr"
import wasm from "vite-plugin-wasm"
import topLevelAwait from "vite-plugin-top-level-await"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // Необходимые алиасы для поддержки Polkadot
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      path: "path-browserify",
      assert: "assert",
      http: "stream-http",
      https: "https-browserify",
      os: "os-browserify",
    },
  },
  define: {
    // Необходимо для корректной работы с Buffer в браузере
    global: {},
    "process.env": {},
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
      // Поддержка нативных ESM модулей
      supported: {
        bigint: true,
      },
    },
    // Принудительный include пакетов, которые могут вызывать проблемы при сборке
    include: [
      "@gear-js/api",
      "@polkadot/api",
      "@polkadot/util",
      "@polkadot/util-crypto",
      "@polkadot/keyring",
      "@polkadot/types",
    ],
  },
  build: {
    outDir: "build",
    target: "esnext",
    modulePreload: {
      polyfill: true,
    },
    // Настройки для корректной работы с большими пакетами
    rollupOptions: {
      output: {
        manualChunks: {
          polkadotApi: ["@polkadot/api"],
          gearApi: ["@gear-js/api"],
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  plugins: [
    svgr({
      include: "**/*.svg",
      exclude: "",
      svgrOptions: {
        ref: true,
        titleProp: true,
        svgo: true,
        expandProps: "start",
      },
    }),
    react(),
    nodePolyfills(),
    eslint(),
    wasm(),
    topLevelAwait(),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    // Настройки для поддержки WebAssembly
    fs: {
      strict: false,
    },
  },
  preview: {
    port: 3000,
    host: true,
  },
  assetsInclude: ["**/*.wasm?inline", "**/*.txt?inline"],
})
