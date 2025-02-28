"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { translateText } from "@/lib/translate"
import { LanguageSelector } from "@/components/language-selector"
import { TranscriptView } from "@/components/transcript-view"
import { AudioControls } from "@/components/audio-controls"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Loader2, AlertCircle, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Message = {
  id: string
  text: string
  translation: string
  sourceLanguage: string
  targetLanguage: string
  timestamp: Date
  error?: boolean
}

export function Translator() {
  const [sourceLanguage, setSourceLanguage] = useState("en-US")
  const [targetLanguage, setTargetLanguage] = useState("es-ES")
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [translation, setTranslation] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTranslating, setIsTranslating] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    let SpeechRecognition: any =
      typeof window !== "undefined" && (window.SpeechRecognition || (window as any).webkitSpeechRecognition)

    if (typeof window !== "undefined") {
      if (window.SpeechRecognition || (window as any).webkitSpeechRecognition) {
        SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()
      }

      synthRef.current = window.speechSynthesis
      utteranceRef.current = new SpeechSynthesisUtterance()
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current && utteranceRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  useEffect(() => {
    if (!recognitionRef.current) return

    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = sourceLanguage

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          setTranscript(transcript)
          handleTranslation(transcript)
        } else {
          interimTranscript += transcript
          setTranscript(interimTranscript)
        }
      }
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)

      if (event.error === "not-allowed") {
        setTranscript("Microphone access denied. Please allow microphone access in your browser settings.")
        setError("Microphone access denied. Please allow microphone access in your browser settings.")
      } else if (event.error === "network") {
        setTranscript("Network error. Please check your internet connection.")
        setError("Network error. Please check your internet connection.")
      } else {
        setTranscript(`Speech recognition error: ${event.error}. Please try again.`)
        setError(`Speech recognition error: ${event.error}. Please try again.`)
      }

      setIsListening(false)
    }

    recognitionRef.current.onend = () => {
      if (isListening) {
        recognitionRef.current?.start()
      }
    }
  }, [sourceLanguage, isListening])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setTranscript("")
      setTranslation("")
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  // Clear conversation data when leaving/refreshing the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear local state
      setMessages([])
      setTranscript("")
      setTranslation("")

      // Stop any ongoing processes
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      handleBeforeUnload()
    }
  }, [])

  // Sanitize input text to remove any potential sensitive information
  const sanitizeText = useCallback((text: string): string => {
    // Remove common patterns that might contain sensitive information
    return text
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN REMOVED]") // Social Security Numbers
      .replace(/\b\d{10,}\b/g, "[ID REMOVED]") // Medical Record Numbers or long ID numbers
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[EMAIL REMOVED]") // Email addresses
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[PHONE REMOVED]") // Phone numbers
  }, [])

  // Clear all conversation history
  const clearHistory = useCallback(() => {
    setMessages([])
    setTranscript("")
    setTranslation("")
    if (synthRef.current) {
      synthRef.current.cancel()
    }
    setIsSpeaking(false)
  }, [])

  // Update handleTranslation to use sanitizeText
  const handleTranslation = async (text: string) => {
    if (!text.trim()) return

    // Sanitize the input text
    const sanitizedText = sanitizeText(text)
    setIsTranslating(true)

    try {
      const translatedText = await translateText(sanitizedText, sourceLanguage, targetLanguage)
      setTranslation(translatedText)

      if (!translatedText.startsWith("[Translation error]")) {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: sanitizedText, // Store sanitized version
          translation: translatedText,
          sourceLanguage,
          targetLanguage,
          timestamp: new Date(),
        }

        setMessages((prev) => [newMessage, ...prev])

        // Set up speech synthesis
        if (utteranceRef.current && synthRef.current) {
          utteranceRef.current.text = translatedText
          utteranceRef.current.lang = targetLanguage
          utteranceRef.current.onstart = () => setIsSpeaking(true)
          utteranceRef.current.onend = () => setIsSpeaking(false)
          utteranceRef.current.onerror = (event) => {
            console.error("Speech synthesis error:", event)
            setError("Error generating speech. Please try again.")
            setIsSpeaking(false)
          }
          synthRef.current.speak(utteranceRef.current)
        }
      } else {
        const newMessage: Message = {
          id: Date.now().toString(),
          text,
          translation: translatedText,
          sourceLanguage,
          targetLanguage,
          timestamp: new Date(),
          error: true,
        }

        setMessages((prev) => [newMessage, ...prev])
        setError("Translation failed. Please try again.")
      }
    } catch (error) {
      console.error("Translation error:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        text,
        translation: "An error occurred during translation. Please try again.",
        sourceLanguage,
        targetLanguage,
        timestamp: new Date(),
        error: true,
      }

      setMessages((prev) => [errorMessage, ...prev])
      setTranslation("An error occurred during translation. Please try again.")
      setError("An error occurred during translation. Please try again.")
    } finally {
      setIsTranslating(false)
    }
  }

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
    setTranscript("")
    setTranslation("")
  }

  const handlePlayTranslation = (text: string, language: string) => {
    if (synthRef.current && utteranceRef.current) {
      // Cancel any ongoing speech
      synthRef.current.cancel()

      // Set up new utterance
      utteranceRef.current.text = text
      utteranceRef.current.lang = language
      utteranceRef.current.onstart = () => setIsSpeaking(true)
      utteranceRef.current.onend = () => setIsSpeaking(false)
      utteranceRef.current.onerror = (event) => {
        console.error("Speech synthesis error:", event)
        setError("Error generating speech. Please try again.")
        setIsSpeaking(false)
      }

      // Speak the translation
      synthRef.current.speak(utteranceRef.current)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <Alert variant="destructive" className="mb-2 animate-in fade-in zoom-in duration-300">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-blue-200 dark:border-blue-900 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <LanguageSelector
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              onSourceLanguageChange={setSourceLanguage}
              onTargetLanguageChange={setTargetLanguage}
              onSwapLanguages={swapLanguages}
            />

            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearHistory}
                className="w-full sm:w-auto bg-white dark:bg-slate-950 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear History
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-blue-800 dark:text-blue-200">
                  Original ({getLanguageName(sourceLanguage)})
                </h3>
                <Button
                  onClick={toggleListening}
                  variant={isListening ? "destructive" : "default"}
                  size="sm"
                  className={`transition-all duration-200 ${isListening ? "" : "hover:scale-105 active:scale-95"}`}
                >
                  {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                  {isListening ? "Stop" : "Start"} Recording
                </Button>
              </div>
              <div className="min-h-24 sm:min-h-32 p-4 rounded-lg border border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-950 text-sm sm:text-base shadow-sm">
                {transcript || <span className="text-slate-400 dark:text-slate-500">Speak to see transcript...</span>}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-blue-800 dark:text-blue-200">
                  Translation ({getLanguageName(targetLanguage)})
                </h3>
                {isTranslating && (
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    Translating...
                  </div>
                )}
              </div>
              <div className="min-h-24 sm:min-h-32 p-4 rounded-lg border border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-950 text-sm sm:text-base shadow-sm">
                {translation || (
                  <span className="text-slate-400 dark:text-slate-500">Translation will appear here...</span>
                )}
              </div>
              {translation && !translation.startsWith("[Translation error]") && (
                <AudioControls
                  isPlaying={isSpeaking}
                  onPlay={() => handlePlayTranslation(translation, targetLanguage)}
                  onPause={() => {
                    if (synthRef.current) {
                      synthRef.current.cancel()
                      setIsSpeaking(false)
                    }
                  }}
                  className="w-full sm:w-auto"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <TranscriptView
        messages={messages}
        onPlayTranslation={(text, language) => handlePlayTranslation(text, language)}
        isPlaying={isSpeaking}
        onPause={() => {
          if (synthRef.current) {
            synthRef.current.cancel()
            setIsSpeaking(false)
          }
        }}
      />
    </div>
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

