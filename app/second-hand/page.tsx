"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Plus, ShoppingBag, MapPin, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ShareButton } from "@/components/share-button"
import { PayPalButton } from "@/components/paypal-button"
import { createClient } from "@/lib/supabase/client"
import type { SecondHandItem } from "@/lib/types"
import { toast } from "sonner"

export default function SecondHandPage() {
  const [items, setItems] = useState<SecondHandItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [paymentStep, setPaymentStep] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image_url: "",
    contact_name: "",
    contact_phone: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("second_hand_items")
      .select("*")
      .eq("payment_status", "paid")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setItems(data)
    }
    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.price || !formData.contact_name || !formData.contact_phone) {
      toast.error("נא למלא את כל השדות החובה")
      return
    }
    setPaymentStep(true)
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    const { error } = await supabase.from("second_hand_items").insert({
      ...formData,
      price: parseFloat(formData.price),
      payment_status: "paid",
      payment_amount: 40,
    })

    if (!error) {
      await supabase.from("payments").insert({
        item_type: "second_hand_item",
        item_id: paymentId,
        amount: 40,
        payment_method: "paypal",
        payment_id: paymentId,
        status: "completed",
      })

      toast.success("הפריט פורסם בהצלחה!")
      setDialogOpen(false)
      setPaymentStep(false)
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        image_url: "",
        contact_name: "",
        contact_phone: "",
      })
      fetchItems()
    } else {
      toast.error("שגיאה בפרסום הפריט")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-l from-blue-600 to-blue-500 text-white py-8 px-4">
        <div className="container mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowRight className="h-4 w-4" />
            חזרה לדף הבית
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
                <ShoppingBag className="h-10 w-10" />
                יד שתיים חדש דנדש
              </h1>
              <p className="text-white/80 text-lg">
                פריטים יד שנייה במחירי מציאה - 40 ש״ח לפרסום
              </p>
            </div>
            <ShareButton
              title="יד שתיים חדש דנדש"
              url="/second-hand"
              text="מצאו פריטים יד שנייה במחירים מעולים!"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Add Item Button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full md:w-auto mb-8 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-5 w-5 ml-2" />
              פרסם פריט חדש
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">פרסום פריט יד שנייה</DialogTitle>
            </DialogHeader>
            
            {!paymentStep ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">שם הפריט *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="לדוגמה: ספה תלת מושבית"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="description">תיאור הפריט</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="תארו את הפריט, מצבו וכל פרט רלוונטי"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">מחיר (ש״ח) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">מיקום</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="עיר / שכונה"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="image_url">קישור לתמונה</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact_name">שם המוכר *</Label>
                    <Input
                      id="contact_name"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact_phone">טלפון *</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-sm border border-blue-200">
                  <p className="font-bold mb-1">עלות פרסום: 40 ש״ח</p>
                  <p className="text-muted-foreground">המודעה תפורסם לאחר אישור התשלום</p>
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  המשך לתשלום
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-lg mb-1">{formData.title}</h3>
                  <p className="text-primary font-bold">{Number(formData.price).toLocaleString()} ש״ח</p>
                </div>
                
                <PayPalButton
                  amount={40}
                  itemType="פריט יד שנייה"
                  description="פרסום פריט ביד שתיים"
                  onSuccess={handlePaymentSuccess}
                />
                
                <Button
                  variant="outline"
                  onClick={() => setPaymentStep(false)}
                  className="w-full"
                >
                  חזרה לעריכה
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Items List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">פריטים למכירה</h2>
          
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">טוען...</div>
          ) : items.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">אין פריטים כרגע</p>
                <p className="text-sm text-muted-foreground mt-1">היה הראשון לפרסם!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <p className="text-2xl font-black text-primary">
                      {Number(item.price).toLocaleString()} ש״ח
                    </p>
                  </CardHeader>
                  <CardContent>
                    {item.description && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    {item.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm">
                        <p className="font-medium">{item.contact_name}</p>
                        <a href={`tel:${item.contact_phone}`} className="text-primary hover:underline">
                          {item.contact_phone}
                        </a>
                      </div>
                      <ShareButton
                        title={item.title}
                        url={`/second-hand?id=${item.id}`}
                        text={`${item.title} - ${Number(item.price).toLocaleString()} ש״ח`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
