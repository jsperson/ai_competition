import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function Game() {
  const navigate = useNavigate();
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {
    if (phaserGameRef.current) return; // Game already initialized

    // Game configuration
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#1a1a2e',
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

    let player;
    let cursors;
    let bullets;
    let enemies;
    let score = 0;
    let scoreText;
    let gameOver = false;

    function create() {
      // Score text
      scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#fff'
      });

      // Create player (triangle spaceship)
      const graphics = this.add.graphics();
      graphics.fillStyle(0x00ff00, 1);
      graphics.beginPath();
      graphics.moveTo(0, -20);
      graphics.lineTo(-15, 20);
      graphics.lineTo(15, 20);
      graphics.closePath();
      graphics.fillPath();
      graphics.generateTexture('player', 30, 40);
      graphics.destroy();

      player = this.physics.add.sprite(400, 500, 'player');
      player.setCollideWorldBounds(true);

      // Create bullet texture
      const bulletGraphics = this.add.graphics();
      bulletGraphics.fillStyle(0xffff00, 1);
      bulletGraphics.fillRect(0, 0, 4, 12);
      bulletGraphics.generateTexture('bullet', 4, 12);
      bulletGraphics.destroy();

      // Create enemy texture
      const enemyGraphics = this.add.graphics();
      enemyGraphics.fillStyle(0xff0000, 1);
      enemyGraphics.fillRect(0, 0, 30, 30);
      enemyGraphics.generateTexture('enemy', 30, 30);
      enemyGraphics.destroy();

      // Bullets group
      bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 20
      });

      // Enemies group
      enemies = this.physics.add.group();

      // Spawn enemies
      this.time.addEvent({
        delay: 1000,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
      });

      // Keyboard controls
      cursors = this.input.keyboard.createCursorKeys();
      this.input.keyboard.on('keydown-SPACE', shootBullet, this);

      // Collisions
      this.physics.add.overlap(bullets, enemies, hitEnemy, null, this);
      this.physics.add.overlap(player, enemies, hitPlayer, null, this);

      // Instructions
      this.add.text(400, 300, 'Arrow Keys to Move\nSpace to Shoot', {
        fontSize: '24px',
        fill: '#fff',
        align: 'center'
      }).setOrigin(0.5).setAlpha(0.7);
    }

    function update() {
      if (gameOver) return;

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

      // Remove off-screen bullets
      bullets.children.each(bullet => {
        if (bullet.y < 0) {
          bullet.destroy();
        }
      });

      // Remove off-screen enemies
      enemies.children.each(enemy => {
        if (enemy.y > 600) {
          enemy.destroy();
        }
      });
    }

    function shootBullet() {
      if (gameOver) return;

      const bullet = bullets.get(player.x, player.y - 20);
      if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.velocity.y = -400;
      }
    }

    function spawnEnemy() {
      if (gameOver) return;

      const x = Phaser.Math.Between(50, 750);
      const enemy = enemies.create(x, 0, 'enemy');
      enemy.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(100, 200));
    }

    function hitEnemy(bullet, enemy) {
      bullet.destroy();
      enemy.destroy();
      score += 10;
      scoreText.setText('Score: ' + score);
    }

    function hitPlayer(player, enemy) {
      gameOver = true;
      player.setTint(0xff0000);

      this.add.text(400, 300, 'GAME OVER\nScore: ' + score + '\nRefresh to Play Again', {
        fontSize: '48px',
        fill: '#fff',
        align: 'center',
        backgroundColor: '#000',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5);

      this.physics.pause();
    }

    // Initialize Phaser game
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-white">Space Shooter Demo</h1>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Game Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Game Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 text-white">
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
                <p className="text-3xl mb-2">🎯</p>
                <p className="text-sm">Destroy Enemies</p>
              </div>
            </div>
          </div>

          {/* Game Canvas */}
          <div className="flex justify-center">
            <div
              ref={gameRef}
              className="border-4 border-white/20 rounded-lg shadow-2xl"
              style={{ width: '800px', height: '600px' }}
            />
          </div>

          {/* Game Info */}
          <div className="mt-6 text-center text-white/80">
            <p className="text-sm">
              Built with Phaser 3 + React + Vite • Deployed on Vercel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
