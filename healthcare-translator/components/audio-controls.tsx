"use client"

import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AudioControlsProps {
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  className?: string
}

export function AudioControls({ isPlaying, onPlay, onPause, className }: AudioControlsProps) {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause()
    } else {
      onPlay()
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "mt-2 w-full sm:w-auto h-10 sm:h-9 transition-all hover:scale-105 active:scale-95",
        isPlaying && "bg-primary text-primary-foreground hover:bg-primary/90",
        className,
      )}
      onClick={handlePlayPause}
    >
      {isPlaying ? (
        <>
          <Pause className="h-4 w-4 mr-2" />
          Pause
        </>
      ) : (
        <>
          <Play className="h-4 w-4 mr-2" />
          Play Translation
        </>
      )}
    </Button>
  )
}

