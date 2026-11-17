export { cn } from "cn"

/** Display helper: "automatic" -> "Automatic". */
export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
