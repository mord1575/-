"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Plus, Car, MapPin, Phone, Star, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ShareButton } from "@/components/share-button"
import { createClient } from "@/lib/supabase/client"
import type { Taxi } from "@/lib/types"
import { toast } from "sonner"

const vehicleTypes = [
  { value: "sedan", label: "סדאן" },
  { value: "van", label: "מיניוואן" },
  { value: "luxury", label: "יוקרה" },
  { value: "accessible", label: "נגיש לנכים" },
  { value: "large", label: "רכב גדול" },
]

export default function TaxisPage() {
  const [taxis, setTaxis] = useState<Taxi[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    driver_name: "",
    phone: "",
    location: "",
    service_area: "",
    vehicle_type: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchTaxis()
  }, [])

  const fetchTaxis = async () => {
    const { data, error } = await supabase
      .from("taxis")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setTaxis(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.driver_name || !formData.phone) {
      toast.error("נא למלא את כל השדות החובה")
      return
    }

    const { error } = await supabase.from("taxis").insert({
      ...formData,
      is_available: true,
    })

    if (!error) {
      toast.success("נהג המונית נרשם בהצלחה!")
      setDialogOpen(false)
      setFormData({
        driver_name: "",
        phone: "",
        location: "",
        service_area: "",
        vehicle_type: "",
      })
      fetchTaxis()
    } else {
      toast.error("שגיאה בהוספת הנהג")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-l from-amber-500 to-amber-400 text-white py-8 px-4">
        <div className="container mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowRight className="h-4 w-4" />
            חזרה לדף הבית
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
                <Car className="h-10 w-10" />
                מוניות
              </h1>
              <p className="text-white/80 text-lg">
                שירותי הסעות ומוניות באזור - הרשמה חינם!
              </p>
            </div>
            <ShareButton
              title="מוניות"
              url="/taxis"
              text="מצאו מוניות ושירותי הסעות באזור!"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Add Taxi Button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full md:w-auto mb-8 bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="h-5 w-5 ml-2" />
              הרשם כנהג מונית
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">הרשמה כנהג מונית</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="driver_name">שם הנהג *</Label>
                <Input
                  id="driver_name"
                  value={formData.driver_name}
                  onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">טלפון *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="location">מיקום נוכחי</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="עיר / שכונה"
                />
              </div>
              
              <div>
                <Label htmlFor="service_area">אזור שירות</Label>
                <Input
                  id="service_area"
                  value={formData.service_area}
                  onChange={(e) => setFormData({ ...formData, service_area: e.target.value })}
                  placeholder="לדוגמה: ירושלים והסביבה"
                />
              </div>
              
              <div>
                <Label htmlFor="vehicle_type">סוג רכב</Label>
                <Select
                  value={formData.vehicle_type}
                  onValueChange={(value) => setFormData({ ...formData, vehicle_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg text-sm border border-amber-200">
                <p className="font-bold text-amber-700">הרשמה חינם!</p>
                <p className="text-muted-foreground">הפרטים שלך יופיעו ברשימת המוניות</p>
              </div>
              
              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600" size="lg">
                הירשם
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Taxis List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">נהגי מוניות זמינים</h2>
          
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">טוען...</div>
          ) : taxis.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">אין נהגים רשומים כרגע</p>
                <p className="text-sm text-muted-foreground mt-1">היה הראשון להירשם!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {taxis.map((taxi) => (
                <Card key={taxi.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                          <Car className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{taxi.driver_name}</CardTitle>
                          {taxi.vehicle_type && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              {vehicleTypes.find(t => t.value === taxi.vehicle_type)?.label}
                            </span>
                          )}
                        </div>
                      </div>
                      {taxi.is_available && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                          <CheckCircle className="h-3 w-3" />
                          זמין
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {taxi.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        {taxi.location}
                      </div>
                    )}
                    
                    {taxi.service_area && (
                      <p className="text-sm text-muted-foreground mb-3">
                        אזור שירות: {taxi.service_area}
                      </p>
                    )}
                    
                    {taxi.rating && (
                      <div className="flex items-center gap-1 text-sm mb-3">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{taxi.rating}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <a
                        href={`tel:${taxi.phone}`}
                        className="flex items-center gap-2 text-primary hover:underline font-medium"
                      >
                        <Phone className="h-4 w-4" />
                        {taxi.phone}
                      </a>
                      <ShareButton
                        title={`מונית - ${taxi.driver_name}`}
                        url={`/taxis?id=${taxi.id}`}
                        text={`צרו קשר עם ${taxi.driver_name} לשירותי הסעות`}
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
