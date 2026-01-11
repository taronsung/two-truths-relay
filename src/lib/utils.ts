import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export function getRandomEmoji(): string {
  const emojis = ["🌸", "🌷", "🌻", "🌺", "🍀", "🌿", "🦋", "🐝", "🌈", "✨", "💫", "🎀", "🧸", "🍰", "🧁"];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

export function getChoiceLetter(index: number): "A" | "B" | "C" {
  return (["A", "B", "C"] as const)[index];
}

export function getChoiceIndex(letter: "A" | "B" | "C"): number {
  return { A: 0, B: 1, C: 2 }[letter];
}

export async function vibrate(pattern: number | number[] = 10): Promise<void> {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}
