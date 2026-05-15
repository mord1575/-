"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ShareButtonProps {
  title: string
  url: string
  text?: string
}

export function ShareButton({ title, url, text }: ShareButtonProps) {
  const handleShare = async () => {
    const shareData = {
      title,
      text: text || title,
      url: typeof window !== "undefined" ? `${window.location.origin}${url}` : url,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast.success("שותף בהצלחה!")
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyToClipboard(shareData.url)
        }
      }
    } else {
      copyToClipboard(shareData.url)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("הקישור הועתק ללוח!")
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="gap-2"
    >
      <Share2 className="h-4 w-4" />
      שתף
    </Button>
  )
}
