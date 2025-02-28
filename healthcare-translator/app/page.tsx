import { Translator } from "@/components/translator"
import { PrivacyNotice } from "@/components/privacy-notice"

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-purple-100 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container mx-auto px-4 py-12 max-w-5xl relative">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-block animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 pb-2">
              Healthcare Translation
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-forwards">
            Breaking language barriers in healthcare with real-time AI-powered translation
          </p>
        </div>
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-forwards">
          <PrivacyNotice />
          <Translator />
        </div>
      </div>
    </main>
  )
}

