import { useCallback, useEffect, useState } from "react";
import { Icon, LaunchType, MenuBarExtra, launchCommand, openExtensionPreferences } from "@raycast/api";
import { CodexAccount, getRefreshMode, listAccounts } from "./lib/codex-auth";
import { accountTitle, remainingPercent, resetTooltip, sourceLabel, windowLabel } from "./lib/presentation";

type MenuState = {
  account?: CodexAccount;
  isLoading: boolean;
  error?: string;
};

export default function Command() {
  const [state, setState] = useState<MenuState>({ isLoading: true });
  const refreshMode = getRefreshMode();

  const load = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: undefined }));
    try {
      const result = await listAccounts(refreshMode, true);
      setState({ account: result.accounts.find((account) => account.active), isLoading: false });
    } catch (error) {
      setState({ isLoading: false, error: error instanceof Error ? error.message : "无法读取 Codex 额度。" });
    }
  }, [refreshMode]);

  useEffect(() => {
    void load();
  }, [load]);

  const account = state.account;
  const primaryRemaining = remainingPercent(account?.usage.primary ?? null);
  const menuTitle = primaryRemaining === null ? undefined : `${primaryRemaining}%`;
  const tooltip = account
    ? `${accountTitle(account)} · ${windowLabel(account.usage.primary, "5小时")}`
    : state.error;

  return (
    <MenuBarExtra
      icon={state.error ? Icon.Warning : Icon.Gauge}
      title={menuTitle}
      tooltip={tooltip}
      isLoading={state.isLoading}
    >
      {state.error ? <MenuBarExtra.Item icon={Icon.Warning} title={state.error} /> : null}
      {account ? (
        <>
          <MenuBarExtra.Item icon={Icon.Person} title={accountTitle(account)} subtitle={account.email} />
          <MenuBarExtra.Section title="剩余额度">
            <MenuBarExtra.Item
              title={windowLabel(account.usage.primary, "5小时")}
              subtitle={resetTooltip(account.usage.primary)}
            />
            <MenuBarExtra.Item
              title={windowLabel(account.usage.secondary, "周")}
              subtitle={resetTooltip(account.usage.secondary)}
            />
            <MenuBarExtra.Item title={`数据来源：${sourceLabel(account.usage)}`} />
          </MenuBarExtra.Section>
        </>
      ) : null}
      <MenuBarExtra.Section>
        <MenuBarExtra.Item icon={Icon.TwoArrowsClockwise} title="切换账户" onAction={openSwitcher} />
        <MenuBarExtra.Item icon={Icon.ArrowClockwise} title="刷新" onAction={load} />
        <MenuBarExtra.Item icon={Icon.Gear} title="扩展设置" onAction={openExtensionPreferences} />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}

async function openSwitcher() {
  await launchCommand({ name: "switch-codex-account", type: LaunchType.UserInitiated });
}
