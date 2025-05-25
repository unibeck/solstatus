import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function for combining Tailwind CSS classes
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// This could be expanded with additional utilities as needed for the application