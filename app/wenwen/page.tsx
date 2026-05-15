"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Plus, Lightbulb, DollarSign, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ShareButton } from "@/components/share-button"
import { PayPalButton } from "@/components/paypal-button"
import { createClient } from "@/lib/supabase/client"
import type { WenWenVenture } from "@/lib/types"
import { toast } from "sonner"

const ventureTypes = [
  { value: "lead", label: "ליד עסקי" },
  { value: "partnership", label: "שותפות" },
  { value: "investment", label: "הזדמנות השקעה" },
  { value: "franchise", label: "זיכיון" },
  { value: "startup", label: "סטארטאפ" },
  { value: "service", label: "שירות עסקי" },
]

export default function WenWenPage() {
  const [ventures, setVentures] = useState<WenWenVenture[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [paymentStep, setPaymentStep] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venture_type: "",
    investment_required: "",
    potential_revenue: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchVentures()
  }, [])

  const fetchVentures = async () => {
    const { data, error } = await supabase
      .from("wenwen_ventures")
      .select("*")
      .eq("payment_status", "paid")
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setVentures(data)
    }
    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.venture_type || !formData.contact_name || !formData.contact_phone) {
      toast.error("נא למלא את כל השדות החובה")
      return
    }
    setPaymentStep(true)
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    const { error } = await supabase.from("wenwen_ventures").insert({
      ...formData,
      investment_required: formData.investment_required ? parseFloat(formData.investment_required) : null,
      potential_revenue: formData.potential_revenue ? parseFloat(formData.potential_revenue) : null,
      payment_status: "paid",
      seriousness_fee: 500,
      success_fee_percent: 5,
    })

    if (!error) {
      // Record payment
      await supabase.from("payments").insert({
        item_type: "wenwen_venture",
        item_id: paymentId,
        amount: 500,
        payment_method: "paypal",
        payment_id: paymentId,
        status: "completed",
      })

      toast.success("המיזם פורסם בהצלחה!")
      setDialogOpen(false)
      setPaymentStep(false)
      setFormData({
        title: "",
        description: "",
        venture_type: "",
        investment_required: "",
        potential_revenue: "",
        contact_name: "",
        contact_phone: "",
        contact_email: "",
      })
      fetchVentures()
    } else {
      toast.error("שגיאה בפרסום המיזם")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-l from-fuchsia-600 to-pink-600 text-white py-8 px-4">
        <div className="container mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowRight className="h-4 w-4" />
            חזרה לדף הבית
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
                <Lightbulb className="h-10 w-10" />
                WenWen - מיזמים והזדמנויות
              </h1>
              <p className="text-white/80 text-lg">
                שיתוף לידים, הזדמנויות עסקיות ומיזמים עם מודל דמי הצלחה
              </p>
            </div>
            <ShareButton
              title="WenWen - מיזמים"
              url="/wenwen"
              text="גלו הזדמנויות עסקיות ב-WenWen!"
            />
          </div>
        </div>
      </header>

      {/* Info Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-fuchsia-50 to-pink-50 border-fuchsia-200">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-10 w-10 mx-auto mb-3 text-fuchsia-600" />
              <h3 className="font-bold text-lg mb-1">דמי רצינות</h3>
              <p className="text-2xl font-black text-fuchsia-600">500 ש״ח</p>
              <p className="text-sm text-muted-foreground mt-1">לפרסום מיזם</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 text-emerald-600" />
              <h3 className="font-bold text-lg mb-1">עמלת הצלחה</h3>
              <p className="text-2xl font-black text-emerald-600">5%</p>
              <p className="text-sm text-muted-foreground mt-1">מהעסקה בלבד</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 mx-auto mb-3 text-blue-600" />
              <h3 className="font-bold text-lg mb-1">חיבור איכותי</h3>
              <p className="text-2xl font-black text-blue-600">100%</p>
              <p className="text-sm text-muted-foreground mt-1">לידים מאומתים</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Venture Button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full md:w-auto mb-8 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700">
              <Plus className="h-5 w-5 ml-2" />
              פרסם מיזם חדש
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">פרסום מיזם חדש</DialogTitle>
            </DialogHeader>
            
            {!paymentStep ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">כותרת המיזם *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="תארו את המיזם בקצרה"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="venture_type">סוג המיזם *</Label>
                    <Select
                      value={formData.venture_type}
                      onValueChange={(value) => setFormData({ ...formData, venture_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר סוג" />
                      </SelectTrigger>
                      <SelectContent>
                        {ventureTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="description">תיאור מפורט *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="תארו את ההזדמנות העסקית, הפוטנציאל והדרישות"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="investment_required">השקעה נדרשת (ש״ח)</Label>
                    <Input
                      id="investment_required"
                      type="number"
                      value={formData.investment_required}
                      onChange={(e) => setFormData({ ...formData, investment_required: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="potential_revenue">הכנסה פוטנציאלית (ש״ח)</Label>
                    <Input
                      id="potential_revenue"
                      type="number"
                      value={formData.potential_revenue}
                      onChange={(e) => setFormData({ ...formData, potential_revenue: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact_name">שם איש קשר *</Label>
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
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="contact_email">אימייל</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg text-sm">
                  <p className="font-bold mb-2">תנאי הפרסום:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>- דמי רצינות: 500 ש״ח (חד פעמי)</li>
                    <li>- עמלת הצלחה: 5% מהעסקה שתיסגר</li>
                    <li>- המודעה תפורסם לאחר אישור התשלום</li>
                  </ul>
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  המשך לתשלום
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-fuchsia-50 p-4 rounded-lg border border-fuchsia-200">
                  <h3 className="font-bold text-lg mb-2">{formData.title}</h3>
                  <p className="text-sm text-muted-foreground">{formData.description.substring(0, 100)}...</p>
                </div>
                
                <PayPalButton
                  amount={500}
                  itemType="מיזם WenWen"
                  description="דמי רצינות לפרסום מיזם"
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

        {/* Ventures List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">מיזמים פעילים</h2>
          
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">טוען...</div>
          ) : ventures.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Lightbulb className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">אין מיזמים פעילים כרגע</p>
                <p className="text-sm text-muted-foreground mt-1">היה הראשון לפרסם!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ventures.map((venture) => (
                <Card key={venture.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded-full">
                          {ventureTypes.find(t => t.value === venture.venture_type)?.label || venture.venture_type}
                        </span>
                        <CardTitle className="mt-2">{venture.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {venture.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      {venture.investment_required && (
                        <div>
                          <span className="text-muted-foreground">השקעה נדרשת:</span>
                          <p className="font-bold">{Number(venture.investment_required).toLocaleString()} ש״ח</p>
                        </div>
                      )}
                      {venture.potential_revenue && (
                        <div>
                          <span className="text-muted-foreground">הכנסה פוטנציאלית:</span>
                          <p className="font-bold text-emerald-600">{Number(venture.potential_revenue).toLocaleString()} ש״ח</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm">
                        <p className="font-medium">{venture.contact_name}</p>
                        <a href={`tel:${venture.contact_phone}`} className="text-primary hover:underline">
                          {venture.contact_phone}
                        </a>
                      </div>
                      <ShareButton
                        title={venture.title}
                        url={`/wenwen?id=${venture.id}`}
                        text={`בדקו את ההזדמנות הזו: ${venture.title}`}
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
