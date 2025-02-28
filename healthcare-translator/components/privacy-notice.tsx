import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function PrivacyNotice() {
  return (
    <Alert className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Privacy Notice</AlertTitle>
      <AlertDescription className="mt-2 text-sm">
        <p className="mb-2">
          This application is for demonstration purposes only. Please be aware of the following privacy considerations:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Do not share sensitive patient information or personal health data</li>
          <li>Conversations are stored temporarily in your browser and cleared when you leave</li>
          <li>Audio recordings are processed locally and not stored permanently</li>
          <li>Translations are processed securely but should not contain identifiable patient information</li>
        </ul>
      </AlertDescription>
    </Alert>
  )
}

