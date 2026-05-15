"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Plus, GraduationCap, MapPin, Star, Clock, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ShareButton } from "@/components/share-button"
import { createClient } from "@/lib/supabase/client"
import type { Teacher } from "@/lib/types"
import { toast } from "sonner"

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
    phone: "",
    location: "",
    price_per_hour: "",
    experience_years: "",
    image_url: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setTeachers(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.subject || !formData.phone) {
      toast.error("נא למלא את כל השדות החובה")
      return
    }

    const { error } = await supabase.from("teachers").insert({
      ...formData,
      price_per_hour: formData.price_per_hour ? parseFloat(formData.price_per_hour) : null,
      experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
    })

    if (!error) {
      toast.success("המורה נרשם בהצלחה!")
      setDialogOpen(false)
      setFormData({
        name: "",
        subject: "",
        description: "",
        phone: "",
        location: "",
        price_per_hour: "",
        experience_years: "",
        image_url: "",
      })
      fetchTeachers()
    } else {
      toast.error("שגיאה בהוספת המורה")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-l from-rose-600 to-rose-500 text-white py-8 px-4">
        <div className="container mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowRight className="h-4 w-4" />
            חזרה לדף הבית
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
                <GraduationCap className="h-10 w-10" />
                מורים פרטיים
              </h1>
              <p className="text-white/80 text-lg">
                מורים פרטיים ושיעורים בכל התחומים - הרשמה חינם!
              </p>
            </div>
            <ShareButton
              title="מורים פרטיים"
              url="/teachers"
              text="מצאו מורים פרטיים בכל התחומים!"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Add Teacher Button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full md:w-auto mb-8 bg-rose-600 hover:bg-rose-700">
              <Plus className="h-5 w-5 ml-2" />
              הרשם כמורה פרטי
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">הרשמה כמורה פרטי</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">שם מלא *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">מקצוע *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="לדוגמה: מתמטיקה, אנגלית, פיזיקה"
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
                  <Label htmlFor="location">מיקום</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="עיר / אזור"
                  />
                </div>
                
                <div>
                  <Label htmlFor="price_per_hour">מחיר לשעה (ש״ח)</Label>
                  <Input
                    id="price_per_hour"
                    type="number"
                    value={formData.price_per_hour}
                    onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="experience_years">שנות ניסיון</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                    placeholder="0"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">תיאור</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="ספרו על עצמכם, ניסיון, שיטת הוראה וכו׳"
                    rows={3}
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
              </div>
              
              <div className="bg-rose-50 p-4 rounded-lg text-sm border border-rose-200">
                <p className="font-bold text-rose-700">הרשמה חינם!</p>
                <p className="text-muted-foreground">הפרטים שלך יופיעו ברשימת המורים</p>
              </div>
              
              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" size="lg">
                הירשם
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Teachers List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">מורים פרטיים</h2>
          
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">טוען...</div>
          ) : teachers.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">אין מורים רשומים כרגע</p>
                <p className="text-sm text-muted-foreground mt-1">היה הראשון להירשם!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-square bg-muted relative max-h-48">
                    {teacher.image_url ? (
                      <Image
                        src={teacher.image_url}
                        alt={teacher.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-rose-50">
                        <GraduationCap className="h-16 w-16 text-rose-200" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{teacher.name}</CardTitle>
                    <span className="inline-block bg-rose-100 text-rose-700 text-sm px-3 py-1 rounded-full">
                      {teacher.subject}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {teacher.price_per_hour && (
                        <div className="font-bold text-foreground">
                          {Number(teacher.price_per_hour).toLocaleString()} ש״ח/שעה
                        </div>
                      )}
                      {teacher.experience_years && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {teacher.experience_years} שנות ניסיון
                        </div>
                      )}
                    </div>
                    
                    {teacher.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        {teacher.location}
                      </div>
                    )}
                    
                    {teacher.rating && (
                      <div className="flex items-center gap-1 text-sm mb-3">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{teacher.rating}</span>
                      </div>
                    )}
                    
                    {teacher.description && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {teacher.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <a
                        href={`tel:${teacher.phone}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {teacher.phone}
                      </a>
                      <ShareButton
                        title={`${teacher.name} - מורה ל${teacher.subject}`}
                        url={`/teachers?id=${teacher.id}`}
                        text={`מורה ל${teacher.subject} - ${teacher.name}`}
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
