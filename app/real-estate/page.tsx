"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Plus, Home, MapPin, ImageIcon, Bed, Maximize } from "lucide-react"
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
import type { RealEstate } from "@/lib/types"
import { toast } from "sonner"

const propertyTypes = [
  { value: "apartment", label: "דירה" },
  { value: "house", label: "בית פרטי" },
  { value: "penthouse", label: "פנטהאוז" },
  { value: "garden", label: "דירת גן" },
  { value: "studio", label: "סטודיו" },
  { value: "land", label: "מגרש" },
  { value: "commercial", label: "מסחרי" },
]

export default function RealEstatePage() {
  const [properties, setProperties] = useState<RealEstate[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [paymentStep, setPaymentStep] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image_url: "",
    property_type: "",
    rooms: "",
    size_sqm: "",
    contact_name: "",
    contact_phone: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from("real_estate")
      .select("*")
      .eq("payment_status", "paid")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setProperties(data)
    }
    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.price || !formData.location || !formData.contact_name || !formData.contact_phone) {
      toast.error("נא למלא את כל השדות החובה")
      return
    }
    setPaymentStep(true)
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    const { error } = await supabase.from("real_estate").insert({
      ...formData,
      price: parseFloat(formData.price),
      rooms: formData.rooms ? parseInt(formData.rooms) : null,
      size_sqm: formData.size_sqm ? parseInt(formData.size_sqm) : null,
      payment_status: "paid",
      payment_amount: 1500,
    })

    if (!error) {
      await supabase.from("payments").insert({
        item_type: "real_estate",
        item_id: paymentId,
        amount: 1500,
        payment_method: "paypal",
        payment_id: paymentId,
        status: "completed",
      })

      toast.success("הנכס פורסם בהצלחה!")
      setDialogOpen(false)
      setPaymentStep(false)
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        image_url: "",
        property_type: "",
        rooms: "",
        size_sqm: "",
        contact_name: "",
        contact_phone: "",
      })
      fetchProperties()
    } else {
      toast.error("שגיאה בפרסום הנכס")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-l from-emerald-600 to-emerald-500 text-white py-8 px-4">
        <div className="container mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowRight className="h-4 w-4" />
            חזרה לדף הבית
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
                <Home className="h-10 w-10" />
                נדל״ן
              </h1>
              <p className="text-white/80 text-lg">
                דירות, בתים ונכסים למכירה והשכרה - 1,500 ש״ח לפרסום
              </p>
            </div>
            <ShareButton
              title="נדל״ן"
              url="/real-estate"
              text="מצאו נכסים למכירה והשכרה!"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Add Property Button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full md:w-auto mb-8 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-5 w-5 ml-2" />
              פרסם נכס חדש
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">פרסום נכס נדל״ן</DialogTitle>
            </DialogHeader>
            
            {!paymentStep ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">כותרת המודעה *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="לדוגמה: דירת 4 חדרים בלב העיר"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="property_type">סוג הנכס</Label>
                    <Select
                      value={formData.property_type}
                      onValueChange={(value) => setFormData({ ...formData, property_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר סוג" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Label htmlFor="rooms">מספר חדרים</Label>
                    <Input
                      id="rooms"
                      type="number"
                      value={formData.rooms}
                      onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="size_sqm">גודל (מ״ר)</Label>
                    <Input
                      id="size_sqm"
                      type="number"
                      value={formData.size_sqm}
                      onChange={(e) => setFormData({ ...formData, size_sqm: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="location">מיקום *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="עיר, שכונה, רחוב"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="description">תיאור הנכס</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="תארו את הנכס, יתרונות, קומה, חניה וכו׳"
                      rows={4}
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
                </div>
                
                <div className="bg-emerald-50 p-4 rounded-lg text-sm border border-emerald-200">
                  <p className="font-bold mb-1">עלות פרסום: 1,500 ש״ח</p>
                  <p className="text-muted-foreground">המודעה תפורסם לאחר אישור התשלום</p>
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  המשך לתשלום
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h3 className="font-bold text-lg mb-1">{formData.title}</h3>
                  <p className="text-primary font-bold">{Number(formData.price).toLocaleString()} ש״ח</p>
                  <p className="text-sm text-muted-foreground">{formData.location}</p>
                </div>
                
                <PayPalButton
                  amount={1500}
                  itemType="נדל״ן"
                  description="פרסום מודעת נדל״ן"
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

        {/* Properties List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">נכסים זמינים</h2>
          
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">טוען...</div>
          ) : properties.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">אין נכסים כרגע</p>
                <p className="text-sm text-muted-foreground mt-1">היה הראשון לפרסם!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    {property.image_url ? (
                      <Image
                        src={property.image_url}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    {property.property_type && (
                      <span className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                        {propertyTypes.find(t => t.value === property.property_type)?.label}
                      </span>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                    <p className="text-2xl font-black text-emerald-600">
                      {Number(property.price).toLocaleString()} ש״ח
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {property.rooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          {property.rooms} חדרים
                        </div>
                      )}
                      {property.size_sqm && (
                        <div className="flex items-center gap-1">
                          <Maximize className="h-4 w-4" />
                          {property.size_sqm} מ״ר
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      {property.location}
                    </div>
                    
                    {property.description && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {property.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm">
                        <p className="font-medium">{property.contact_name}</p>
                        <a href={`tel:${property.contact_phone}`} className="text-primary hover:underline">
                          {property.contact_phone}
                        </a>
                      </div>
                      <ShareButton
                        title={property.title}
                        url={`/real-estate?id=${property.id}`}
                        text={`${property.title} - ${Number(property.price).toLocaleString()} ש״ח`}
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
