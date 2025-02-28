import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    "en-US": "English",
    "es-ES": "Spanish",
    "fr-FR": "French",
    "de-DE": "German",
    "zh-CN": "Chinese",
    "ar-SA": "Arabic",
    "ru-RU": "Russian",
    "pt-BR": "Portuguese",
    "ja-JP": "Japanese",
    "hi-IN": "Hindi",
  }

  return languages[code] || code
}

