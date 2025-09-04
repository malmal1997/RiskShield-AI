import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to generate Salesforce-like ticket IDs
export function generateTicketId(prefix: string): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  return `${prefix}-${randomNum}`;
}