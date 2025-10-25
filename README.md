# Kansas Web Games

AI Prompt Championship - Wichita Regional - Challenge #2

A collection of interactive web games built with Phaser 3, React, and Vite, featuring iconic Wichita landmarks and Kansas-themed design.

## 🎮 Games

### 1. Defend Wichita 🛡️
**Route:** `/wichita-moonbase`

An asteroid defense game where you protect the city of Wichita from a rogue moonbase launching asteroids. Features:
- Defend Wichita at the bottom of the screen
- Dual health system (player ship + city health)
- Wave-based progression (every 10 asteroids)
- Kansas Navy Blue and Gold color scheme
- Win condition: Destroy 50 asteroids
- Built with Phaser 3 arcade physics

### 2. Moon to Wichita Lander 🚀
**Route:** `/lunar-lander`

A precision lunar lander game where you launch from the moon and land on Wichita's iconic Century 2 Performing Arts Center. Features:
- Real Wichita skyline background photo
- Apollo Lunar Module-style spacecraft
- Realistic physics with gravity, thrust, and fuel management
- Random start positions for varied gameplay
- Landing target: Blue dome of Century 2
- Success criteria: Speed < 80, minimal tilt
- Fuel efficiency scoring bonus

### 3. Space Shooter Demo
**Route:** `/game`

Classic space shooter demonstration game.

## 🏗️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Game Engine:** Phaser 3 (HTML5 game framework)
- **UI Components:** shadcn/ui (Radix UI + Tailwind CSS)
- **Routing:** React Router v6
- **Deployment:** Vercel
- **Icons:** Lucide React

## 🎨 Design Theme

**Kansas Colors:**
- Navy Blue: `#001f3f` (primary background)
- Gold: `#FFD700` (accents, UI elements, highlights)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will start at `http://localhost:5173`

## 📁 Project Structure

```
ai_competition/
├── public/
│   └── wichita_lunar_lander_bg_1.jpg   # Background image for lunar lander
├── src/
│   ├── components/ui/                   # shadcn UI components
│   ├── pages/
│   │   ├── Home.jsx                     # Landing page
│   │   ├── Game.jsx                     # Space shooter demo
│   │   ├── WichitaMoonbase.jsx          # Defend Wichita game
│   │   └── LunarLander.jsx              # Moon to Wichita lander
│   ├── utils/
│   │   └── gameHelpers.js               # Reusable Phaser 3 utilities
│   ├── App.jsx                          # Main app with routing
│   └── main.jsx                         # Entry point
├── prompts/
│   └── master_challenge.md              # Competition workflow guide
├── CLAUDE.md                            # Project instructions for AI
├── GAME_DEV_GUIDE.md                    # Game development documentation
└── README.md                            # This file
```

## 🎯 Challenge Requirements Met

✅ **City of Wichita included** - Featured in both games
✅ **Moonbase included** - Featured as enemy in Defend Wichita
✅ **Fully interactive playable games** - Two complete games with win/lose states
✅ **Publicly accessible demo** - Deployed on Vercel
✅ **Instructions included** - In-game instructions for all games
✅ **Kansas regional branding** - Navy Blue and Gold throughout

## 🌟 Key Features

### Phaser 3 Integration
- Custom sprite generation (no external image dependencies)
- Arcade physics system
- Particle effects for explosions and thrust
- Collision detection and handling
- Real-time UI updates

### Game Helpers Library
Pre-built utilities in `src/utils/gameHelpers.js`:
- Player creation and controls
- Texture generation (shapes, circles, triangles)
- Bullet and enemy spawning systems
- Collision handling
- Score and UI management
- Cleanup utilities

### Real-Time Features
- Dynamic difficulty (wave progression in Defend Wichita)
- Fuel management (Lunar Lander)
- Score calculation with bonuses
- Health tracking (dual systems in Defend Wichita)
- Altitude and velocity displays

## 🎮 Game Controls

### Defend Wichita
- **Arrow Keys:** Move ship
- **Spacebar:** Shoot
- Destroy asteroids before they hit Wichita!

### Lunar Lander
- **Up Arrow:** Main upward thrust
- **Down Arrow:** Descent boost
- **Left/Right Arrows:** Lateral thrust
- Land softly on the gold pad (speed < 80)

## 📝 Development Notes

### Adding New Games
1. Copy `src/pages/GameTemplate.jsx` or use an existing game as template
2. Update game logic in `create()` and `update()` functions
3. Add route in `src/App.jsx`
4. Add navigation button in `src/pages/Home.jsx`

### Using Game Helpers
```javascript
import { createPlayer, shootBullet, createSimpleTexture } from '@/utils/gameHelpers';

// In your create() function
const player = createPlayer(this, 400, 500, 'playerTexture');
const bullets = createBulletGroup(this, 'bulletTexture', 20);
```

See `GAME_DEV_GUIDE.md` for detailed game development documentation.

## 🌐 Deployment

This project is configured for automatic deployment to Vercel. Every push to the `main` branch triggers a new deployment.

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting service
```

## 📄 License

Built for the AI Prompt Championship - Wichita Regional

## 🙏 Acknowledgments

- **Phaser 3** - Excellent HTML5 game framework
- **shadcn/ui** - Beautiful component library
- **Wichita, Kansas** - For the inspiration and landmarks
- **AI Prompt Championship** - For the challenge opportunity

---

🚀 **Generated with [Claude Code](https://claude.com/claude-code)**

🏛️ **Featuring Wichita's Century 2 Performing Arts Center & INTRUST Bank Arena**

⚡ **Powered by Navy Blue Pride and Gold Determination**
