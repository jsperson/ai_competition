// GAME TEMPLATE - Copy this file to create new games
// Replace "GameTemplate" with your game name
// Update the game logic in create() and update()

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function GameTemplate() {
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
      backgroundColor: '#2c3e50',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 }, // Change gravity as needed
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    // ========== GAME VARIABLES ==========
    let player;
    let cursors;
    let score = 0;
    let scoreText;
    let gameOver = false;

    // ========== PRELOAD ==========
    function preload() {
      // Load assets here
      // this.load.image('key', 'path/to/image.png');
    }

    // ========== CREATE ==========
    function create() {
      // Create textures (replace with your own)
      createPlayerTexture.call(this);

      // Score display
      scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#fff'
      });

      // Create player
      player = this.physics.add.sprite(400, 300, 'player');
      player.setCollideWorldBounds(true);

      // Keyboard controls
      cursors = this.input.keyboard.createCursorKeys();

      // Add your game objects here
      // Example: platforms, enemies, collectibles, etc.

      // Add collisions
      // this.physics.add.collider(player, platforms);
    }

    // ========== UPDATE ==========
    function update() {
      if (gameOver) return;

      // Player movement
      handlePlayerMovement();

      // Add your game logic here
      // Example: enemy AI, collision checks, scoring, etc.
    }

    // ========== HELPER FUNCTIONS ==========
    function createPlayerTexture() {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x00ff00, 1);
      graphics.fillRect(0, 0, 32, 32);
      graphics.generateTexture('player', 32, 32);
      graphics.destroy();
    }

    function handlePlayerMovement() {
      // Basic movement (customize as needed)
      if (cursors.left.isDown) {
        player.setVelocityX(-200);
      } else if (cursors.right.isDown) {
        player.setVelocityX(200);
      } else {
        player.setVelocityX(0);
      }

      // Jump (if using gravity)
      if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
      }
    }

    function updateScore(points) {
      score += points;
      scoreText.setText('Score: ' + score);
    }

    function endGame() {
      gameOver = true;
      this.physics.pause();

      this.add.text(400, 300, 'GAME OVER\nScore: ' + score + '\nRefresh to Play Again', {
        fontSize: '48px',
        fill: '#fff',
        align: 'center',
        backgroundColor: '#000',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5);
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
          <h1 className="text-2xl font-bold text-white">Your Game Title</h1>
          <div className="w-32" />
        </div>
      </div>

      {/* Game Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Instructions */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 text-white">
            <h2 className="text-2xl font-bold mb-3">How to Play</h2>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl mb-2">⬅️ ➡️</p>
                <p className="text-sm">Move Left/Right</p>
              </div>
              <div>
                <p className="text-3xl mb-2">⬆️</p>
                <p className="text-sm">Jump / Action</p>
              </div>
              <div>
                <p className="text-3xl mb-2">🎯</p>
                <p className="text-sm">Your Objective</p>
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

          {/* Footer Info */}
          <div className="mt-6 text-center text-white/80">
            <p className="text-sm">
              Built with Phaser 3 + React + Vite
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
