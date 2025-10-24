import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 pt-20 pb-32 text-center text-white">
        <h1 className="text-6xl font-bold mb-6">Competition MVP</h1>
        <p className="text-2xl mb-8 text-white/90">Ready to build your challenge</p>
        <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
          Get Started
        </Button>
      </div>
    </div>
  )
}
