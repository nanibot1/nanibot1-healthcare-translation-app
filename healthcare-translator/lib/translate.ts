"use server"

import type { TranslationCache } from "@/types/translation"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { headers } from "next/headers"

// Cache to improve performance and reduce API calls
const translationCache: TranslationCache = {}

// Language code mapping
const localeToLanguageCode: Record<string, string> = {
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

export async function translateText(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  // Check for Groq API key
  const groqApiKey = process.env.GROQ_API_KEY
  if (!groqApiKey) {
    console.error("groq_api_key is missing")
    throw new Error("Translation service configuration error")
  }

  // Basic security check for request headers
  const headersList = headers()
  const userAgent = headersList.get("user-agent")
  const referer = headersList.get("referer")
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  // More flexible security check that works in both development and production
  const isValidRequest = () => {
    // Skip strict checking in development
    if (process.env.NODE_ENV === "development") {
      return true
    }

    // In production, verify the request has basic headers
    if (!userAgent) {
      return false
    }

    // If we have a referer, verify it's from our domain
    if (referer && appUrl) {
      try {
        const refererUrl = new URL(referer)
        const appUrlObj = new URL(appUrl)

        // Check if the referer hostname matches our app URL or is a Vercel deployment
        return (
          refererUrl.hostname === appUrlObj.hostname ||
          refererUrl.hostname.endsWith(".vercel.app") ||
          refererUrl.hostname.includes(".vercel.app")
        )
      } catch {
        // If URL parsing fails, continue with basic validation
        console.warn("Failed to parse URLs for security check")
      }
    }

    // Allow requests without referer in production (for initial page load)
    return true
  }

  // Validate the request
  if (!isValidRequest()) {
    console.error("Unauthorized request detected", {
      userAgent,
      referer,
      appUrl,
    })
    throw new Error("Unauthorized translation request")
  }

  // Create a cache key based on the text and languages
  const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`

  // Return cached translation if available
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey]
  }

  try {
    // Convert locale codes to language names
    const sourceLanguageName = localeToLanguageCode[sourceLanguage] || sourceLanguage.split("-")[0]
    const targetLanguageName = localeToLanguageCode[targetLanguage] || targetLanguage.split("-")[0]

    // Create a detailed prompt for the translation
    const prompt = `Translate the following text from ${sourceLanguageName} to ${targetLanguageName}:
    "${text}"
    
    Rules:
    1. Provide ONLY the translation
    2. Do not add any explanations
    3. Maintain medical terminology accuracy
    4. Keep the same tone and formality
    
    Translation:`

    // Initialize Groq model with API key
    const model = groq("mixtral-8x7b-32768", {
      apiKey: groqApiKey,
    })

    // Generate translation with more specific parameters
    const { text: translatedText } = await generateText({
      model,
      prompt,
      temperature: 0.2, // Lower temperature for more consistent translations
      max_tokens: 500, // Increased token limit for longer translations
      top_p: 0.95, // Slightly reduced top_p for more focused outputs
    })

    // Validate the response
    if (!translatedText || typeof translatedText !== "string") {
      console.error("Invalid translation response:", translatedText)
      throw new Error("Invalid translation response")
    }

    // Clean up the response to remove any potential quotation marks or extra whitespace
    const cleanedTranslation = translatedText.trim().replace(/^["']|["']$/g, "")

    // Cache the translation
    translationCache[cacheKey] = cleanedTranslation

    return cleanedTranslation
  } catch (error) {
    // Log the full error for debugging
    console.error("Translation error details:", {
      error,
      text,
      sourceLanguage,
      targetLanguage,
    })

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return "[Translation error: API configuration issue. Please check your settings.]"
      }
      if (error.message.includes("timeout")) {
        return "[Translation error: Request timed out. Please try again.]"
      }
      return `[Translation error: ${error.message}]`
    }

    return "[Translation error: An unexpected error occurred. Please try again.]"
  }
}

