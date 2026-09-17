import { getPreferenceValues } from "@raycast/api";

export type Language = "en" | "zh-CN";

export type Copy = {
  locale: string;
  fiveHour: string;
  week: string;
  unknown: string;
  retry: string;
  tryAgain: string;
  addAccount: string;
  refresh: string;
  openExtensionPreferences: string;
  searchPlaceholder: string;
  unableToReadAccounts: string;
  unableToReadUsage: string;
  codexAuthRequired: string;
  codexAuthRequiredDescription: string;
  copyInstallCommand: string;
  installCommandCopied: string;
  openInstallationGuide: string;
  noSavedAccounts: string;
  noSavedAccountsDescription: string;
  accountAlreadyActive: string;
  switchingTo: (account: string) => string;
  switchedTo: (account: string) => string;
  restartCodexClient: string;
  switchFailed: string;
  openingCodexLogin: string;
  completeLoginInBrowser: string;
  accountAdded: string;
  newAccountIsActive: string;
  loginFailed: string;
  removeAccountTitle: (account: string) => string;
  removeLastActiveAccountMessage: string;
  removeActiveAccountMessage: string;
  removeAccountMessage: string;
  removeAccount: string;
  removingAccount: (account: string) => string;
  accountRemoved: string;
  activeAccountUpdated: string;
  removeFailed: string;
  currentAccount: string;
  switchToThisAccount: string;
  refreshUsage: string;
  copyEmail: string;
  remainingUsage: string;
  dataSource: (source: string) => string;
  switchAccount: string;
  extensionPreferences: string;
  days: (count: number) => string;
  hours: (count: number) => string;
  resetTime: (value: string) => string;
  sourceRealtime: string;
  sourceLocal: string;
  sourceCache: string;
  sourceNone: string;
  missingAuthentication: string;
  refreshFailed: string;
  updateTimeUnknown: string;
  updatedAt: (value: string) => string;
  sourceAndUpdateTime: (source: string, updatedAt: string) => string;
  executableNotFoundAt: (filePath: string) => string;
  codexAuthNotFound: string;
  emptyOutput: string;
  invalidOutput: string;
  requestTimedOut: string;
  unsupportedVersion: string;
  processFailed: string;
  registryReadFailed: (filePath: string) => string;
  unsupportedRegistry: string;
  unsupportedSchema: string;
  accountNotFound: string;
  switchNotConfirmed: string;
  removalStateUnknown: string;
  removalNotConfirmed: string;
};

const english: Copy = {
  locale: "en-US",
  fiveHour: "5-hour",
  week: "Week",
  unknown: "Unknown",
  retry: "Retry",
  tryAgain: "Try again later",
  addAccount: "Add Account",
  refresh: "Refresh",
  openExtensionPreferences: "Open Extension Preferences",
  searchPlaceholder: "Search accounts, aliases, or workspaces",
  unableToReadAccounts: "Unable to Read Codex Accounts",
  unableToReadUsage: "Unable to read Codex usage.",
  codexAuthRequired: "codex-auth Is Required",
  codexAuthRequiredDescription: "Install codex-auth 0.3.0 or newer, then retry.",
  copyInstallCommand: "Copy Install Command",
  installCommandCopied: "Install command copied",
  openInstallationGuide: "Open Installation Guide",
  noSavedAccounts: "No Saved Accounts",
  noSavedAccountsDescription: "Sign in to Codex to add an account here.",
  accountAlreadyActive: "This account is already active",
  switchingTo: (account) => `Switching to ${account}`,
  switchedTo: (account) => `Switched to ${account}`,
  restartCodexClient: "Restart any running Codex client to apply the change",
  switchFailed: "Unable to Switch Account",
  openingCodexLogin: "Opening Codex Login",
  completeLoginInBrowser: "Complete the sign-in process in your browser",
  accountAdded: "Account Added",
  newAccountIsActive: "The new account is now active",
  loginFailed: "Unable to Sign In",
  removeAccountTitle: (account) => `Remove ${account}?`,
  removeLastActiveAccountMessage:
    "This is the last saved account and is currently active. Removing it will also remove the local Codex login.",
  removeActiveAccountMessage:
    "This account is currently active. After removal, codex-auth will select another saved account.",
  removeAccountMessage: "This account will be removed from codex-auth. This action cannot be undone.",
  removeAccount: "Remove Account",
  removingAccount: (account) => `Removing ${account}`,
  accountRemoved: "Account Removed",
  activeAccountUpdated: "The active Codex account has been updated",
  removeFailed: "Unable to Remove Account",
  currentAccount: "Current Account",
  switchToThisAccount: "Switch to This Account",
  refreshUsage: "Refresh Usage",
  copyEmail: "Copy Email",
  remainingUsage: "Remaining Usage",
  dataSource: (source) => `Source: ${source}`,
  switchAccount: "Switch Account",
  extensionPreferences: "Extension Preferences",
  days: (count) => `${count} ${count === 1 ? "day" : "days"}`,
  hours: (count) => `${count} ${count === 1 ? "hour" : "hours"}`,
  resetTime: (value) => `Resets: ${value}`,
  sourceRealtime: "Current",
  sourceLocal: "Local Cache",
  sourceCache: "Cached",
  sourceNone: "Unavailable",
  missingAuthentication: "Authentication Missing",
  refreshFailed: "Refresh Failed",
  updateTimeUnknown: "Update Time Unknown",
  updatedAt: (value) => `Updated at ${value}`,
  sourceAndUpdateTime: (source, updatedAt) => `Source: ${source} · Updated: ${updatedAt}`,
  executableNotFoundAt: (filePath) => `Executable not found: ${filePath}`,
  codexAuthNotFound:
    "codex-auth was not found. Install version 0.3.0 or newer, or set its path in the extension preferences.",
  emptyOutput: "codex-auth returned no data.",
  invalidOutput: "Unable to read codex-auth output. Make sure version 0.3.0 or newer is installed.",
  requestTimedOut: "The codex-auth request timed out.",
  unsupportedVersion:
    "The installed codex-auth version does not support the JSON interface required by Raycast. Upgrade to version 0.3.0 or newer.",
  processFailed: "codex-auth failed.",
  registryReadFailed: (filePath) => `Unable to read ${filePath}`,
  unsupportedRegistry: "Unsupported codex-auth account registry format.",
  unsupportedSchema: "Unsupported codex-auth JSON format.",
  accountNotFound: "The account to switch to was not found.",
  switchNotConfirmed: "codex-auth did not confirm the account switch.",
  removalStateUnknown:
    "Unable to verify local state after removal. Refresh the account list before trying again.",
  removalNotConfirmed:
    "codex-auth did not confirm the removal. Refresh the account list before trying again.",
};

const simplifiedChinese: Copy = {
  locale: "zh-CN",
  fiveHour: "5小时",
  week: "周",
  unknown: "未知",
  retry: "重试",
  tryAgain: "请稍后重试",
  addAccount: "新增账户",
  refresh: "刷新",
  openExtensionPreferences: "打开扩展设置",
  searchPlaceholder: "搜索账户、别名或工作区",
  unableToReadAccounts: "无法读取 Codex 账户",
  unableToReadUsage: "无法读取 Codex 额度。",
  codexAuthRequired: "需要安装 codex-auth",
  codexAuthRequiredDescription: "请安装 codex-auth 0.3.0 或更新版本，然后重试。",
  copyInstallCommand: "复制安装命令",
  installCommandCopied: "安装命令已复制",
  openInstallationGuide: "打开安装文档",
  noSavedAccounts: "还没有保存的账户",
  noSavedAccountsDescription: "登录 Codex 后，账户会自动添加到这里。",
  accountAlreadyActive: "这个账户已在使用",
  switchingTo: (account) => `正在切换到 ${account}`,
  switchedTo: (account) => `已切换到 ${account}`,
  restartCodexClient: "重启正在运行的 Codex 客户端后生效",
  switchFailed: "切换失败",
  openingCodexLogin: "正在打开 Codex 登录",
  completeLoginInBrowser: "请在浏览器中完成登录",
  accountAdded: "账户已添加",
  newAccountIsActive: "新账户已设为当前账户",
  loginFailed: "登录失败",
  removeAccountTitle: (account) => `删除 ${account}？`,
  removeLastActiveAccountMessage: "这是当前使用的最后一个账户。删除后，本机 Codex 登录也会被移除。",
  removeActiveAccountMessage: "这是当前使用的账户。删除后，codex-auth 会自动选择另一个已保存账户。",
  removeAccountMessage: "将从 codex-auth 中删除这个账户。此操作无法撤销。",
  removeAccount: "删除账户",
  removingAccount: (account) => `正在删除 ${account}`,
  accountRemoved: "账户已删除",
  activeAccountUpdated: "当前 Codex 账户已更新",
  removeFailed: "删除失败",
  currentAccount: "当前账户",
  switchToThisAccount: "切换到这个账户",
  refreshUsage: "刷新额度",
  copyEmail: "复制邮箱",
  remainingUsage: "剩余额度",
  dataSource: (source) => `数据来源：${source}`,
  switchAccount: "切换账户",
  extensionPreferences: "扩展设置",
  days: (count) => `${count}天`,
  hours: (count) => `${count}小时`,
  resetTime: (value) => `重置时间：${value}`,
  sourceRealtime: "实时",
  sourceLocal: "本地缓存",
  sourceCache: "缓存",
  sourceNone: "暂无",
  missingAuthentication: "缺少认证",
  refreshFailed: "刷新失败",
  updateTimeUnknown: "更新时间未知",
  updatedAt: (value) => `更新于 ${value}`,
  sourceAndUpdateTime: (source, updatedAt) => `数据来源：${source} · 更新时间：${updatedAt}`,
  executableNotFoundAt: (filePath) => `找不到可执行文件：${filePath}`,
  codexAuthNotFound: "未找到 codex-auth。请先安装 0.3.0 或更新版本，或在扩展设置中填写路径。",
  emptyOutput: "codex-auth 没有返回数据。",
  invalidOutput: "无法读取 codex-auth 输出。请确认已安装 0.3.0 或更新版本。",
  requestTimedOut: "codex-auth 请求超时。",
  unsupportedVersion: "当前 codex-auth 版本不支持 Raycast 所需的 JSON 接口。请升级到 0.3.0 或更新版本。",
  processFailed: "codex-auth 执行失败。",
  registryReadFailed: (filePath) => `无法读取 ${filePath}`,
  unsupportedRegistry: "不支持的 codex-auth 账户注册表格式。",
  unsupportedSchema: "不支持的 codex-auth JSON 格式。",
  accountNotFound: "找不到要切换的账户。",
  switchNotConfirmed: "codex-auth 没有确认账户切换结果。",
  removalStateUnknown: "账户删除后无法确认本地状态，请刷新账户列表后再操作。",
  removalNotConfirmed: "codex-auth 没有确认账户已删除，请刷新账户列表后再操作。",
};

export function getCopy(): Copy {
  const preferences = getPreferenceValues<{ language?: Language }>();
  return preferences.language === "zh-CN" ? simplifiedChinese : english;
}
