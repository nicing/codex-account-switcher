import { useCallback, useEffect, useState } from "react";
import {
  Action,
  ActionPanel,
  Alert,
  Color,
  Icon,
  Keyboard,
  List,
  Toast,
  confirmAlert,
  openExtensionPreferences,
  showToast,
} from "@raycast/api";
import {
  CodexAccount,
  CodexAuthError,
  getRefreshMode,
  listAccounts,
  loginAccount,
  removeAccount,
  switchAccount,
} from "./lib/codex-auth";
import {
  accountSubtitle,
  accountTitle,
  planColor,
  planLabel,
  resetTooltip,
  sourceTooltip,
  usageSummary,
  windowLabel,
} from "./lib/presentation";

type ViewState = {
  accounts: CodexAccount[];
  isLoading: boolean;
  error?: string;
};

export default function Command() {
  const [state, setState] = useState<ViewState>({ accounts: [], isLoading: true });
  const refreshMode = getRefreshMode();

  const load = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: undefined }));
    try {
      const result = await listAccounts(refreshMode);
      setState({ accounts: result.accounts, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "无法读取 Codex 账户。";
      setState({ accounts: [], isLoading: false, error: message });
    }
  }, [refreshMode]);

  useEffect(() => {
    void load();
  }, [load]);

  const performSwitch = useCallback(
    async (account: CodexAccount) => {
      if (account.active) {
        await showToast({ style: Toast.Style.Success, title: "这个账户已在使用" });
        return;
      }

      const toast = await showToast({
        style: Toast.Style.Animated,
        title: `正在切换到 ${accountTitle(account)}`,
      });
      try {
        await switchAccount(account.account_key);
        toast.style = Toast.Style.Success;
        toast.title = `已切换到 ${accountTitle(account)}`;
        toast.message = "重启正在运行的 Codex 客户端后生效";
        await load();
      } catch (error) {
        toast.style = Toast.Style.Failure;
        toast.title = "切换失败";
        toast.message = error instanceof CodexAuthError ? error.message : "请稍后重试";
      }
    },
    [load],
  );

  const performLogin = useCallback(async () => {
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "正在打开 Codex 登录",
      message: "请在浏览器中完成登录",
    });
    try {
      await loginAccount();
      toast.style = Toast.Style.Success;
      toast.title = "账户已添加";
      toast.message = "新账户已设为当前账户";
      await load();
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = "登录失败";
      toast.message = error instanceof CodexAuthError ? error.message : "请稍后重试";
    }
  }, [load]);

  const performRemove = useCallback(
    async (account: CodexAccount) => {
      const confirmed = await confirmAlert({
        icon: Icon.Trash,
        title: `删除 ${accountTitle(account)}？`,
        message: account.active
          ? state.accounts.length === 1
            ? "这是当前使用的最后一个账户。删除后，本机 Codex 登录也会被移除。"
            : "这是当前使用的账户。删除后，codex-auth 会自动选择另一个已保存账户。"
          : "将从 codex-auth 中删除这个账户。此操作无法撤销。",
        primaryAction: {
          title: "删除账户",
          style: Alert.ActionStyle.Destructive,
        },
      });
      if (!confirmed) return;

      const toast = await showToast({
        style: Toast.Style.Animated,
        title: `正在删除 ${accountTitle(account)}`,
      });
      try {
        await removeAccount(account.account_key);
        toast.style = Toast.Style.Success;
        toast.title = "账户已删除";
        toast.message = account.active ? "当前 Codex 账户已更新" : undefined;
        await load();
      } catch (error) {
        toast.style = Toast.Style.Failure;
        toast.title = "删除失败";
        toast.message = error instanceof CodexAuthError ? error.message : "请稍后重试";
      }
    },
    [load, state.accounts.length],
  );

  return (
    <List isLoading={state.isLoading} searchBarPlaceholder="搜索账户、别名或工作区">
      {state.error ? (
        <List.EmptyView
          icon={Icon.Warning}
          title="无法读取 Codex 账户"
          description={state.error}
          actions={
            <ActionPanel>
              <Action title="重试" icon={Icon.ArrowClockwise} onAction={load} />
              <Action
                title="新增账户"
                icon={Icon.AddPerson}
                shortcut={Keyboard.Shortcut.Common.New}
                onAction={performLogin}
              />
              <Action title="打开扩展设置" icon={Icon.Gear} onAction={openExtensionPreferences} />
            </ActionPanel>
          }
        />
      ) : state.accounts.length === 0 && !state.isLoading ? (
        <List.EmptyView
          icon={Icon.PersonCircle}
          title="还没有保存的账户"
          description="登录 Codex 后，账户会自动添加到这里。"
          actions={
            <ActionPanel>
              <Action
                title="新增账户"
                icon={Icon.AddPerson}
                shortcut={Keyboard.Shortcut.Common.New}
                onAction={performLogin}
              />
              <Action title="刷新" icon={Icon.ArrowClockwise} onAction={load} />
              <Action title="打开扩展设置" icon={Icon.Gear} onAction={openExtensionPreferences} />
            </ActionPanel>
          }
        />
      ) : (
        state.accounts.map((account) => (
          <List.Item
            key={account.account_key}
            icon={account.active ? { source: Icon.CheckCircle, tintColor: Color.Green } : Icon.Person}
            title={accountTitle(account)}
            subtitle={accountSubtitle(account)}
            keywords={[account.email, account.alias ?? "", account.account_name ?? "", account.plan ?? ""]}
            accessories={[
              ...(account.usage.primary
                ? [
                    {
                      text: windowLabel(account.usage.primary, "5小时"),
                      tooltip: resetTooltip(account.usage.primary),
                    },
                  ]
                : []),
              ...(account.usage.secondary
                ? [
                    {
                      text: windowLabel(account.usage.secondary, "周"),
                      tooltip: resetTooltip(account.usage.secondary),
                    },
                  ]
                : []),
              {
                tag: {
                  value: planLabel(account.plan) ?? "未知",
                  color: planColor(account.plan),
                },
                tooltip: `${usageSummary(account)}\n${sourceTooltip(account.usage)}`,
              },
            ]}
            actions={
              <ActionPanel>
                <Action
                  title={account.active ? "当前账户" : "切换到这个账户"}
                  icon={account.active ? Icon.CheckCircle : Icon.ArrowRight}
                  onAction={() => performSwitch(account)}
                />
                <Action
                  title="新增账户"
                  icon={Icon.AddPerson}
                  shortcut={Keyboard.Shortcut.Common.New}
                  onAction={performLogin}
                />
                <Action
                  title="刷新额度"
                  icon={Icon.ArrowClockwise}
                  shortcut={Keyboard.Shortcut.Common.Refresh}
                  onAction={load}
                />
                <Action.CopyToClipboard title="复制邮箱" content={account.email} />
                <Action
                  title="删除账户"
                  icon={Icon.Trash}
                  style={Action.Style.Destructive}
                  shortcut={Keyboard.Shortcut.Common.Remove}
                  onAction={() => performRemove(account)}
                />
                <Action title="打开扩展设置" icon={Icon.Gear} onAction={openExtensionPreferences} />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
