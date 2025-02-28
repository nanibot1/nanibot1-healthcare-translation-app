"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AudioControls } from "@/components/audio-controls"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare } from "lucide-react"

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
    <Card className="border-blue-200 dark:border-blue-900 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <CardHeader className="border-b border-blue-100 dark:border-blue-900">
        <CardTitle className="flex items-center gap-2 text-xl text-blue-800 dark:text-blue-200">
          <MessageSquare className="h-5 w-5" />
          Conversation History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className="border-b border-blue-100 dark:border-blue-900/50 pb-4 last:border-0 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 dark:bg-slate-900/80 rounded-lg p-4">
                  <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                    Original ({getLanguageName(message.sourceLanguage)})
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">{message.text}</p>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/80 rounded-lg p-4">
                  <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                    Translation ({getLanguageName(message.targetLanguage)})
                  </p>
                  <p
                    className={
                      message.translation.startsWith("[Translation error]")
                        ? "text-red-500"
                        : "text-slate-700 dark:text-slate-300"
                    }
                  >
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
              <p className="text-xs text-blue-500/70 dark:text-blue-400/70 mt-2">
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

