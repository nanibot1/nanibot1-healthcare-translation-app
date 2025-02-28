"use client"

import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioControlsProps {
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
}

export function AudioControls({ isPlaying, onPlay, onPause }: AudioControlsProps) {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause()
    } else {
      onPlay()
    }
  }

  return (
    <Button variant="outline" size="sm" className="mt-2 w-full sm:w-auto h-10 sm:h-9" onClick={handlePlayPause}>
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

