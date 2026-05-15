"use client"

import Link from "next/link"
import { 
  ShoppingBag, 
  Home, 
  Car, 
  GraduationCap, 
  Lightbulb,
  Shield,
  Sparkles
} from "lucide-react"
import { ShareButton } from "@/components/share-button"

const categories = [
  {
    id: "second-hand",
    title: "יד שתיים חדש דנדש",
    description: "פריטים יד שנייה במחירי מציאה",
    icon: ShoppingBag,
    href: "/second-hand",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    fee: "40 ש״ח לפריט"
  },
  {
    id: "real-estate",
    title: "נדל״ן",
    description: "דירות, בתים ונכסים למכירה והשכרה",
    icon: Home,
    href: "/real-estate",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    fee: "1,500 ש״ח למודעה"
  },
  {
    id: "taxis",
    title: "מוניות",
    description: "שירותי הסעות ומוניות באזור",
    icon: Car,
    href: "/taxis",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    fee: "חינם"
  },
  {
    id: "teachers",
    title: "מורים",
    description: "מורים פרטיים ושיעורים בכל התחומים",
    icon: GraduationCap,
    href: "/teachers",
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-50",
    fee: "חינם"
  },
  {
    id: "wenwen",
    title: "WenWen - מיזמים",
    description: "שיתוף לידים, הזדמנויות עסקיות ומיזמים",
    icon: Lightbulb,
    href: "/wenwen",
    color: "from-fuchsia-500 to-fuchsia-600",
    bgColor: "bg-fuchsia-50",
    fee: "דמי רצינות + עמלת הצלחה",
    featured: true
  },
]

export function CategoriesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.id} className="relative group">
          <Link
            href={category.href}
            className={`block p-6 rounded-2xl border-2 border-transparent bg-card shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/20 ${
              category.featured ? "ring-2 ring-fuchsia-500 ring-offset-2" : ""
            }`}
          >
            {category.featured && (
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                חדש!
              </div>
            )}
            
            <div className={`w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center mb-4`}>
              <category.icon className={`h-7 w-7 bg-gradient-to-br ${category.color} bg-clip-text`} style={{ color: category.color.includes("blue") ? "#3b82f6" : category.color.includes("emerald") ? "#10b981" : category.color.includes("amber") ? "#f59e0b" : category.color.includes("rose") ? "#f43f5e" : "#d946ef" }} />
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-2">{category.title}</h3>
            <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                {category.fee}
              </span>
            </div>
          </Link>
          
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <ShareButton
              title={category.title}
              url={category.href}
              text={`בדקו את ${category.title} בקניון א׳סם והתנאים WOW!`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function Header() {
  return (
    <header className="bg-gradient-to-l from-primary via-primary to-accent text-white py-8 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 text-balance">
              הקניון א׳סם והתנאים WOW
            </h1>
            <p className="text-white/80 text-lg">
              הקניון המקוון הגדול - הכל במקום אחד!
            </p>
          </div>
          <Link
            href="/admin"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="ניהול"
          >
            <Shield className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  )
}
