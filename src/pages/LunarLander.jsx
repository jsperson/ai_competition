import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function LunarLander() {
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
          gravity: { y: 100 }, // Moon gravity (lower than Earth)
          debug: false
        }
      },
      scene: {
        create: create,
        update: update
      }
    };

    // ========== GAME VARIABLES ==========
    let lander;
    let cursors;
    let fuel = 100;
    let fuelText;
    let velocityText;
    let scoreText;
    let altitudeText;
    let gameOver = false;
    let gameWon = false;
    let score = 0;
    let landingPad;
    let thrustParticles;
    let fuelWarning = false;

    // ========== CREATE ==========
    function create() {
      // Create textures
      createTextures.call(this);

      // Stars background
      createStarfield.call(this);

      // Moon surface at top
      createMoonSurface.call(this);

      // Wichita skyline at bottom
      createWichitaSkyline.call(this);

      // Landing pad (small and precise)
      const padX = 400;
      const padY = 520;
      const padWidth = 60;

      landingPad = this.add.rectangle(padX, padY, padWidth, 10, 0xFFD700);
      this.physics.add.existing(landingPad, true);

      // Landing pad markers
      this.add.text(padX, padY + 15, '🎯 LANDING ZONE', {
        fontSize: '10px',
        fill: '#FFD700',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      // Lander starting position (on moon)
      lander = this.physics.add.sprite(400, 60, 'lander');
      lander.setTint(0xFFD700); // Kansas Gold
      lander.setScale(1.2);
      lander.setCollideWorldBounds(true);
      lander.setDamping(true);
      lander.setDrag(0.05); // Light drag for realistic space physics

      // Lander collision
      this.physics.add.overlap(lander, landingPad, checkLanding, null, this);

      // Thrust particles
      thrustParticles = this.add.particles(0, 0, 'particle', {
        speed: { min: 50, max: 100 },
        angle: { min: 70, max: 110 },
        scale: { start: 0.8, end: 0 },
        tint: 0xFFD700,
        lifespan: 300,
        gravityY: -50,
        emitting: false
      });

      // Controls
      cursors = this.input.keyboard.createCursorKeys();

      // UI Text
      fuelText = this.add.text(16, 16, 'Fuel: 100%', {
        fontSize: '20px',
        fill: '#FFD700',
        stroke: '#001f3f',
        strokeThickness: 3,
        fontStyle: 'bold'
      });

      velocityText = this.add.text(16, 45, 'Speed: 0', {
        fontSize: '18px',
        fill: '#FFD700',
        stroke: '#001f3f',
        strokeThickness: 2,
        fontStyle: 'bold'
      });

      altitudeText = this.add.text(16, 70, 'Alt: 460m', {
        fontSize: '18px',
        fill: '#FFD700',
        stroke: '#001f3f',
        strokeThickness: 2,
        fontStyle: 'bold'
      });

      scoreText = this.add.text(400, 16, 'Launch from Moon - Land in Wichita!', {
        fontSize: '18px',
        fill: '#FFD700',
        stroke: '#001f3f',
        strokeThickness: 3,
        fontStyle: 'bold'
      }).setOrigin(0.5, 0);

      // Instructions
      const instructions = this.add.text(400, 300, 'Arrow Keys: Thrust\n\nLand softly on the gold pad!\n\nSpeed < 50 to survive', {
        fontSize: '20px',
        fill: '#FFD700',
        align: 'center',
        stroke: '#001f3f',
        strokeThickness: 3,
        fontStyle: 'bold'
      }).setOrigin(0.5);

      // Fade out instructions
      this.time.delayedCall(3000, () => {
        this.tweens.add({
          targets: instructions,
          alpha: 0,
          duration: 1000,
          onComplete: () => instructions.destroy()
        });
      });
    }

    // ========== TEXTURE CREATION ==========
    function createTextures() {
      // Lander (triangle shape)
      const landerGraphics = this.add.graphics();
      landerGraphics.fillStyle(0xFFFFFF, 1);
      landerGraphics.beginPath();
      landerGraphics.moveTo(20, 5);
      landerGraphics.lineTo(5, 35);
      landerGraphics.lineTo(35, 35);
      landerGraphics.closePath();
      landerGraphics.fillPath();
      // Landing legs
      landerGraphics.lineStyle(3, 0xFFFFFF);
      landerGraphics.lineTo(0, 40);
      landerGraphics.moveTo(35, 35);
      landerGraphics.lineTo(40, 40);
      landerGraphics.generateTexture('lander', 40, 40);
      landerGraphics.destroy();

      // Particle for thrust
      const particleGraphics = this.add.graphics();
      particleGraphics.fillStyle(0xFFFFFF, 1);
      particleGraphics.fillCircle(4, 4, 4);
      particleGraphics.generateTexture('particle', 8, 8);
      particleGraphics.destroy();
    }

    function createStarfield() {
      for (let i = 0; i < 150; i++) {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
        const star = this.add.circle(x, y, 1, 0xFFFFFF, 0.8);

        this.tweens.add({
          targets: star,
          alpha: 0.2,
          duration: Phaser.Math.Between(1000, 3000),
          yoyo: true,
          repeat: -1
        });
      }
    }

    function createMoonSurface() {
      // Moon surface at top
      const moonGraphics = this.add.graphics();
      moonGraphics.fillStyle(0x888888, 1);
      moonGraphics.fillRect(0, 0, 800, 30);

      // Moon craters
      moonGraphics.fillStyle(0x666666, 1);
      for (let i = 0; i < 10; i++) {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(5, 25);
        moonGraphics.fillCircle(x, y, Phaser.Math.Between(3, 8));
      }

      // "MOON" label
      this.add.text(400, 15, '🌙 LUNAR SURFACE', {
        fontSize: '14px',
        fill: '#FFD700',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    }

    function createWichitaSkyline() {
      const skylineGraphics = this.add.graphics();

      // Ground
      skylineGraphics.fillStyle(0x2c5f2d, 1); // Kansas green
      skylineGraphics.fillRect(0, 530, 800, 70);

      // Century 2 Performing Arts Center (distinctive pyramid shape)
      skylineGraphics.fillStyle(0x4a4a4a, 1);
      skylineGraphics.beginPath();
      skylineGraphics.moveTo(150, 530);
      skylineGraphics.lineTo(200, 430);
      skylineGraphics.lineTo(250, 530);
      skylineGraphics.closePath();
      skylineGraphics.fillPath();

      // Century 2 windows
      skylineGraphics.fillStyle(0xFFD700, 0.8);
      for (let y = 480; y < 530; y += 20) {
        for (let x = 170; x < 230; x += 15) {
          skylineGraphics.fillRect(x, y, 8, 12);
        }
      }

      // Epic Center (large rectangular arena)
      skylineGraphics.fillStyle(0x3a3a3a, 1);
      skylineGraphics.fillRect(520, 450, 120, 80);
      skylineGraphics.fillStyle(0x5a5a5a, 1);
      skylineGraphics.fillRect(520, 440, 120, 10); // Roof

      // Epic Center windows
      skylineGraphics.fillStyle(0xFFD700, 0.9);
      for (let y = 460; y < 520; y += 15) {
        for (let x = 530; x < 630; x += 20) {
          skylineGraphics.fillRect(x, y, 12, 10);
        }
      }

      // Other buildings
      const buildings = [
        { x: 50, y: 480, width: 60, height: 50 },
        { x: 280, y: 470, width: 50, height: 60 },
        { x: 340, y: 490, width: 45, height: 40 },
        { x: 450, y: 485, width: 55, height: 45 },
        { x: 660, y: 475, width: 50, height: 55 },
        { x: 720, y: 495, width: 40, height: 35 }
      ];

      buildings.forEach(building => {
        skylineGraphics.fillStyle(0x4a4a4a, 1);
        skylineGraphics.fillRect(building.x, building.y, building.width, building.height);

        // Windows
        skylineGraphics.fillStyle(0xFFD700, 0.7);
        for (let y = building.y + 5; y < building.y + building.height - 5; y += 12) {
          for (let x = building.x + 5; x < building.x + building.width - 5; x += 12) {
            skylineGraphics.fillRect(x, y, 6, 8);
          }
        }
      });

      // Wichita label
      this.add.text(400, 545, '🏙️ WICHITA, KANSAS', {
        fontSize: '14px',
        fill: '#FFD700',
        fontStyle: 'bold',
        stroke: '#001f3f',
        strokeThickness: 3
      }).setOrigin(0.5);
    }

    // ========== UPDATE ==========
    function update() {
      if (gameOver || gameWon) return;

      // Thrust controls
      let thrusting = false;

      if (cursors.up.isDown && fuel > 0) {
        lander.setVelocityY(lander.body.velocity.y - 5);
        fuel -= 0.3;
        thrusting = true;
      }

      if (cursors.left.isDown && fuel > 0) {
        lander.setVelocityX(lander.body.velocity.x - 4);
        fuel -= 0.15;
        thrusting = true;
      }

      if (cursors.right.isDown && fuel > 0) {
        lander.setVelocityX(lander.body.velocity.x + 4);
        fuel -= 0.15;
        thrusting = true;
      }

      if (cursors.down.isDown && fuel > 0) {
        lander.setVelocityY(lander.body.velocity.y + 3);
        fuel -= 0.15;
        thrusting = true;
      }

      // Thrust particles
      if (thrusting && fuel > 0) {
        thrustParticles.emitParticleAt(lander.x, lander.y + 15);
      }

      // Fuel warnings
      fuel = Math.max(0, fuel);
      fuelText.setText('Fuel: ' + Math.round(fuel) + '%');

      if (fuel < 20 && fuel > 0 && !fuelWarning) {
        fuelWarning = true;
        fuelText.setColor('#ff0000');
        this.tweens.add({
          targets: fuelText,
          scale: 1.2,
          duration: 300,
          yoyo: true,
          repeat: -1
        });
      }

      // Velocity and altitude display
      const speed = Math.sqrt(
        lander.body.velocity.x ** 2 + lander.body.velocity.y ** 2
      );
      velocityText.setText('Speed: ' + Math.round(speed));

      if (speed > 50) {
        velocityText.setColor('#ff0000');
      } else if (speed > 30) {
        velocityText.setColor('#ffff00');
      } else {
        velocityText.setColor('#FFD700');
      }

      const altitude = Math.max(0, 520 - lander.y);
      altitudeText.setText('Alt: ' + Math.round(altitude) + 'm');

      // Rotate lander based on horizontal velocity
      lander.rotation = lander.body.velocity.x * 0.01;

      // Check if crashed (hit ground outside landing pad)
      if (lander.y > 515 && !Phaser.Geom.Intersects.RectangleToRectangle(
        lander.getBounds(),
        landingPad.getBounds()
      )) {
        crashLander.call(this);
      }
    }

    function checkLanding(lander, pad) {
      if (gameOver || gameWon) return;

      const speed = Math.sqrt(
        lander.body.velocity.x ** 2 + lander.body.velocity.y ** 2
      );

      // Successful landing criteria
      if (speed < 50 && Math.abs(lander.rotation) < 0.3) {
        gameWon = true;
        lander.setVelocity(0, 0);
        this.physics.pause();

        // Score calculation (fuel efficiency bonus)
        score = Math.round(1000 + (fuel * 50));

        // Success message
        this.add.text(400, 250, '🎉 PERFECT LANDING! 🎉\n\nWelcome to Wichita!\n\nScore: ' + score + '\nFuel Remaining: ' + Math.round(fuel) + '%\n\nClick to Restart', {
          fontSize: '32px',
          fill: '#FFD700',
          align: 'center',
          backgroundColor: '#001f3f',
          padding: { x: 20, y: 15 },
          stroke: '#FFD700',
          strokeThickness: 4,
          fontStyle: 'bold'
        }).setOrigin(0.5);

        // Celebration particles
        const celebration = this.add.particles(400, 520, 'particle', {
          speed: { min: 100, max: 200 },
          angle: { min: 260, max: 280 },
          scale: { start: 1, end: 0 },
          tint: [0xFFD700, 0xFFFFFF],
          lifespan: 1000,
          gravityY: 200
        });

        this.time.delayedCall(2000, () => celebration.stop());

        this.input.once('pointerdown', () => {
          this.scene.restart();
        });
      } else if (speed >= 50) {
        crashLander.call(this, 'TOO FAST! Speed: ' + Math.round(speed));
      } else if (Math.abs(lander.rotation) >= 0.3) {
        crashLander.call(this, 'BAD ANGLE!');
      }
    }

    function crashLander(message = 'CRASHED!') {
      if (gameOver) return;

      gameOver = true;
      this.physics.pause();

      // Explosion
      lander.setTint(0xff0000);
      const explosion = this.add.particles(lander.x, lander.y, 'particle', {
        speed: { min: 50, max: 150 },
        scale: { start: 1.5, end: 0 },
        tint: [0xff0000, 0xff6600, 0xFFD700],
        lifespan: 800,
        gravityY: 100
      });

      this.time.delayedCall(1000, () => explosion.stop());

      // Crash message
      this.add.text(400, 250, message + '\n\nMission Failed!\n\nClick to Retry', {
        fontSize: '40px',
        fill: '#ff0000',
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
          <h1 className="text-xl font-bold text-yellow-400">Moon to Wichita Lander</h1>
          <div className="w-28" />
        </div>
      </div>

      {/* Game Container */}
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Mission Briefing */}
          <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 backdrop-blur-md rounded-lg p-4 mb-3 text-yellow-100 border-2 border-yellow-500/50">
            <h2 className="text-xl font-bold mb-2 text-yellow-400">Mission: Return to Kansas</h2>
            <p className="mb-2 text-base">
              Launch from the <span className="text-gray-300 font-bold">🌙 Lunar Surface</span> and navigate your lander safely to <span className="text-yellow-300 font-bold">Wichita, Kansas</span>!
            </p>
            <p className="text-base">
              Land precisely on the <span className="text-yellow-300 font-bold">gold landing pad</span> with speed under 50 and minimal tilt. Conserve fuel for bonus points!
            </p>
            <div className="grid md:grid-cols-3 gap-3 text-center mt-3">
              <div>
                <p className="text-2xl mb-1">🚀</p>
                <p className="text-xs text-yellow-400 font-bold">Soft Landing Required</p>
              </div>
              <div>
                <p className="text-2xl mb-1">⛽</p>
                <p className="text-xs text-yellow-400 font-bold">Limited Fuel</p>
              </div>
              <div>
                <p className="text-2xl mb-1">🎯</p>
                <p className="text-xs text-yellow-400 font-bold">Precision Matters</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-blue-900/50 backdrop-blur-md rounded-lg p-4 mb-3 text-yellow-100 border-2 border-yellow-500/30">
            <h2 className="text-xl font-bold mb-2 text-yellow-400">Flight Controls</h2>
            <div className="grid md:grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-2xl mb-1">⬆️</p>
                <p className="text-xs text-yellow-400 font-bold">Main Thrust</p>
              </div>
              <div>
                <p className="text-2xl mb-1">⬅️ ➡️</p>
                <p className="text-xs text-yellow-400 font-bold">Lateral Thrust</p>
              </div>
              <div>
                <p className="text-2xl mb-1">⬇️</p>
                <p className="text-xs text-yellow-400 font-bold">Descent Boost</p>
              </div>
              <div>
                <p className="text-2xl mb-1">🎯</p>
                <p className="text-xs text-yellow-400 font-bold">Land on Gold Pad</p>
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

          {/* Landmarks Info */}
          <div className="mt-3 text-center text-yellow-400">
            <p className="text-xs mb-1 font-bold">
              🏛️ Century 2 Performing Arts Center • 🏟️ INTRUST Bank Arena (Epic Center)
            </p>
            <p className="text-xs text-yellow-500">
              Navigate from the Moon to the Heart of Kansas!
            </p>
            <p className="text-xs text-blue-300 mt-1">
              AI Prompt Championship - Wichita Regional • Built with Phaser 3 + React
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
