"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface PayPalButtonProps {
  amount: number
  itemType: string
  itemId?: string
  description: string
  onSuccess?: (paymentId: string) => void
  onError?: (error: string) => void
  disabled?: boolean
}

export function PayPalButton({
  amount,
  itemType,
  description,
  onSuccess,
  onError,
  disabled = false,
}: PayPalButtonProps) {
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    
    // Simulate PayPal payment flow - in production this would integrate with PayPal SDK
    try {
      // Create a mock payment ID
      const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Payment successful
      setPaid(true)
      toast.success("התשלום בוצע בהצלחה!")
      onSuccess?.(paymentId)
    } catch {
      toast.error("שגיאה בעיבוד התשלום")
      onError?.("Payment failed")
    } finally {
      setLoading(false)
    }
  }

  if (paid) {
    return (
      <div className="flex items-center gap-2 text-accent p-3 bg-accent/10 rounded-lg">
        <CheckCircle className="h-5 w-5" />
        <span>התשלום אושר - {amount.toLocaleString()} ש״ח</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="p-4 bg-muted rounded-lg border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">סוג:</span>
          <span className="font-medium">{itemType}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">תיאור:</span>
          <span className="font-medium text-sm">{description}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">סכום לתשלום:</span>
          <span className="font-bold text-lg text-primary">{amount.toLocaleString()} ש״ח</span>
        </div>
      </div>
      
      <Button
        onClick={handlePayment}
        disabled={disabled || loading}
        className="w-full bg-[#0070ba] hover:bg-[#003087] text-white gap-2"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            מעבד תשלום...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            שלם עם PayPal - {amount.toLocaleString()} ש״ח
          </>
        )}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        התשלום מאובטח באמצעות PayPal. המודעה תפורסם לאחר אישור התשלום.
      </p>
    </div>
  )
}
