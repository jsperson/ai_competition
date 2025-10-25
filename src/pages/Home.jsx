import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Sparkles, Code, Rocket } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950">
      {/* Navigation */}
      <nav className="bg-blue-950/80 backdrop-blur-sm sticky top-0 z-50 border-b border-yellow-500/30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-yellow-400">Kansas Web Games</h1>
          <div className="flex gap-3">
            <Button variant="ghost" className="text-yellow-400 hover:bg-yellow-400/20 border border-yellow-400/30" onClick={() => navigate('/game')}>
              Space Shooter
            </Button>
            <Button className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-bold" onClick={() => navigate('/wichita-moonbase')}>
              🛡️ Defend Wichita
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-4 pb-8 text-center text-yellow-100">
        <div className="max-w-5xl mx-auto">
          {/* Featured Game Banner */}
          <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border-2 border-yellow-400/60 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl">🏆</span>
              <h2 className="text-2xl font-bold text-yellow-400">Featured Challenge Game</h2>
            </div>
            <p className="text-base mb-3 text-yellow-200">AI Prompt Championship - Wichita Regional</p>
            <Button
              size="lg"
              className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 text-lg px-8 py-4 font-bold"
              onClick={() => navigate('/wichita-moonbase')}
            >
              Play: Defend Wichita 🛡️🏙️
            </Button>
          </div>

          <div className="flex justify-center mb-3">
            <Gamepad2 size={48} className="text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-yellow-400">Kansas Web Games</h1>
          <p className="text-lg mb-4 text-yellow-200">
            Powered by Phaser 3, React, and Vite - Navy Blue Pride, Gold Determination
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-yellow-400/10 text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/20 text-base px-6 py-3"
              onClick={() => navigate('/game')}
            >
              Space Shooter Demo
              <Rocket className="ml-2" size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center hover:shadow-2xl hover:shadow-yellow-500/20 transition-shadow bg-blue-900/30 backdrop-blur-md border-2 border-yellow-500/30">
            <CardContent className="pt-4 pb-4">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Gamepad2 className="text-yellow-400" size={24} />
              </div>
              <h3 className="text-lg font-bold mb-1 text-yellow-400">Phaser 3 Framework</h3>
              <p className="text-yellow-100/80 text-sm">
                Industry-standard HTML5 game engine with Canvas & WebGL rendering
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-2xl hover:shadow-yellow-500/20 transition-shadow bg-blue-900/30 backdrop-blur-md border-2 border-yellow-500/30">
            <CardContent className="pt-4 pb-4">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Code className="text-yellow-400" size={24} />
              </div>
              <h3 className="text-lg font-bold mb-1 text-yellow-400">React + Vite</h3>
              <p className="text-yellow-100/80 text-sm">
                Lightning-fast development with hot module replacement
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-2xl hover:shadow-yellow-500/20 transition-shadow bg-blue-900/30 backdrop-blur-md border-2 border-yellow-500/30">
            <CardContent className="pt-4 pb-4">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Sparkles className="text-yellow-400" size={24} />
              </div>
              <h3 className="text-lg font-bold mb-1 text-yellow-400">Instant Deploy</h3>
              <p className="text-yellow-100/80 text-sm">
                Push to Git and deploy automatically to Vercel's global CDN
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="mt-6 text-center text-yellow-100">
          <h2 className="text-xl font-bold mb-3 text-yellow-400">Ready to Build Games</h2>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            <div className="bg-yellow-400/20 backdrop-blur-md px-4 py-1 rounded-full text-yellow-400 border border-yellow-400/40 text-sm">Phaser 3</div>
            <div className="bg-yellow-400/20 backdrop-blur-md px-4 py-1 rounded-full text-yellow-400 border border-yellow-400/40 text-sm">React 18</div>
            <div className="bg-yellow-400/20 backdrop-blur-md px-4 py-1 rounded-full text-yellow-400 border border-yellow-400/40 text-sm">Vite</div>
            <div className="bg-yellow-400/20 backdrop-blur-md px-4 py-1 rounded-full text-yellow-400 border border-yellow-400/40 text-sm">shadcn/ui</div>
            <div className="bg-yellow-400/20 backdrop-blur-md px-4 py-1 rounded-full text-yellow-400 border border-yellow-400/40 text-sm">Vercel</div>
          </div>
        </div>
      </div>
    </div>
  )
}
