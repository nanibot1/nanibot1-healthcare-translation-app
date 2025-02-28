"use client"

import { ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LanguageSelectorProps {
  sourceLanguage: string
  targetLanguage: string
  onSourceLanguageChange: (language: string) => void
  onTargetLanguageChange: (language: string) => void
  onSwapLanguages: () => void
}

export function LanguageSelector({
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange,
  onSwapLanguages,
}: LanguageSelectorProps) {
  const languages = [
    { code: "en-US", name: "English" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "zh-CN", name: "Chinese" },
    { code: "ar-SA", name: "Arabic" },
    { code: "ru-RU", name: "Russian" },
    { code: "pt-BR", name: "Portuguese" },
    { code: "ja-JP", name: "Japanese" },
    { code: "hi-IN", name: "Hindi" },
  ]

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2">
      <Select value={sourceLanguage} onValueChange={onSourceLanguageChange}>
        <SelectTrigger className="w-full sm:w-[160px] md:w-[180px]">
          <SelectValue placeholder="Source language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" onClick={onSwapLanguages} className="rounded-full">
        <ArrowLeftRight className="h-4 w-4" />
        <span className="sr-only">Swap languages</span>
      </Button>

      <Select value={targetLanguage} onValueChange={onTargetLanguageChange}>
        <SelectTrigger className="w-full sm:w-[160px] md:w-[180px]">
          <SelectValue placeholder="Target language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

