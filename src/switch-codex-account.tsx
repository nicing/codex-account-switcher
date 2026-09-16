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
import { getCopy } from "./lib/i18n";
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
  const copy = getCopy();

  const load = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: undefined }));
    try {
      const result = await listAccounts(refreshMode);
      setState({ accounts: result.accounts, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : copy.unableToReadAccounts;
      setState({ accounts: [], isLoading: false, error: message });
    }
  }, [copy, refreshMode]);

  useEffect(() => {
    void load();
  }, [load]);

  const performSwitch = useCallback(
    async (account: CodexAccount) => {
      if (account.active) {
        await showToast({ style: Toast.Style.Success, title: copy.accountAlreadyActive });
        return;
      }

      const toast = await showToast({
        style: Toast.Style.Animated,
        title: copy.switchingTo(accountTitle(account)),
      });
      try {
        await switchAccount(account.account_key);
        toast.style = Toast.Style.Success;
        toast.title = copy.switchedTo(accountTitle(account));
        toast.message = copy.restartCodexClient;
        await load();
      } catch (error) {
        toast.style = Toast.Style.Failure;
        toast.title = copy.switchFailed;
        toast.message = error instanceof CodexAuthError ? error.message : copy.tryAgain;
      }
    },
    [copy, load],
  );

  const performLogin = useCallback(async () => {
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: copy.openingCodexLogin,
      message: copy.completeLoginInBrowser,
    });
    try {
      await loginAccount();
      toast.style = Toast.Style.Success;
      toast.title = copy.accountAdded;
      toast.message = copy.newAccountIsActive;
      await load();
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = copy.loginFailed;
      toast.message = error instanceof CodexAuthError ? error.message : copy.tryAgain;
    }
  }, [copy, load]);

  const performRemove = useCallback(
    async (account: CodexAccount) => {
      const confirmed = await confirmAlert({
        icon: Icon.Trash,
        title: copy.removeAccountTitle(accountTitle(account)),
        message: account.active
          ? state.accounts.length === 1
            ? copy.removeLastActiveAccountMessage
            : copy.removeActiveAccountMessage
          : copy.removeAccountMessage,
        primaryAction: {
          title: copy.removeAccount,
          style: Alert.ActionStyle.Destructive,
        },
      });
      if (!confirmed) return;

      const toast = await showToast({
        style: Toast.Style.Animated,
        title: copy.removingAccount(accountTitle(account)),
      });
      try {
        await removeAccount(account.account_key);
        toast.style = Toast.Style.Success;
        toast.title = copy.accountRemoved;
        toast.message = account.active ? copy.activeAccountUpdated : undefined;
        await load();
      } catch (error) {
        toast.style = Toast.Style.Failure;
        toast.title = copy.removeFailed;
        toast.message = error instanceof CodexAuthError ? error.message : copy.tryAgain;
      }
    },
    [copy, load, state.accounts.length],
  );

  return (
    <List isLoading={state.isLoading} searchBarPlaceholder={copy.searchPlaceholder}>
      {state.error ? (
        <List.EmptyView
          icon={Icon.Warning}
          title={copy.unableToReadAccounts}
          description={state.error}
          actions={
            <ActionPanel>
              <Action title={copy.retry} icon={Icon.ArrowClockwise} onAction={load} />
              <Action
                title={copy.addAccount}
                icon={Icon.AddPerson}
                shortcut={Keyboard.Shortcut.Common.New}
                onAction={performLogin}
              />
              <Action
                title={copy.openExtensionPreferences}
                icon={Icon.Gear}
                onAction={openExtensionPreferences}
              />
            </ActionPanel>
          }
        />
      ) : state.accounts.length === 0 && !state.isLoading ? (
        <List.EmptyView
          icon={Icon.PersonCircle}
          title={copy.noSavedAccounts}
          description={copy.noSavedAccountsDescription}
          actions={
            <ActionPanel>
              <Action
                title={copy.addAccount}
                icon={Icon.AddPerson}
                shortcut={Keyboard.Shortcut.Common.New}
                onAction={performLogin}
              />
              <Action title={copy.refresh} icon={Icon.ArrowClockwise} onAction={load} />
              <Action
                title={copy.openExtensionPreferences}
                icon={Icon.Gear}
                onAction={openExtensionPreferences}
              />
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
              {
                text: `${windowLabel(account.usage.primary, copy.fiveHour)} | ${windowLabel(account.usage.secondary, copy.week)}`,
                tooltip:
                  [resetTooltip(account.usage.primary), resetTooltip(account.usage.secondary)]
                    .filter(Boolean)
                    .join("\n") || undefined,
              },
              {
                tag: {
                  value: planLabel(account.plan) ?? copy.unknown,
                  color: planColor(account.plan),
                },
                tooltip: `${usageSummary(account)}\n${sourceTooltip(account.usage)}`,
              },
            ]}
            actions={
              <ActionPanel>
                <Action
                  title={account.active ? copy.currentAccount : copy.switchToThisAccount}
                  icon={account.active ? Icon.CheckCircle : Icon.ArrowRight}
                  onAction={() => performSwitch(account)}
                />
                <Action
                  title={copy.addAccount}
                  icon={Icon.AddPerson}
                  shortcut={Keyboard.Shortcut.Common.New}
                  onAction={performLogin}
                />
                <Action
                  title={copy.refreshUsage}
                  icon={Icon.ArrowClockwise}
                  shortcut={Keyboard.Shortcut.Common.Refresh}
                  onAction={load}
                />
                <Action.CopyToClipboard title={copy.copyEmail} content={account.email} />
                <Action
                  title={copy.removeAccount}
                  icon={Icon.Trash}
                  style={Action.Style.Destructive}
                  shortcut={Keyboard.Shortcut.Common.Remove}
                  onAction={() => performRemove(account)}
                />
                <Action
                  title={copy.openExtensionPreferences}
                  icon={Icon.Gear}
                  onAction={openExtensionPreferences}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
