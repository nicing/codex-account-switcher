import { Color } from "@raycast/api";
import type { CodexAccount, UsageSnapshot, UsageWindow } from "./codex-auth";

export function accountTitle(account: CodexAccount): string {
  return account.alias || account.account_name || account.email;
}

export function accountSubtitle(account: CodexAccount): string | undefined {
  const refreshError = ["http_error", "missing_auth", "error"].includes(account.usage.refresh.status)
    ? sourceLabel(account.usage)
    : null;
  const parts = [
    account.alias ? account.email : null,
    account.account_name,
    updatedAtLabel(account.usage),
    refreshError,
  ].filter(Boolean);
  return [...new Set(parts)].join(" · ") || undefined;
}

export function planLabel(plan: string | null): string | null {
  if (!plan) return null;
  const key = plan.toLowerCase().replace(/[\s_-]/g, "");
  const labels: Record<string, string> = {
    free: "Free",
    go: "Go",
    plus: "Plus",
    prolite: "Pro 5x",
    pro5x: "Pro 5x",
    pro: "Pro 20x",
    pro20x: "Pro 20x",
    business: "Business",
    enterprise: "Enterprise",
    edu: "Edu",
  };
  return labels[key] ?? plan;
}

export function planColor(plan: string | null): Color {
  const key = plan?.toLowerCase().replace(/[\s_-]/g, "");
  if (key === "plus") return Color.Green;
  if (key === "prolite" || key === "pro5x") return Color.Blue;
  if (key === "pro" || key === "pro20x") return Color.Blue;
  return Color.SecondaryText;
}

export function remainingPercent(window: UsageWindow | null): number | null {
  if (!window || !Number.isFinite(window.used_percent)) return null;
  return Math.max(0, Math.min(100, Math.round(100 - window.used_percent)));
}

export function windowLabel(window: UsageWindow | null, fallback: string): string {
  if (!window) return `${fallback} --`;
  const duration = window.window_minutes;
  const name =
    duration >= 7 * 24 * 60
      ? "周"
      : duration >= 24 * 60
        ? `${Math.round(duration / 1440)}天`
        : `${Math.round(duration / 60)}小时`;
  return `${name} ${remainingPercent(window)}%`;
}

export function resetTooltip(window: UsageWindow | null): string | undefined {
  if (!window?.resets_at) return undefined;
  const date = new Date(window.resets_at * 1000);
  return `重置时间：${new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)}`;
}

export function sourceLabel(usage: UsageSnapshot): string {
  const labels = { api: "实时", local: "本地", cache: "缓存", none: "暂无" } as const;
  if (usage.refresh.status === "http_error" && usage.refresh.http_status)
    return `HTTP ${usage.refresh.http_status}`;
  if (usage.refresh.status === "missing_auth") return "缺少认证";
  if (usage.refresh.status === "error") return "刷新失败";
  return labels[usage.source];
}

export function updatedAtLabel(usage: UsageSnapshot): string {
  if (!usage.updated_at) return "更新时间未知";

  const updated = new Date(usage.updated_at * 1000);
  const now = new Date();
  const sameDay =
    updated.getFullYear() === now.getFullYear() &&
    updated.getMonth() === now.getMonth() &&
    updated.getDate() === now.getDate();
  const formatted = new Intl.DateTimeFormat("zh-CN", {
    ...(sameDay ? {} : { month: "numeric", day: "numeric" }),
    hour: "2-digit",
    minute: "2-digit",
  }).format(updated);
  return `更新于 ${formatted}`;
}

export function sourceTooltip(usage: UsageSnapshot): string {
  const updated = usage.updated_at
    ? new Intl.DateTimeFormat("zh-CN", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(usage.updated_at * 1000))
    : "未知";
  return `数据来源：${sourceLabel(usage)} · 更新时间：${updated}`;
}

export function usageSummary(account: CodexAccount): string {
  return `${windowLabel(account.usage.primary, "5小时")} · ${windowLabel(account.usage.secondary, "周")} · ${sourceLabel(account.usage)}`;
}
