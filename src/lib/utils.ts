import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAtsScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return "N/A";
  return `${Math.round(score)}%`;
}

export function formatCurrencyTND(amount: number): string {
  return `${amount.toLocaleString("fr-TN", { minimumFractionDigits: 0 })} DT`;
}
