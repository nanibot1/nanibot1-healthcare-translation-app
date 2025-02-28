import { Translator } from "@/components/translator"
import { PrivacyNotice } from "@/components/privacy-notice"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-800 dark:text-slate-100">
          Healthcare Translation Web App with Generative AI
        </h1>
        <p className="text-center mb-8 text-slate-600 dark:text-slate-300">
          Real-time translation for healthcare providers and patients
        </p>
        <PrivacyNotice />
        <Translator />
      </div>
    </main>
  )
}

