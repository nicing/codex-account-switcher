/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** codex-auth Executable - Absolute path to codex-auth 0.3.0 or newer. */
  "codexAuthPath"?: string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `switch-codex-account` command */
  export type SwitchCodexAccount = ExtensionPreferences & {
  /** Usage Refresh - API refresh is current; local refresh avoids network requests but may be stale. */
  "refreshMode": "api" | "local"
}
  /** Preferences accessible in the `codex-usage-menu` command */
  export type CodexUsageMenu = ExtensionPreferences & {
  /** Usage Refresh - Local cache is recommended for background refresh; API refresh makes a request every five minutes. */
  "refreshMode": "local" | "api"
}
}

declare namespace Arguments {
  /** Arguments passed to the `switch-codex-account` command */
  export type SwitchCodexAccount = {}
  /** Arguments passed to the `codex-usage-menu` command */
  export type CodexUsageMenu = {}
}
