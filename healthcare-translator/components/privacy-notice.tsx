import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function PrivacyNotice() {
  return (
    <Alert className="mb-6 border-blue-200/50 dark:border-blue-900/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md shadow-lg transition-all hover:bg-white/80 dark:hover:bg-slate-950/80">
      <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-800 dark:text-blue-300">Privacy Notice</AlertTitle>
      <AlertDescription className="mt-2 text-sm text-blue-700 dark:text-blue-200">
        <p className="mb-2">
          This application is for demonstration purposes only. Please be aware of the following privacy considerations:
        </p>
        <ul className="list-disc pl-4 space-y-1 marker:text-blue-600 dark:marker:text-blue-400">
          <li>Do not share sensitive patient information or personal health data</li>
          <li>Conversations are stored temporarily in your browser and cleared when you leave</li>
          <li>Audio recordings are processed locally and not stored permanently</li>
          <li>Translations are processed securely but should not contain identifiable patient information</li>
        </ul>
      </AlertDescription>
    </Alert>
  )
}

