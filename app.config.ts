import { defineAppConfig } from 'rwsdk';
import { execSync } from "node:child_process";

// x-release-please-start-version
const APP_VERSION = "1.7.1";
// x-release-please-end-version

let gitCommitSHA = "dev";
if (process.env.APP_ENV !== "development") {
  try {
    gitCommitSHA = execSync("git rev-parse --short HEAD")
      .toString()
      .trim()
      .substring(0, 7);
  } catch (error) {
    console.error("Error getting git commit SHA:", error);
  }
}
const fqAppVersion = `v${APP_VERSION}-${gitCommitSHA}`;

export default defineAppConfig({
  name: 'SolStatus',
  version: fqAppVersion,
  env: {
    APP_VERSION: fqAppVersion,
    APP_ENV: process.env.APP_ENV,
  },
  meta: {
    title: 'SolStatus',
    description: 'SolStatus - Endpoint monitoring made simple',
    themeColor: {
      light: "#ffffff",
      dark: "#09090b",
    },
    viewport: 'width=device-width, initial-scale=1',
    icon: '/favicon.ico?v=2',
    appleTouchIcon: '/apple-touch-icon.png?v=2',
    shortcutIcon: '/icon-192.png?v=2',
  },
  crons: [
    // Define any cron jobs here
  ]
});