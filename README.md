# Healthcare Translation App - Technical Documentation

## Code Structure

### Core Components

1. **Main Application (`app/page.tsx`)**
   - Entry point of the application
   - Renders the main layout and translator component
   - Implements responsive design with Tailwind CSS

2. **Translator Component (`components/translator.tsx`)**
   - Core functionality for speech recognition and translation
   - Manages state for:
     - Speech recognition
     - Translation process
     - Audio playback
     - Message history
   - Implements real-time translation and audio synthesis

3. **Language Selector (`components/language-selector.tsx`)**
   - Handles language selection and switching
   - Supports 10 languages including:
     - English (en-US)
     - Spanish (es-ES)
     - French (fr-FR)
     - German (de-DE)
     - Chinese (zh-CN)
     - Arabic (ar-SA)
     - Russian (ru-RU)
     - Portuguese (pt-BR)
     - Japanese (ja-JP)
     - Hindi (hi-IN)

4. **Transcript View (`components/transcript-view.tsx`)**
   - Displays conversation history
   - Shows original text and translations
   - Includes timestamps and audio playback controls

5. **Audio Controls (`components/audio-controls.tsx`)**
   - Manages text-to-speech functionality
   - Provides play/pause controls
   - Handles audio state management

### AI Integration

1. **Translation Service (`lib/translate.ts`)**
   - Uses Groq AI for translation
   - Implements caching for improved performance
   - Handles error cases and validation
   - Model: mixtral-8x7b-32768

2. **Speech Service (`lib/speech.ts`)**
   - Integrates with ElevenLabs for text-to-speech
   - Supports multiple voices for different languages
   - Handles audio generation and streaming

## Security Considerations

1. **API Security**
   - Environment variables for API keys
   - Server-side API calls only
   - Request validation and sanitization

2. **Data Protection**
   - No permanent storage of conversations
   - Client-side only session storage
   - Sanitization of sensitive information:
     - Removes SSNs
     - Removes email addresses
     - Removes phone numbers
     - Removes medical record numbers

3. **Request Validation**
   - Origin verification
   - Referer checking
   - User agent validation
   - Production/development environment handling

4. **Privacy Measures**
   - Local audio processing
   - Temporary data storage only
   - Clear data on page refresh/exit
   - No external data sharing

## Environment Variables

Required environment variables:
```env
GROQ_API_KEY=your_groq_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
NEXT_PUBLIC_APP_URL=your_app_url

