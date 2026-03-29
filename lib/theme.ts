import type { CSSProperties } from "react";
import type { SiteSettings } from "@/sanity/types";

const colorMap: Record<string, string> = {
  primaryColor: "--color-primary",
  secondaryColor: "--color-secondary",
  accentColor: "--color-accent",
  backgroundColor: "--color-bg",
  surfaceColor: "--color-surface",
  textColor: "--color-text",
  textSecondaryColor: "--color-text-secondary",
};

/** Extract hex value from either a plain string or a Sanity color object. */
function extractHex(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && "hex" in (value as Record<string, unknown>)) {
    return (value as { hex: string }).hex;
  }
  return null;
}

export function settingsToCssVars(
  settings: SiteSettings | null
): CSSProperties {
  if (!settings) return {};

  const vars: Record<string, string> = {};

  for (const [key, cssVar] of Object.entries(colorMap)) {
    const hex = extractHex(settings[key as keyof SiteSettings]);
    if (hex) {
      vars[cssVar] = hex;
    }
  }

  return vars as CSSProperties;
}
