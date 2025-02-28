"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AudioControls } from "@/components/audio-controls"
import { formatDistanceToNow } from "date-fns"

type Message = {
  id: string
  text: string
  translation: string
  sourceLanguage: string
  targetLanguage: string
  timestamp: Date
}

interface TranscriptViewProps {
  messages: Message[]
  onPlayTranslation: (text: string, language: string) => void
  isPlaying: boolean
  onPause: () => void
}

export function TranscriptView({ messages, onPlayTranslation, isPlaying, onPause }: TranscriptViewProps) {
  if (messages.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Conversation History</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="border-b pb-4 last:border-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">
                    Original ({getLanguageName(message.sourceLanguage)})
                  </p>
                  <p>{message.text}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">
                    Translation ({getLanguageName(message.targetLanguage)})
                  </p>
                  <p className={message.translation.startsWith("[Translation error]") ? "text-red-500" : ""}>
                    {message.translation}
                  </p>
                  {!message.translation.startsWith("[Translation error]") && (
                    <AudioControls
                      isPlaying={isPlaying}
                      onPlay={() => onPlayTranslation(message.translation, message.targetLanguage)}
                      onPause={onPause}
                    />
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function getLanguageName(code: string): string {
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

