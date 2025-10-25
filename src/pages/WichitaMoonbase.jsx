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
      backgroundColor: '#000428',
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

    // Game phases
    let gamePhase = 'launch'; // launch, travel, defend, won
    let phaseText;
    let moonbase;
    let wichitaBuildings;
    let distance = 0;
    let distanceText;
    let asteroidsDestroyed = 0;
    let health = 100;
    let healthText;

    // ========== CREATE ==========
    function create() {
      // Create textures
      createTextures.call(this);

      // Background stars
      createStarfield.call(this);

      // UI Elements
      scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '24px',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 3
      });

      distanceText = this.add.text(16, 50, 'Distance: 0 km', {
        fontSize: '20px',
        fill: '#0ff',
        stroke: '#000',
        strokeThickness: 3
      });

      healthText = this.add.text(16, 80, 'Hull: 100%', {
        fontSize: '20px',
        fill: '#0f0',
        stroke: '#000',
        strokeThickness: 3
      });

      phaseText = this.add.text(400, 300, 'LAUNCHING FROM WICHITA', {
        fontSize: '36px',
        fill: '#ff0',
        stroke: '#000',
        strokeThickness: 4,
        align: 'center'
      }).setOrigin(0.5).setDepth(100);

      // Create Wichita cityscape at bottom
      createWichitaCity.call(this);

      // Create player ship
      player = this.physics.add.sprite(400, 500, 'player');
      player.setCollideWorldBounds(true);
      player.setDepth(50);

      // Bullets group
      bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 30
      });

      // Asteroids group
      asteroids = this.physics.add.group();

      // Keyboard controls
      cursors = this.input.keyboard.createCursorKeys();
      this.input.keyboard.on('keydown-SPACE', shootBullet, this);

      // Collisions
      this.physics.add.overlap(bullets, asteroids, hitAsteroid, null, this);
      this.physics.add.overlap(player, asteroids, hitPlayer, null, this);

      // Phase timer - launch phase lasts 3 seconds
      this.time.delayedCall(3000, () => {
        startTravelPhase.call(this);
      });

      // Instructions (fade out after 5 seconds)
      const instructions = this.add.text(400, 500, 'Arrow Keys: Move | Space: Shoot', {
        fontSize: '18px',
        fill: '#fff',
        backgroundColor: '#000',
        padding: { x: 10, y: 5 }
      }).setOrigin(0.5).setAlpha(0.8);

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
        player.setVelocityX(-300);
      } else if (cursors.right.isDown) {
        player.setVelocityX(300);
      } else {
        player.setVelocityX(0);
      }

      if (cursors.up.isDown) {
        player.setVelocityY(-300);
      } else if (cursors.down.isDown) {
        player.setVelocityY(300);
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

      // Update distance in travel phase
      if (gamePhase === 'travel') {
        distance += 0.5;
        distanceText.setText('Distance: ' + Math.floor(distance) + ' km');

        // Reach moonbase at 1000km
        if (distance >= 1000) {
          startDefendPhase.call(this);
        }
      }
    }

    // ========== HELPER FUNCTIONS ==========
    function createTextures() {
      // Player ship (triangle pointing up)
      const graphics = this.add.graphics();
      graphics.fillStyle(0x00ff00, 1);
      graphics.beginPath();
      graphics.moveTo(15, 0);
      graphics.lineTo(0, 30);
      graphics.lineTo(30, 30);
      graphics.closePath();
      graphics.fillPath();
      // Add exhaust
      graphics.fillStyle(0xff6600, 1);
      graphics.fillRect(12, 30, 6, 8);
      graphics.generateTexture('player', 30, 38);
      graphics.destroy();

      // Bullet
      const bulletGraphics = this.add.graphics();
      bulletGraphics.fillStyle(0xffff00, 1);
      bulletGraphics.fillRect(0, 0, 4, 12);
      bulletGraphics.generateTexture('bullet', 4, 12);
      bulletGraphics.destroy();

      // Asteroid
      const asteroidGraphics = this.add.graphics();
      asteroidGraphics.fillStyle(0x8b4513, 1);
      asteroidGraphics.fillCircle(20, 20, 20);
      asteroidGraphics.fillStyle(0x654321, 1);
      asteroidGraphics.fillCircle(12, 15, 8);
      asteroidGraphics.fillCircle(25, 22, 6);
      asteroidGraphics.generateTexture('asteroid', 40, 40);
      asteroidGraphics.destroy();

      // Wichita building
      const buildingGraphics = this.add.graphics();
      buildingGraphics.fillStyle(0x555555, 1);
      buildingGraphics.fillRect(0, 0, 40, 80);
      buildingGraphics.fillStyle(0xffff00, 0.8);
      // Windows
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 6; j++) {
          buildingGraphics.fillRect(5 + i * 12, 5 + j * 12, 8, 8);
        }
      }
      buildingGraphics.generateTexture('building', 40, 80);
      buildingGraphics.destroy();

      // Moonbase
      const moonbaseGraphics = this.add.graphics();
      moonbaseGraphics.fillStyle(0xcccccc, 1);
      moonbaseGraphics.fillCircle(40, 40, 40);
      moonbaseGraphics.fillStyle(0x0088ff, 1);
      moonbaseGraphics.fillCircle(40, 30, 15);
      moonbaseGraphics.fillStyle(0xff0000, 1);
      moonbaseGraphics.fillRect(35, 50, 10, 5);
      moonbaseGraphics.generateTexture('moonbase', 80, 80);
      moonbaseGraphics.destroy();
    }

    function createStarfield() {
      for (let i = 0; i < 100; i++) {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
        const star = this.add.circle(x, y, 1, 0xffffff);
        star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
      }
    }

    function createWichitaCity() {
      wichitaBuildings = this.add.group();

      // Create city text
      this.add.text(400, 520, 'WICHITA, KANSAS', {
        fontSize: '24px',
        fill: '#fff',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 4
      }).setOrigin(0.5);

      // Create buildings
      for (let i = 0; i < 15; i++) {
        const x = i * 60 + 20;
        const height = Phaser.Math.Between(60, 100);
        const building = this.add.sprite(x, 600 - height/2, 'building');
        building.setScale(1, height / 80);
        wichitaBuildings.add(building);
      }
    }

    function shootBullet() {
      if (gameOver || gameWon) return;

      const bullet = bullets.get(player.x, player.y - 20);
      if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.velocity.y = -500;
      }
    }

    function spawnAsteroid() {
      if (gameOver || gameWon) return;

      const x = Phaser.Math.Between(50, 750);
      const asteroid = asteroids.create(x, -40, 'asteroid');
      asteroid.setVelocity(
        Phaser.Math.Between(-50, 50),
        Phaser.Math.Between(150, 300)
      );
      asteroid.setAngularVelocity(Phaser.Math.Between(-100, 100));
    }

    function startTravelPhase() {
      gamePhase = 'travel';
      phaseText.setText('TRAVELING TO MOONBASE');

      // Fade out Wichita buildings
      this.tweens.add({
        targets: wichitaBuildings.getChildren(),
        y: '+=100',
        alpha: 0,
        duration: 2000
      });

      // Start spawning asteroids
      this.time.addEvent({
        delay: 1000,
        callback: spawnAsteroid,
        callbackScope: this,
        loop: true
      });

      // Fade out phase text
      this.time.delayedCall(2000, () => {
        this.tweens.add({
          targets: phaseText,
          alpha: 0,
          duration: 1000
        });
      });
    }

    function startDefendPhase() {
      gamePhase = 'defend';
      phaseText.setText('DEFEND THE MOONBASE!');
      phaseText.setAlpha(1);

      // Create moonbase at top
      moonbase = this.add.sprite(400, 80, 'moonbase');
      moonbase.setScale(1.5);

      // Increase asteroid spawn rate
      this.time.addEvent({
        delay: 500,
        callback: spawnAsteroid,
        callbackScope: this,
        loop: true,
        repeat: 19 // 20 asteroids total
      });

      // Win condition: survive 20 asteroids
      this.time.delayedCall(15000, () => {
        if (!gameOver) {
          winGame.call(this);
        }
      });

      this.time.delayedCall(2000, () => {
        this.tweens.add({
          targets: phaseText,
          alpha: 0,
          duration: 1000
        });
      });
    }

    function hitAsteroid(bullet, asteroid) {
      bullet.destroy();
      asteroid.destroy();
      score += 10;
      asteroidsDestroyed++;
      scoreText.setText('Score: ' + score);

      // Explosion effect
      const explosion = this.add.circle(asteroid.x, asteroid.y, 20, 0xff6600);
      this.tweens.add({
        targets: explosion,
        scale: 2,
        alpha: 0,
        duration: 300,
        onComplete: () => explosion.destroy()
      });
    }

    function hitPlayer(player, asteroid) {
      asteroid.destroy();
      health -= 20;
      healthText.setText('Hull: ' + health + '%');

      if (health <= 0) {
        healthText.setColor('#f00');
      } else if (health <= 40) {
        healthText.setColor('#ff0');
      }

      // Flash player
      this.tweens.add({
        targets: player,
        alpha: 0.3,
        duration: 100,
        yoyo: true,
        repeat: 2
      });

      if (health <= 0) {
        loseGame.call(this);
      }
    }

    function winGame() {
      gameWon = true;
      this.physics.pause();

      this.add.text(400, 300, 'MISSION SUCCESS!\n\nMoonbase Defended!\nScore: ' + score + '\nAsteroids Destroyed: ' + asteroidsDestroyed + '\n\nClick to Restart', {
        fontSize: '42px',
        fill: '#0f0',
        align: 'center',
        backgroundColor: '#000',
        padding: { x: 20, y: 15 },
        stroke: '#0f0',
        strokeThickness: 3
      }).setOrigin(0.5);

      this.input.once('pointerdown', () => {
        this.scene.restart();
      });
    }

    function loseGame() {
      gameOver = true;
      player.setTint(0xff0000);
      this.physics.pause();

      this.add.text(400, 300, 'MISSION FAILED\n\nShip Destroyed\nScore: ' + score + '\n\nClick to Retry', {
        fontSize: '48px',
        fill: '#f00',
        align: 'center',
        backgroundColor: '#000',
        padding: { x: 20, y: 15 },
        stroke: '#f00',
        strokeThickness: 4
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-white">Wichita to the Moon</h1>
          <div className="w-32" />
        </div>
      </div>

      {/* Game Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Game Story */}
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-md rounded-lg p-6 mb-6 text-white border border-white/20">
            <h2 className="text-2xl font-bold mb-3">Mission Briefing</h2>
            <p className="mb-3 text-lg">
              Launch from <span className="text-yellow-300 font-bold">Wichita, Kansas</span> and travel through space to defend our <span className="text-blue-300 font-bold">Moonbase</span> from incoming asteroids!
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center mt-4">
              <div>
                <p className="text-3xl mb-2">🚀</p>
                <p className="text-sm">Launch from Wichita</p>
              </div>
              <div>
                <p className="text-3xl mb-2">🌌</p>
                <p className="text-sm">Travel 1000km</p>
              </div>
              <div>
                <p className="text-3xl mb-2">🌙</p>
                <p className="text-sm">Defend Moonbase</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 text-white border border-white/20">
            <h2 className="text-2xl font-bold mb-3">How to Play</h2>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl mb-2">⬅️ ➡️ ⬆️ ⬇️</p>
                <p className="text-sm">Arrow Keys to Move</p>
              </div>
              <div>
                <p className="text-3xl mb-2">⎵</p>
                <p className="text-sm">Space to Shoot</p>
              </div>
              <div>
                <p className="text-3xl mb-2">💥</p>
                <p className="text-sm">Destroy Asteroids</p>
              </div>
            </div>
          </div>

          {/* Game Canvas */}
          <div className="flex justify-center">
            <div
              ref={gameRef}
              className="border-4 border-yellow-400/50 rounded-lg shadow-2xl shadow-purple-500/50"
              style={{ width: '800px', height: '600px' }}
            />
          </div>

          {/* Game Info */}
          <div className="mt-6 text-center text-white/80">
            <p className="text-sm mb-2">
              AI Prompt Championship - Wichita Regional - Challenge #2
            </p>
            <p className="text-xs">
              Built with Phaser 3 + React + Vite • Deployed on Vercel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
