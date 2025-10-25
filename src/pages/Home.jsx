import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Sparkles, Code, Rocket } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-sm sticky top-0 z-50 border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Web Game Studio</h1>
          <div className="flex gap-4">
            <Button className="bg-white text-purple-600 hover:bg-white/90" onClick={() => navigate('/game')}>
              Play Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Gamepad2 size={80} className="text-white/90" />
          </div>
          <h1 className="text-6xl font-bold mb-6">Build Innovative Web Games</h1>
          <p className="text-2xl mb-8 text-white/90">
            Powered by Phaser 3, React, and Vite - Deploy instantly to Vercel
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-white/90 text-lg px-8 py-6"
            onClick={() => navigate('/game')}
          >
            Try Space Shooter Demo
            <Rocket className="ml-2" size={20} />
          </Button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-2xl transition-shadow bg-white/95">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Phaser 3 Framework</h3>
              <p className="text-muted-foreground text-lg">
                Industry-standard HTML5 game engine with Canvas & WebGL rendering
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-2xl transition-shadow bg-white/95">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="text-purple-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">React + Vite</h3>
              <p className="text-muted-foreground text-lg">
                Lightning-fast development with hot module replacement
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-2xl transition-shadow bg-white/95">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Instant Deploy</h3>
              <p className="text-muted-foreground text-lg">
                Push to Git and deploy automatically to Vercel's global CDN
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center text-white">
          <h2 className="text-3xl font-bold mb-8">Ready to Build Games</h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">Phaser 3</div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">React 18</div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">Vite</div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">shadcn/ui</div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">Vercel</div>
          </div>
        </div>
      </div>
    </div>
  )
}
