import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function WichitaMoonbase() {
  const navigate = useNavigate();
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {
    if (phaserGameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#001f3f', // Kansas Navy Blue
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: {
        create: create,
        update: update
      }
    };

    // ========== GAME VARIABLES ==========
    let player;
    let cursors;
    let bullets;
    let asteroids;
    let score = 0;
    let scoreText;
    let gameOver = false;
    let gameWon = false;

    // Game state
    let moonbase;
    let wichitaBuildings;
    let wave = 1;
    let waveText;
    let asteroidsDestroyed = 0;
    let cityHealth = 100;
    let cityHealthText;
    let playerHealth = 100;
    let playerHealthText;
    let totalAsteroidsToDefeat = 50;

    // ========== CREATE ==========
    function create() {
      // Create textures
      createTextures.call(this);

      // Background stars
      createStarfield.call(this);

      // Evil Moonbase at top
      moonbase = this.add.sprite(400, 80, 'moonbase');
      moonbase.setScale(1.5);
      moonbase.setTint(0xff4444); // Evil red tint

      // Add ominous glow
      const glow = this.add.circle(400, 80, 60, 0xff0000, 0.3);
      this.tweens.add({
        targets: glow,
        alpha: 0.1,
        duration: 1000,
        yoyo: true,
        repeat: -1
      });

      // Wichita city at bottom (to protect!)
      createWichitaCity.call(this);

      // UI Elements
      scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '24px',
        fill: '#FFD700', // Kansas Gold
        stroke: '#001f3f',
        strokeThickness: 3,
        fontStyle: 'bold'
      });

      waveText = this.add.text(400, 20, 'Wave: 1', {
        fontSize: '28px',
        fill: '#FFD700',
        stroke: '#001f3f',
        strokeThickness: 4,
        fontStyle: 'bold'
      }).setOrigin(0.5);

      cityHealthText = this.add.text(650, 16, 'City: 100%', {
        fontSize: '20px',
        fill: '#0f0',
        stroke: '#001f3f',
        strokeThickness: 3
      });

      playerHealthText = this.add.text(650, 45, 'Ship: 100%', {
        fontSize: '20px',
        fill: '#0ff',
        stroke: '#001f3f',
        strokeThickness: 3
      });

      // Warning message
      const warningText = this.add.text(400, 250, 'ALERT: MOONBASE ATTACKING!', {
        fontSize: '42px',
        fill: '#ff0000',
        stroke: '#FFD700',
        strokeThickness: 4,
        align: 'center',
        fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(100);

      this.tweens.add({
        targets: warningText,
        alpha: 0,
        duration: 3000,
        delay: 2000,
        onComplete: () => warningText.destroy()
      });

      // Create player ship (defender of Wichita!)
      player = this.physics.add.sprite(400, 450, 'player');
      player.setCollideWorldBounds(true);
      player.setDepth(50);
      player.setTint(0xFFD700); // Kansas Gold

      // Bullets group
      bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 30
      });

      // Asteroids group (enemy projectiles from moonbase!)
      asteroids = this.physics.add.group();

      // Keyboard controls
      cursors = this.input.keyboard.createCursorKeys();
      this.input.keyboard.on('keydown-SPACE', shootBullet, this);

      // Collisions
      this.physics.add.overlap(bullets, asteroids, hitAsteroid, null, this);
      this.physics.add.overlap(player, asteroids, hitPlayer, null, this);
      this.physics.add.overlap(wichitaBuildings, asteroids, asteroidHitsCity, null, this);

      // Start spawning asteroids from moonbase
      this.time.addEvent({
        delay: 1500,
        callback: spawnAsteroidFromMoonbase,
        callbackScope: this,
        loop: true
      });

      // Instructions (fade out after 5 seconds)
      const instructions = this.add.text(400, 400, 'DEFEND WICHITA!\nArrow Keys: Move | Space: Shoot', {
        fontSize: '20px',
        fill: '#FFD700',
        backgroundColor: '#001f3f',
        padding: { x: 15, y: 10 },
        align: 'center',
        fontStyle: 'bold'
      }).setOrigin(0.5).setAlpha(0.9);

      this.tweens.add({
        targets: instructions,
        alpha: 0,
        duration: 2000,
        delay: 5000,
        onComplete: () => instructions.destroy()
      });
    }

    // ========== UPDATE ==========
    function update() {
      if (gameOver || gameWon) return;

      // Player movement
      if (cursors.left.isDown) {
        player.setVelocityX(-350);
      } else if (cursors.right.isDown) {
        player.setVelocityX(350);
      } else {
        player.setVelocityX(0);
      }

      if (cursors.up.isDown) {
        player.setVelocityY(-350);
      } else if (cursors.down.isDown) {
        player.setVelocityY(350);
      } else {
        player.setVelocityY(0);
      }

      // Cleanup off-screen objects
      bullets.children.each(bullet => {
        if (bullet.y < 0) bullet.destroy();
      });

      asteroids.children.each(asteroid => {
        if (asteroid.y > 650) asteroid.destroy();
      });

      // Check win condition
      if (asteroidsDestroyed >= totalAsteroidsToDefeat && !gameWon) {
        winGame.call(this);
      }

      // Pulse moonbase menacingly
      if (moonbase) {
        const scale = 1.5 + Math.sin(this.time.now * 0.002) * 0.1;
        moonbase.setScale(scale);
      }
    }

    // ========== HELPER FUNCTIONS ==========
    function createTextures() {
      // Player ship (Kansas Gold defender)
      const graphics = this.add.graphics();
      graphics.fillStyle(0xFFD700, 1);
      graphics.beginPath();
      graphics.moveTo(15, 0);
      graphics.lineTo(0, 30);
      graphics.lineTo(30, 30);
      graphics.closePath();
      graphics.fillPath();
      // Add Kansas blue exhaust
      graphics.fillStyle(0x001f3f, 1);
      graphics.fillRect(12, 30, 6, 8);
      graphics.generateTexture('player', 30, 38);
      graphics.destroy();

      // Bullet (gold)
      const bulletGraphics = this.add.graphics();
      bulletGraphics.fillStyle(0xFFD700, 1);
      bulletGraphics.fillRect(0, 0, 5, 15);
      bulletGraphics.generateTexture('bullet', 5, 15);
      bulletGraphics.destroy();

      // Asteroid (moonbase weapon - darker, more menacing)
      const asteroidGraphics = this.add.graphics();
      asteroidGraphics.fillStyle(0x8b0000, 1); // Dark red
      asteroidGraphics.fillCircle(20, 20, 20);
      asteroidGraphics.fillStyle(0x4a0000, 1);
      asteroidGraphics.fillCircle(12, 15, 8);
      asteroidGraphics.fillCircle(25, 22, 6);
      asteroidGraphics.generateTexture('asteroid', 40, 40);
      asteroidGraphics.destroy();

      // Wichita building (Kansas colors)
      const buildingGraphics = this.add.graphics();
      buildingGraphics.fillStyle(0x555555, 1);
      buildingGraphics.fillRect(0, 0, 40, 80);
      // Gold windows
      buildingGraphics.fillStyle(0xFFD700, 0.9);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 6; j++) {
          buildingGraphics.fillRect(5 + i * 12, 5 + j * 12, 8, 8);
        }
      }
      buildingGraphics.generateTexture('building', 40, 80);
      buildingGraphics.destroy();

      // Evil Moonbase
      const moonbaseGraphics = this.add.graphics();
      moonbaseGraphics.fillStyle(0x444444, 1);
      moonbaseGraphics.fillCircle(40, 40, 40);
      moonbaseGraphics.fillStyle(0xff0000, 1);
      moonbaseGraphics.fillCircle(40, 30, 15);
      moonbaseGraphics.fillStyle(0x000000, 1);
      moonbaseGraphics.fillRect(35, 50, 10, 5);
      moonbaseGraphics.generateTexture('moonbase', 80, 80);
      moonbaseGraphics.destroy();
    }

    function createStarfield() {
      for (let i = 0; i < 150; i++) {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
        const star = this.add.circle(x, y, 1, 0xFFD700);
        star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
      }
    }

    function createWichitaCity() {
      wichitaBuildings = this.physics.add.staticGroup();

      // WICHITA text
      this.add.text(400, 520, 'WICHITA, KANSAS', {
        fontSize: '28px',
        fill: '#FFD700',
        fontStyle: 'bold',
        stroke: '#001f3f',
        strokeThickness: 5
      }).setOrigin(0.5).setDepth(100);

      // Create buildings with physics
      for (let i = 0; i < 15; i++) {
        const x = i * 60 + 20;
        const height = Phaser.Math.Between(60, 100);
        const building = wichitaBuildings.create(x, 600 - height/2, 'building');
        building.setScale(1, height / 80);
        building.refreshBody();
      }
    }

    function shootBullet() {
      if (gameOver || gameWon) return;

      const bullet = bullets.get(player.x, player.y - 20);
      if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.velocity.y = -600;
        bullet.setTint(0xFFD700);
      }
    }

    function spawnAsteroidFromMoonbase() {
      if (gameOver || gameWon) return;

      // Spawn from moonbase position
      const x = Phaser.Math.Between(350, 450);
      const asteroid = asteroids.create(x, 120, 'asteroid');
      asteroid.setVelocity(
        Phaser.Math.Between(-100, 100),
        Phaser.Math.Between(100, 250)
      );
      asteroid.setAngularVelocity(Phaser.Math.Between(-100, 100));
      asteroid.setTint(0xff4444);
    }

    function hitAsteroid(bullet, asteroid) {
      bullet.destroy();
      asteroid.destroy();
      score += 15;
      asteroidsDestroyed++;
      scoreText.setText('Score: ' + score);

      // Explosion effect (Kansas gold)
      const explosion = this.add.circle(asteroid.x, asteroid.y, 25, 0xFFD700);
      this.tweens.add({
        targets: explosion,
        scale: 2.5,
        alpha: 0,
        duration: 300,
        onComplete: () => explosion.destroy()
      });

      // Check for wave progression
      if (asteroidsDestroyed % 10 === 0 && asteroidsDestroyed > 0) {
        wave++;
        waveText.setText('Wave: ' + wave);

        // Flash wave text
        this.tweens.add({
          targets: waveText,
          scale: 1.5,
          duration: 200,
          yoyo: true,
          repeat: 2
        });
      }
    }

    function hitPlayer(player, asteroid) {
      asteroid.destroy();
      playerHealth -= 25;
      playerHealthText.setText('Ship: ' + playerHealth + '%');

      if (playerHealth <= 0) {
        playerHealthText.setColor('#f00');
      } else if (playerHealth <= 40) {
        playerHealthText.setColor('#ff0');
      }

      // Flash player
      this.tweens.add({
        targets: player,
        alpha: 0.3,
        duration: 100,
        yoyo: true,
        repeat: 2
      });

      if (playerHealth <= 0) {
        loseGame.call(this, 'SHIP DESTROYED!');
      }
    }

    function asteroidHitsCity(building, asteroid) {
      asteroid.destroy();
      cityHealth -= 10;
      cityHealthText.setText('City: ' + cityHealth + '%');

      if (cityHealth <= 0) {
        cityHealthText.setColor('#f00');
      } else if (cityHealth <= 40) {
        cityHealthText.setColor('#ff0');
      }

      // Flash building
      this.tweens.add({
        targets: building,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: 1
      });

      // Explosion on city
      const explosion = this.add.circle(building.x, building.y, 30, 0xff0000);
      this.tweens.add({
        targets: explosion,
        scale: 2,
        alpha: 0,
        duration: 400,
        onComplete: () => explosion.destroy()
      });

      if (cityHealth <= 0) {
        loseGame.call(this, 'WICHITA DESTROYED!');
      }
    }

    function winGame() {
      gameWon = true;
      this.physics.pause();

      // Victory message
      this.add.text(400, 250, 'WICHITA SAVED!\n\nMoonbase Defeated!\nScore: ' + score + '\nWaves Survived: ' + wave + '\n\nYou are a Kansas Hero!\n\nClick to Restart', {
        fontSize: '40px',
        fill: '#FFD700',
        align: 'center',
        backgroundColor: '#001f3f',
        padding: { x: 25, y: 20 },
        stroke: '#FFD700',
        strokeThickness: 4,
        fontStyle: 'bold'
      }).setOrigin(0.5);

      this.input.once('pointerdown', () => {
        this.scene.restart();
      });
    }

    function loseGame(message) {
      gameOver = true;
      player.setTint(0xff0000);
      this.physics.pause();

      this.add.text(400, 250, message + '\n\nScore: ' + score + '\nWaves: ' + wave + '\n\nClick to Retry', {
        fontSize: '48px',
        fill: '#f00',
        align: 'center',
        backgroundColor: '#001f3f',
        padding: { x: 20, y: 15 },
        stroke: '#FFD700',
        strokeThickness: 4,
        fontStyle: 'bold'
      }).setOrigin(0.5);

      this.input.once('pointerdown', () => {
        this.scene.restart();
      });
    }

    // Initialize game
    phaserGameRef.current = new Phaser.Game(config);

    // Cleanup
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950">
      {/* Header */}
      <div className="bg-blue-950/80 backdrop-blur-sm border-b border-yellow-500/30">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-yellow-400 hover:bg-yellow-400/20 border border-yellow-400/30 text-sm"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </Button>
          <h1 className="text-xl font-bold text-yellow-400">Defend Wichita</h1>
          <div className="w-28" />
        </div>
      </div>

      {/* Game Container */}
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Game Story */}
          <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 backdrop-blur-md rounded-lg p-4 mb-3 text-yellow-100 border-2 border-yellow-500/50">
            <h2 className="text-xl font-bold mb-2 text-yellow-400">Mission Briefing</h2>
            <p className="mb-2 text-base">
              <span className="text-red-400 font-bold">⚠ ALERT!</span> The rogue <span className="text-red-400 font-bold">Moonbase</span> is launching asteroids at <span className="text-yellow-300 font-bold">Wichita, Kansas</span>!
            </p>
            <p className="mb-2 text-base">
              As the city's defender, you must <span className="text-yellow-300 font-bold">shoot down the asteroids</span> before they destroy our home!
            </p>
            <div className="grid md:grid-cols-3 gap-3 text-center mt-3">
              <div>
                <p className="text-2xl mb-1">🏙️</p>
                <p className="text-xs text-yellow-400 font-bold">Protect Wichita</p>
              </div>
              <div>
                <p className="text-2xl mb-1">🔫</p>
                <p className="text-xs text-yellow-400 font-bold">Destroy Asteroids</p>
              </div>
              <div>
                <p className="text-2xl mb-1">🌙</p>
                <p className="text-xs text-yellow-400 font-bold">Defeat Moonbase</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-blue-900/50 backdrop-blur-md rounded-lg p-4 mb-3 text-yellow-100 border-2 border-yellow-500/30">
            <h2 className="text-xl font-bold mb-2 text-yellow-400">How to Play</h2>
            <div className="grid md:grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl mb-1">⬅️ ➡️ ⬆️ ⬇️</p>
                <p className="text-xs text-yellow-400 font-bold">Arrow Keys to Move</p>
              </div>
              <div>
                <p className="text-2xl mb-1">⎵</p>
                <p className="text-xs text-yellow-400 font-bold">Space to Shoot</p>
              </div>
              <div>
                <p className="text-2xl mb-1">💥</p>
                <p className="text-xs text-yellow-400 font-bold">Stop 50 Asteroids to Win!</p>
              </div>
            </div>
          </div>

          {/* Game Canvas */}
          <div className="flex justify-center">
            <div
              ref={gameRef}
              className="border-4 border-yellow-400/60 rounded-lg shadow-2xl shadow-yellow-500/30"
              style={{ width: '800px', height: '600px' }}
            />
          </div>

          {/* Game Info */}
          <div className="mt-3 text-center text-yellow-400">
            <p className="text-xs mb-1 font-bold">
              AI Prompt Championship - Wichita Regional - Challenge #2
            </p>
            <p className="text-xs text-yellow-500">
              Defend Kansas with Navy Blue Pride and Gold Determination!
            </p>
            <p className="text-xs text-blue-300 mt-1">
              Built with Phaser 3 + React + Vite • Deployed on Vercel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
