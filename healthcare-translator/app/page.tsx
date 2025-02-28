import { Translator } from "@/components/translator"
import { PrivacyNotice } from "@/components/privacy-notice"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Healthcare Translation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Breaking language barriers in healthcare with real-time AI-powered translation
          </p>
        </div>
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards">
          <PrivacyNotice />
          <Translator />
        </div>
      </div>
    </main>
  )
}

