export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatPercent(value: number | null | undefined) {
  return `${Math.round((value ?? 0) * 100)}%`;
}

export function titleCase(value: string) {
  return value
    .split("_")
    .join(" ")
    .split(".")
    .join(" ")
    .replace(/\b\w/g, (match: string) => match.toUpperCase());
}
