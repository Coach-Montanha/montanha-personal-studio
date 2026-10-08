import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ecossistemamontanha.personalstudio",
  appName: "Montanha Personal Studio",
  webDir: ".output/public",
  backgroundColor: "#F8F9FE",
  server: {
    url: process.env.CAPACITOR_SERVER_URL || "https://montanha-personal-studio.vercel.app",
    cleartext: false,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: process.env.NODE_ENV !== "production",
  },
};

export default config;
