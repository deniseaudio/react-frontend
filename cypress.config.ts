/* eslint import/no-extraneous-dependencies: "off" */
import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    baseUrl: "http://localhost:3001",
  },

  viewportHeight: 768,
  viewportWidth: 1366,
  videoCompression: 20,
});
