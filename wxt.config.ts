import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  outDir: "dist",
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["storage", "activeTab", "sidePanel"],
    action: {},
    host_permissions: ["*://*.x.com/*", "*://*.twitter.com/*"]
  }
});
