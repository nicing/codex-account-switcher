import { useCallback, useEffect, useState } from "react";
import { Icon, LaunchType, MenuBarExtra, launchCommand, openExtensionPreferences } from "@raycast/api";
import { CodexAccount, getRefreshMode, listAccounts } from "./lib/codex-auth";
import { getCopy } from "./lib/i18n";
import { accountTitle, remainingPercent, resetTooltip, sourceLabel, windowLabel } from "./lib/presentation";

type MenuState = {
  account?: CodexAccount;
  isLoading: boolean;
  error?: string;
};

export default function Command() {
  const [state, setState] = useState<MenuState>({ isLoading: true });
  const refreshMode = getRefreshMode();
  const copy = getCopy();

  const load = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: undefined }));
    try {
      const result = await listAccounts(refreshMode, true);
      setState({ account: result.accounts.find((account) => account.active), isLoading: false });
    } catch (error) {
      setState({ isLoading: false, error: error instanceof Error ? error.message : copy.unableToReadUsage });
    }
  }, [copy, refreshMode]);

  useEffect(() => {
    void load();
  }, [load]);

  const account = state.account;
  const primaryRemaining = remainingPercent(account?.usage.primary ?? null);
  const menuTitle = primaryRemaining === null ? undefined : `${primaryRemaining}%`;
  const tooltip = account
    ? `${accountTitle(account)} · ${windowLabel(account.usage.primary, copy.fiveHour)}`
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
          <MenuBarExtra.Section title={copy.remainingUsage}>
            <MenuBarExtra.Item
              title={windowLabel(account.usage.primary, copy.fiveHour)}
              subtitle={resetTooltip(account.usage.primary)}
            />
            <MenuBarExtra.Item
              title={windowLabel(account.usage.secondary, copy.week)}
              subtitle={resetTooltip(account.usage.secondary)}
            />
            <MenuBarExtra.Item title={copy.dataSource(sourceLabel(account.usage))} />
          </MenuBarExtra.Section>
        </>
      ) : null}
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          icon={Icon.TwoArrowsClockwise}
          title={copy.switchAccount}
          onAction={openSwitcher}
        />
        <MenuBarExtra.Item icon={Icon.ArrowClockwise} title={copy.refresh} onAction={load} />
        <MenuBarExtra.Item
          icon={Icon.Gear}
          title={copy.extensionPreferences}
          onAction={openExtensionPreferences}
        />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}

async function openSwitcher() {
  await launchCommand({ name: "switch-codex-account", type: LaunchType.UserInitiated });
}
