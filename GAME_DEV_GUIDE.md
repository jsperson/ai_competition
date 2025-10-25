# Game Development Guide

Complete guide for building web games with Phaser 3 in this repository.

## 🚀 Quick Start

### Creating a New Game

1. **Copy the template:**
   ```bash
   cp src/pages/GameTemplate.jsx src/pages/MyNewGame.jsx
   ```

2. **Update the game name:**
   - Replace `GameTemplate` with `MyNewGame` in the component
   - Update the game title in the header
   - Customize the instructions

3. **Add route in App.jsx:**
   ```jsx
   import MyNewGame from './pages/MyNewGame';
   // ...
   <Route path="/my-new-game" element={<MyNewGame />} />
   ```

4. **Start building!**

---

## 📚 Available Resources

### Game Helpers (`src/utils/gameHelpers.js`)

Pre-built utilities for common game mechanics:

**Texture Creation:**
- `createSimpleTexture()` - Rectangle textures
- `createCircleTexture()` - Circle textures
- `createTriangleTexture()` - Triangle textures (spaceships!)

**Player Setup:**
- `createPlayer()` - Create physics-enabled player
- `setupKeyboardControls()` - Setup arrow keys
- `moveWithArrowKeys()` - 360° movement
- `platformMovement()` - Platformer-style controls

**Groups & Spawning:**
- `createEnemyGroup()` - Enemy group management
- `createBulletGroup()` - Bullet pooling
- `shootBullet()` - Fire projectiles
- `spawnRandomEnemy()` - Random enemy spawning
- `createSpawnTimer()` - Timed spawning

**UI & Scoring:**
- `createScoreText()` - Score display
- `updateScore()` - Update score
- `showGameOver()` - Game over screen

**Utilities:**
- `cleanupOffscreenSprites()` - Remove off-screen objects
- `handleCollision()` - Generic collision handler

### Context7 Documentation

Ask me for Phaser docs on any topic:
- "Show me Phaser sprite animation examples"
- "How do I create a tilemap in Phaser?"
- "Help me implement particle effects"
- "Show me Phaser camera controls"

I'll fetch live documentation from Context7!

---

## 🎮 Common Game Patterns

### Pattern 1: Shooter Game (like Space Shooter demo)

```javascript
// In create()
const player = createPlayer(this, 400, 500, 'playerTexture');
const bullets = createBulletGroup(this, 'bulletTexture', 20);
const enemies = createEnemyGroup(this, 'enemyTexture', 10);

createSpawnTimer(this, 1000, () => {
  spawnRandomEnemy(enemies, 800, 100, 200);
});

this.input.keyboard.on('keydown-SPACE', () => {
  shootBullet(bullets, player, 0, -20, 0, -400);
});

this.physics.add.overlap(bullets, enemies, (bullet, enemy) => {
  handleCollision(bullet, enemy, () => updateScore(scoreText, score += 10));
});

// In update()
moveWithArrowKeys(player, cursors, 300);
cleanupOffscreenSprites(bullets, 600, 800);
```

### Pattern 2: Platformer Game

```javascript
// In create()
this.physics.world.gravity.y = 500;
const player = createPlayer(this, 100, 100, 'player');

const platforms = this.physics.add.staticGroup();
platforms.create(400, 568, 'ground');
platforms.create(600, 400, 'platform');

this.physics.add.collider(player, platforms);

// In update()
platformMovement(player, cursors, 200, -400);
```

### Pattern 3: Endless Runner

```javascript
// In create()
let speed = 200;
const obstacles = this.physics.add.group();

createSpawnTimer(this, 1500, () => {
  const obstacle = obstacles.create(800, 500, 'obstacle');
  obstacle.setVelocityX(-speed);
});

// In update()
speed += 0.1; // Gradually increase difficulty
obstacles.children.each(obs => {
  if (obs.x < -50) obs.destroy();
});
```

---

## 🎨 Creating Game Assets

### Using Graphics (No Images Needed)

```javascript
function createAssets() {
  // Simple rectangle
  const graphics = this.add.graphics();
  graphics.fillStyle(0xff0000, 1);
  graphics.fillRect(0, 0, 32, 32);
  graphics.generateTexture('myTexture', 32, 32);
  graphics.destroy();

  // Circle
  graphics = this.add.graphics();
  graphics.fillStyle(0x00ff00, 1);
  graphics.fillCircle(16, 16, 16);
  graphics.generateTexture('circleTexture', 32, 32);
  graphics.destroy();

  // Triangle
  graphics = this.add.graphics();
  graphics.fillStyle(0x0000ff, 1);
  graphics.beginPath();
  graphics.moveTo(16, 0);
  graphics.lineTo(0, 32);
  graphics.lineTo(32, 32);
  graphics.closePath();
  graphics.fillPath();
  graphics.generateTexture('triangleTexture', 32, 32);
  graphics.destroy();
}
```

### Using External Images (Optional)

```javascript
function preload() {
  this.load.image('player', '/assets/player.png');
  this.load.spritesheet('enemy', '/assets/enemy.png', {
    frameWidth: 32,
    frameHeight: 32
  });
}
```

---

## 🔧 Common Customizations

### Change Physics

```javascript
// Platformer (gravity pulls down)
physics: {
  default: 'arcade',
  arcade: {
    gravity: { y: 500 },
    debug: false
  }
}

// Top-down (no gravity)
physics: {
  default: 'arcade',
  arcade: {
    gravity: { y: 0 },
    debug: false
  }
}
```

### Adjust Canvas Size

```javascript
const config = {
  width: 1024,  // Change width
  height: 768,  // Change height
  // ...
}
```

### Change Background Color

```javascript
const config = {
  backgroundColor: '#1a1a2e',  // Dark blue
  // Or try: '#2c3e50', '#34495e', '#000000'
  // ...
}
```

---

## 🎯 Development Workflow

### Step 1: Plan Your Game
- What's the core mechanic?
- Top-down or side-view?
- What controls does the player use?
- What's the win/lose condition?

### Step 2: Start with Template
```bash
cp src/pages/GameTemplate.jsx src/pages/MyGame.jsx
```

### Step 3: Build Incrementally
1. Create player sprite
2. Add movement controls
3. Add one game mechanic at a time
4. Test frequently
5. Add scoring/UI
6. Polish and deploy

### Step 4: Ask for Help
Use Context7 through me:
- "How do I make the player animate when moving?"
- "Show me examples of particle effects in Phaser"
- "Help me create a health bar"
- "How do I add sound effects?"

### Step 5: Deploy
```bash
git add .
git commit -m "feat: Add [your game name]"
git push
```

Vercel auto-deploys your game!

---

## 📖 Example: Building a Simple Game

Let's build a "Catch the Falling Objects" game:

```javascript
// In create()
createSimpleTexture(this, 'player', 0x00ff00, 60, 20);  // Green paddle
createCircleTexture(this, 'ball', 0xff0000, 15);        // Red ball

const player = createPlayer(this, 400, 550, 'player');
const balls = createEnemyGroup(this, 'ball', 10);

let score = 0;
const scoreText = createScoreText(this, 16, 16, 'Score: 0');

// Spawn balls every second
createSpawnTimer(this, 1000, () => {
  spawnRandomEnemy(balls, 800, 150, 250);
});

// Catch balls
this.physics.add.overlap(player, balls, (player, ball) => {
  ball.destroy();
  score += 10;
  updateScore(scoreText, score, 'Score: ');
});

// Game over if ball hits bottom
balls.children.each(ball => {
  if (ball.y > 600) {
    showGameOver(this, score, () => this.scene.restart());
  }
});

// In update()
if (cursors.left.isDown) {
  player.setVelocityX(-400);
} else if (cursors.right.isDown) {
  player.setVelocityX(400);
} else {
  player.setVelocityX(0);
}
```

Done! You have a complete game in ~30 lines.

---

## 🚀 Tips for Success

1. **Start Simple** - Get one mechanic working before adding more
2. **Use Helpers** - Import from `gameHelpers.js` to save time
3. **Test Often** - Run the game after every change
4. **Ask Questions** - I can fetch Phaser docs on demand
5. **Copy Patterns** - Look at `Game.jsx` for working examples
6. **Deploy Early** - Push to Vercel to test on live URL

---

## 🔗 Useful Resources

- **Phaser Docs:** https://phaser.io/docs
- **Phaser Examples:** https://phaser.io/examples
- **Context7 (via me):** Ask for specific Phaser documentation
- **This Repo:**
  - `src/pages/Game.jsx` - Working space shooter example
  - `src/pages/GameTemplate.jsx` - Copy this for new games
  - `src/utils/gameHelpers.js` - Reusable utilities

---

## 🎮 Ready to Build?

Ask me:
- "Build a platformer game with jumping"
- "Create a puzzle game with matching colors"
- "Make a racing game with obstacles"
- "Help me add animations to my game"

Let's make games! 🚀
