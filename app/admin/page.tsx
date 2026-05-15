"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowRight, 
  Shield, 
  Lock, 
  Unlock,
  Trash2,
  ShoppingBag,
  Home,
  Car,
  GraduationCap,
  Lightbulb,
  CreditCard,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const ADMIN_CODE = "03908063"

interface Stats {
  secondHandItems: number
  realEstate: number
  taxis: number
  teachers: number
  wenWenVentures: number
  payments: number
  totalRevenue: number
}

export default function AdminPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [codeInput, setCodeInput] = useState("")
  const [showCode, setShowCode] = useState(false)
  const [stats, setStats] = useState<Stats>({
    secondHandItems: 0,
    realEstate: 0,
    taxis: 0,
    teachers: 0,
    wenWenVentures: 0,
    payments: 0,
    totalRevenue: 0,
  })
  const [items, setItems] = useState<{
    secondHand: any[]
    realEstate: any[]
    taxis: any[]
    teachers: any[]
    wenwen: any[]
    payments: any[]
  }>({
    secondHand: [],
    realEstate: [],
    taxis: [],
    teachers: [],
    wenwen: [],
    payments: [],
  })
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleUnlock = () => {
    if (codeInput === ADMIN_CODE) {
      setIsUnlocked(true)
      toast.success("כספת נפתחה בהצלחה!")
      fetchAllData()
    } else {
      toast.error("קוד שגוי!")
      setCodeInput("")
    }
  }

  const fetchAllData = async () => {
    setLoading(true)

    // Fetch all data
    const [
      { data: secondHand, count: secondHandCount },
      { data: realEstate, count: realEstateCount },
      { data: taxis, count: taxisCount },
      { data: teachers, count: teachersCount },
      { data: wenwen, count: wenwenCount },
      { data: payments },
    ] = await Promise.all([
      supabase.from("second_hand_items").select("*", { count: "exact" }).order("created_at", { ascending: false }),
      supabase.from("real_estate").select("*", { count: "exact" }).order("created_at", { ascending: false }),
      supabase.from("taxis").select("*", { count: "exact" }).order("created_at", { ascending: false }),
      supabase.from("teachers").select("*", { count: "exact" }).order("created_at", { ascending: false }),
      supabase.from("wenwen_ventures").select("*", { count: "exact" }).order("created_at", { ascending: false }),
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
    ])

    setItems({
      secondHand: secondHand || [],
      realEstate: realEstate || [],
      taxis: taxis || [],
      teachers: teachers || [],
      wenwen: wenwen || [],
      payments: payments || [],
    })

    const totalRevenue = (payments || [])
      .filter(p => p.status === "completed")
      .reduce((sum, p) => sum + Number(p.amount), 0)

    setStats({
      secondHandItems: secondHandCount || 0,
      realEstate: realEstateCount || 0,
      taxis: taxisCount || 0,
      teachers: teachersCount || 0,
      wenWenVentures: wenwenCount || 0,
      payments: (payments || []).length,
      totalRevenue,
    })

    setLoading(false)
  }

  const handleDelete = async (table: string, id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id)
    if (!error) {
      toast.success("הפריט נמחק בהצלחה")
      fetchAllData()
    } else {
      toast.error("שגיאה במחיקה")
    }
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">כספת מנהל</CardTitle>
            <p className="text-muted-foreground">הזן את הקוד הסודי לגישה</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="code">קוד סודי</Label>
              <div className="relative">
                <Input
                  id="code"
                  type={showCode ? "text" : "password"}
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                  placeholder="הזן קוד..."
                  className="pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button onClick={handleUnlock} className="w-full" size="lg">
              <Unlock className="h-5 w-5 ml-2" />
              פתח כספת
            </Button>
            
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                <ArrowRight className="h-4 w-4 ml-2" />
                חזרה לדף הבית
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-l from-slate-800 to-slate-900 text-white py-8 px-4">
        <div className="container mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowRight className="h-4 w-4" />
            חזרה לדף הבית
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
                <Shield className="h-10 w-10" />
                לוח בקרה - מנהל
              </h1>
              <p className="text-white/80 text-lg">
                ניהול המודעות וצפייה בצינור האשראי
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsUnlocked(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Lock className="h-4 w-4 ml-2" />
              נעל
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{stats.secondHandItems}</p>
              <p className="text-xs text-muted-foreground">יד שתיים</p>
            </CardContent>
          </Card>
          
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4 text-center">
              <Home className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
              <p className="text-2xl font-bold">{stats.realEstate}</p>
              <p className="text-xs text-muted-foreground">נדל״ן</p>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 text-center">
              <Car className="h-6 w-6 mx-auto mb-2 text-amber-600" />
              <p className="text-2xl font-bold">{stats.taxis}</p>
              <p className="text-xs text-muted-foreground">מוניות</p>
            </CardContent>
          </Card>
          
          <Card className="bg-rose-50 border-rose-200">
            <CardContent className="p-4 text-center">
              <GraduationCap className="h-6 w-6 mx-auto mb-2 text-rose-600" />
              <p className="text-2xl font-bold">{stats.teachers}</p>
              <p className="text-xs text-muted-foreground">מורים</p>
            </CardContent>
          </Card>
          
          <Card className="bg-fuchsia-50 border-fuchsia-200">
            <CardContent className="p-4 text-center">
              <Lightbulb className="h-6 w-6 mx-auto mb-2 text-fuchsia-600" />
              <p className="text-2xl font-bold">{stats.wenWenVentures}</p>
              <p className="text-xs text-muted-foreground">מיזמים</p>
            </CardContent>
          </Card>
          
          <Card className="bg-indigo-50 border-indigo-200">
            <CardContent className="p-4 text-center">
              <CreditCard className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
              <p className="text-2xl font-bold">{stats.payments}</p>
              <p className="text-xs text-muted-foreground">תשלומים</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <CreditCard className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">הכנסות (ש״ח)</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="payments" dir="rtl">
          <TabsList className="grid w-full grid-cols-6 mb-4">
            <TabsTrigger value="payments">תשלומים</TabsTrigger>
            <TabsTrigger value="secondhand">יד שתיים</TabsTrigger>
            <TabsTrigger value="realestate">נדל״ן</TabsTrigger>
            <TabsTrigger value="taxis">מוניות</TabsTrigger>
            <TabsTrigger value="teachers">מורים</TabsTrigger>
            <TabsTrigger value="wenwen">מיזמים</TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>צינור אשראי - תשלומים</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">טוען...</div>
                ) : items.payments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">אין תשלומים</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right p-2">סוג</th>
                          <th className="text-right p-2">סכום</th>
                          <th className="text-right p-2">סטטוס</th>
                          <th className="text-right p-2">מזהה תשלום</th>
                          <th className="text-right p-2">תאריך</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.payments.map((payment) => (
                          <tr key={payment.id} className="border-b">
                            <td className="p-2">{payment.item_type}</td>
                            <td className="p-2 font-bold">{Number(payment.amount).toLocaleString()} ש״ח</td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                payment.status === "completed" 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-amber-100 text-amber-700"
                              }`}>
                                {payment.status === "completed" ? "הושלם" : "ממתין"}
                              </span>
                            </td>
                            <td className="p-2 font-mono text-xs">{payment.payment_id || "-"}</td>
                            <td className="p-2">{new Date(payment.created_at).toLocaleDateString("he-IL")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="secondhand">
            <Card>
              <CardHeader>
                <CardTitle>פריטים יד שתיים</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">טוען...</div>
                ) : items.secondHand.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">אין פריטים</div>
                ) : (
                  <div className="space-y-2">
                    {items.secondHand.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {Number(item.price).toLocaleString()} ש״ח | {item.contact_name} | {item.payment_status}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete("second_hand_items", item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realestate">
            <Card>
              <CardHeader>
                <CardTitle>נכסי נדל״ן</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">טוען...</div>
                ) : items.realEstate.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">אין נכסים</div>
                ) : (
                  <div className="space-y-2">
                    {items.realEstate.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {Number(item.price).toLocaleString()} ש״ח | {item.location} | {item.payment_status}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete("real_estate", item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="taxis">
            <Card>
              <CardHeader>
                <CardTitle>נהגי מוניות</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">טוען...</div>
                ) : items.taxis.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">אין נהגים</div>
                ) : (
                  <div className="space-y-2">
                    {items.taxis.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{item.driver_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.phone} | {item.location || "לא צוין מיקום"}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete("taxis", item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers">
            <Card>
              <CardHeader>
                <CardTitle>מורים פרטיים</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">טוען...</div>
                ) : items.teachers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">אין מורים</div>
                ) : (
                  <div className="space-y-2">
                    {items.teachers.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.subject} | {item.phone}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete("teachers", item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wenwen">
            <Card>
              <CardHeader>
                <CardTitle>מיזמי WenWen</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">טוען...</div>
                ) : items.wenwen.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">אין מיזמים</div>
                ) : (
                  <div className="space-y-2">
                    {items.wenwen.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.venture_type} | {item.contact_name} | {item.payment_status}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete("wenwen_ventures", item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
