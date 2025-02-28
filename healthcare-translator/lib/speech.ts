"use server"

import { ElevenLabsClient } from "elevenlabs"

// Map language codes to ElevenLabs voice IDs and names
const voiceMap: Record<string, { id: string; name: string }> = {
  "en-US": { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
  "es-ES": { id: "AZnzlk1XvdvUeBnXmlld", name: "Antonio" },
  "fr-FR": { id: "MF3mGyEYCl7XYWbV9V6O", name: "Sophie" },
  "de-DE": { id: "jsCqWAovK2LkecY7zXl4", name: "Hans" },
  "zh-CN": { id: "TxGEqnHWrfWFTfGW9XjX", name: "Zhiyu" },
  "ja-JP": { id: "VR6AewLTigWG4xSOukaG", name: "Haru" },
  "hi-IN": { id: "pNInz6obpgDQGcFmaJgB", name: "Arun" },
  "ar-SA": { id: "ErXwobaYiN019PkySvjV", name: "Omar" },
  "ru-RU": { id: "GBv7mTt0atIp3Br8iCZE", name: "Igor" },
  "pt-BR": { id: "Lya44tZNxG4q6wVu3mGZ", name: "Clara" },
}

// Default voice if language not found
const defaultVoice = {
  id: "21m00Tcm4TlvDq8ikWAM",
  name: "Rachel",
}

export async function generateSpeech(text: string, language: string): Promise<string> {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY

    if (!apiKey) {
      console.error("Missing ELEVENLABS_API_KEY environment variable")
      throw new Error("Text-to-speech service configuration error")
    }

    // Initialize the Voice with the API key
    const voice = new ElevenLabsClient({
      apiKey: apiKey,
    })

    // Select voice based on language or use default
    const selectedVoice = voiceMap[language] || defaultVoice

    // Generate audio using the ElevenLabs API
    const audioBuffer = await voice.textToSpeech(selectedVoice.id, text, {
      model_id: "eleven_multilingual_v2", // Use multilingual model for better language support
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5, // Balanced between natural and emotive speech
        use_speaker_boost: true,
      },
    })

    // Convert audio buffer to base64 data URL
    const base64Audio = Buffer.from(audioBuffer).toString("base64")
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`

    return audioUrl
  } catch (error) {
    console.error("Error generating speech:", error)

    // Provide more detailed error information
    if (error instanceof Error) {
      throw new Error(`Speech generation failed: ${error.message}`)
    }
    throw new Error("Speech generation failed")
  }
}

