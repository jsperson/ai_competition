# Kansas Web Games

**AI Prompt Championship - Wichita Regional - Challenge #2**

A collection of interactive web games built with Phaser 3, React, and Vite, featuring iconic Wichita landmarks and Kansas-themed design.

**🏆 Second Place Winner** - Game Challenge at the First Wichita Regional AI Competition (October 25, 2024)

## 🤖 Built with AI-First Development

This entire project was developed using **agentic development** with [Claude Code](https://claude.com/claude-code) in approximately **one hour**. Starting with a search about how to do game development, Claude autonomously:

- Researched Phaser 3 documentation via Context7 MCP server
- Architected the React + Phaser integration
- Built two complete games with physics, particle effects, and scoring
- Created reusable game development utilities
- Implemented Kansas-themed UI with shadcn components
- Deployed to Vercel with auto-deployment

This demonstrates the power of agentic AI development for rapid prototyping and competition-style development.

## 🎮 Featured Games

### 1. Defend Wichita 🛡️
**Route:** `/wichita-moonbase`

An asteroid defense game protecting Wichita from a rogue moonbase. Features:
- Defend Wichita at the bottom of the screen
- Dual health system (player ship + city health)
- Wave-based progression (every 10 asteroids)
- Win condition: Destroy 50 asteroids
- Kansas Navy Blue (#001f3f) and Gold (#FFD700) color scheme

**Controls:**
- Arrow Keys: Move ship
- Spacebar: Shoot

### 2. Moon to Wichita Lander 🚀
**Route:** `/lunar-lander`

A precision lunar lander where you launch from the moon and land on Wichita's Century 2 Performing Arts Center. Features:
- Real Wichita skyline background photo
- Apollo Lunar Module-style spacecraft with thruster particles
- Realistic physics (gravity, thrust, fuel management)
- Landing target: Century 2's blue dome
- Success criteria: Speed < 80, minimal tilt
- Fuel efficiency scoring bonus

**Controls:**
- Up Arrow: Main upward thrust
- Down Arrow: Descent boost
- Left/Right Arrows: Lateral thrust

## 🏗️ Tech Stack

- **Frontend:** React 18
- **Build Tool:** Vite
- **Game Engine:** Phaser 3 (HTML5 game framework)
- **UI Components:** shadcn/ui (Radix UI + Tailwind CSS)
- **Routing:** React Router v6
- **Deployment:** Vercel (auto-deploy on push)
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm

### Installation & Development

```bash
# Install dependencies
npm install

# Run development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
ai_competition/
├── public/
│   ├── vite.svg
│   └── wichita_lunar_lander_bg_1.jpg    # Wichita skyline background
├── src/
│   ├── components/ui/                    # shadcn UI components
│   │   ├── button.jsx
│   │   └── card.jsx
│   ├── lib/
│   │   └── utils.js                      # cn() utility
│   ├── pages/
│   │   ├── Home.jsx                      # Landing page
│   │   ├── Game.jsx                      # Space shooter demo
│   │   ├── WichitaMoonbase.jsx           # Defend Wichita game
│   │   └── LunarLander.jsx               # Lunar lander game
│   ├── utils/
│   │   └── gameHelpers.js                # Reusable Phaser utilities
│   ├── App.jsx                           # React Router setup
│   └── main.jsx                          # Entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json                           # Deployment config
```

## 🎯 Challenge Requirements

✅ **City of Wichita** - Featured in both games with real skyline photo
✅ **Moonbase** - Featured as enemy in Defend Wichita + launch point in Lunar Lander
✅ **Fully interactive games** - Complete win/lose states, scoring, progression
✅ **Publicly accessible** - Auto-deployed to Vercel
✅ **Instructions** - In-game instructions for all games
✅ **Kansas branding** - Navy Blue and Gold throughout

## 🌟 Key Technical Features

### Phaser 3 Integration

**Custom Asset Generation**
- All sprites generated programmatically (no external images needed for sprites)
- Graphics API used to create shapes: triangles (ships), circles (asteroids), rectangles
- Texture generation with `generateTexture()` for reusable sprites

**Physics System**
- Arcade physics for collision detection
- Gravity simulation (Lunar Lander: 150 units/s²)
- Velocity-based movement and controls
- Collision groups and overlap detection

**Visual Effects**
- Particle emitters for explosions (red/orange particles)
- Thruster particles (gold/yellow flame effects)
- Real-time UI updates (fuel, altitude, velocity displays)

**Game Helpers Library** (`src/utils/gameHelpers.js`)

Pre-built utilities for rapid game development:

```javascript
// Texture creation
createSimpleTexture(scene, key, color, width, height)
createCircleTexture(scene, key, color, radius)
createTriangleTexture(scene, key, color, width, height)

// Player setup
createPlayer(scene, x, y, texture)
setupKeyboardControls(scene)
moveWithArrowKeys(player, cursors, speed)

// Groups & spawning
createEnemyGroup(scene, texture, maxSize)
createBulletGroup(scene, texture, maxSize)
shootBullet(bullets, source, offsetX, offsetY, velocityX, velocityY)
spawnRandomEnemy(group, maxX, minY, maxY)

// UI & scoring
createScoreText(scene, x, y, text)
updateScore(textObject, newScore)
showGameOver(scene, score, restartCallback)

// Utilities
cleanupOffscreenSprites(group, screenWidth, screenHeight)
handleCollision(obj1, obj2, onCollideCallback)
```

### Game Architecture Patterns

**Scene Lifecycle:**
```javascript
preload() {
  // Load assets (images, spritesheets)
}

create() {
  // Initialize game objects, physics, UI
  // Setup event listeners
  // Create textures and sprites
}

update() {
  // Game loop - runs every frame
  // Update positions, check conditions
  // Handle continuous input
}
```

**Common Pattern - Shooter Game:**
```javascript
// In create()
const player = createPlayer(this, 400, 500, 'playerTexture');
const bullets = createBulletGroup(this, 'bulletTexture', 20);
const enemies = createEnemyGroup(this, 'enemyTexture', 10);

this.physics.add.overlap(bullets, enemies, (bullet, enemy) => {
  handleCollision(bullet, enemy, () => updateScore(scoreText, score += 10));
});

// In update()
moveWithArrowKeys(player, cursors, 300);
cleanupOffscreenSprites(bullets, 600, 800);
```

### React Integration

**Component Structure:**
```jsx
export default function GameComponent() {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {
    // Initialize Phaser game
    const config = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      // ... game config
    };

    phaserGameRef.current = new Phaser.Game(config);

    // Cleanup on unmount
    return () => {
      phaserGameRef.current?.destroy(true);
    };
  }, []);

  return <div ref={gameRef} />;
}
```

## 🎨 Design System

**Kansas Color Palette:**
- Navy Blue: `#001f3f` (primary background, UI)
- Gold: `#FFD700` (accents, highlights, thrust particles)
- Silver: `#C0C0C0` (spacecraft, UI elements)

**Typography:**
- Font Family: System fonts (optimized for performance)
- UI Text: Tailwind CSS utilities
- Game Text: Phaser text objects (Arial, 24px)

## 🔧 Development Guide

### Adding a New Game

1. **Create game page:**
```bash
# Use existing game as template
cp src/pages/Game.jsx src/pages/NewGame.jsx
```

2. **Add route in App.jsx:**
```jsx
import NewGame from './pages/NewGame';

<Route path="/new-game" element={<NewGame />} />
```

3. **Add navigation in Home.jsx:**
```jsx
<Button onClick={() => navigate("/new-game")}>
  Play New Game
</Button>
```

4. **Customize game logic** in `create()` and `update()` functions

### Using Game Helpers

```javascript
import {
  createPlayer,
  createBulletGroup,
  shootBullet,
  createSimpleTexture
} from '@/utils/gameHelpers';

function create() {
  // Create textures
  createSimpleTexture(this, 'player', 0x00ff00, 32, 32);

  // Create game objects
  const player = createPlayer(this, 400, 500, 'player');
  const bullets = createBulletGroup(this, 'bullet', 20);

  // Setup shooting
  this.input.keyboard.on('keydown-SPACE', () => {
    shootBullet(bullets, player, 0, -10, 0, -400);
  });
}
```

### Debugging Tips

1. **Enable physics debug mode:**
```javascript
physics: {
  default: 'arcade',
  arcade: {
    debug: true  // Shows collision boundaries
  }
}
```

2. **Console logging in Phaser:**
```javascript
update() {
  console.log('Player position:', this.player.x, this.player.y);
}
```

3. **Check game state:**
```javascript
this.scene.pause();  // Pause game
this.scene.resume(); // Resume game
```

## 🌐 Deployment

**Automatic Deployment:**
- Every `git push` to `main` triggers Vercel deployment
- Build command: `npm run build`
- Output directory: `dist/`

**Manual Deployment:**
```bash
npm run build
# Upload dist/ folder to hosting service
```

## 🎮 Game Development Resources

**Phaser 3 Documentation:**
- Official Docs: https://phaser.io/docs
- Examples: https://phaser.io/examples
- API Reference: https://newdocs.phaser.io/docs/3.80.1

**Useful Phaser Features:**
- Physics: `this.physics.add.sprite()`, `this.physics.add.collider()`
- Input: `this.input.keyboard.addKey()`, `this.input.on('pointerdown')`
- Tweens: `this.tweens.add()` for smooth animations
- Particles: `this.add.particles()` for visual effects
- Cameras: `this.cameras.main` for camera effects

## 📊 Performance Optimizations

1. **Object Pooling:** Reuse bullets/enemies instead of creating/destroying
2. **Texture Generation:** Create textures once in `create()`, not in `update()`
3. **Cleanup:** Remove off-screen objects to prevent memory leaks
4. **Group Limits:** Set `maxSize` on physics groups to limit active objects

## 🐛 Known Issues & Solutions

**Issue:** Game doesn't restart properly after game over
**Solution:** Use `this.scene.restart()` to reset all game state

**Issue:** Collision detection not working
**Solution:** Ensure both objects are physics-enabled and use correct collision method

**Issue:** Performance drops with many objects
**Solution:** Implement object pooling and cleanup off-screen sprites

## 🏆 Credits

**Built For:** AI Prompt Championship - Wichita Regional
**Game Engine:** Phaser 3 - Fast, free, and fun HTML5 game framework
**UI Library:** shadcn/ui - Beautifully designed component library
**Wichita Landmarks:**
- Century 2 Performing Arts Center (blue dome)
- INTRUST Bank Arena
- Wichita skyline

---

**🚀 Generated with [Claude Code](https://claude.com/claude-code)**

**🏛️ Featuring Wichita's Iconic Landmarks**

**⚡ Powered by Kansas Pride - Navy Blue & Gold**

---

## 🔗 Related Repositories

This submission was part of a complete competition portfolio:

- **[challenge-1](https://github.com/jsperson/challenge-1)** - Architect Track (Challenge #1): LaunchKS platform (workforce development app)
- **[ai_competition_oracle](https://github.com/jsperson/ai_competition_oracle)** - Oracle Track (Winner): Business plan and market research
- **[ai_competition_2](https://github.com/jsperson/ai_competition_2)** - Challenge #4: Punchcard decoder
- **ai_competition** (this repo) - Architect Track (2nd Place): Kansas web games
