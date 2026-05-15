import { Header, CategoriesGrid } from "@/components/categories-grid"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            בחרו קטגוריה
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            מצאו את מה שאתם מחפשים - פריטים יד שנייה, נדל״ן, מוניות, מורים פרטיים והזדמנויות עסקיות
          </p>
        </div>
        
        <CategoriesGrid />
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-muted px-6 py-3 rounded-full">
            <span className="text-sm text-muted-foreground">
              כל המודעות מאומתות ומאושרות לפני פרסום
            </span>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>הקניון א׳סם והתנאים WOW - כל הזכויות שמורות</p>
        </div>
      </footer>
    </div>
  )
}
