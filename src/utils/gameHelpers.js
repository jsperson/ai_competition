// Phaser Game Development Utilities
// Quick helpers for common game mechanics

/**
 * Creates a simple player sprite with physics
 * @param {Phaser.Scene} scene - The current scene
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {string} key - Texture key
 * @returns {Phaser.Physics.Arcade.Sprite}
 */
export function createPlayer(scene, x, y, key) {
  const player = scene.physics.add.sprite(x, y, key);
  player.setCollideWorldBounds(true);
  return player;
}

/**
 * Creates a simple texture from graphics
 * @param {Phaser.Scene} scene - The current scene
 * @param {string} name - Texture name
 * @param {number} color - Hex color
 * @param {number} width - Width
 * @param {number} height - Height
 */
export function createSimpleTexture(scene, name, color, width, height) {
  const graphics = scene.add.graphics();
  graphics.fillStyle(color, 1);
  graphics.fillRect(0, 0, width, height);
  graphics.generateTexture(name, width, height);
  graphics.destroy();
}

/**
 * Creates a circular texture
 * @param {Phaser.Scene} scene - The current scene
 * @param {string} name - Texture name
 * @param {number} color - Hex color
 * @param {number} radius - Circle radius
 */
export function createCircleTexture(scene, name, color, radius) {
  const graphics = scene.add.graphics();
  graphics.fillStyle(color, 1);
  graphics.fillCircle(radius, radius, radius);
  graphics.generateTexture(name, radius * 2, radius * 2);
  graphics.destroy();
}

/**
 * Creates a triangle texture (useful for spaceships)
 * @param {Phaser.Scene} scene - The current scene
 * @param {string} name - Texture name
 * @param {number} color - Hex color
 * @param {number} width - Width
 * @param {number} height - Height
 */
export function createTriangleTexture(scene, name, color, width, height) {
  const graphics = scene.add.graphics();
  graphics.fillStyle(color, 1);
  graphics.beginPath();
  graphics.moveTo(width / 2, 0);
  graphics.lineTo(0, height);
  graphics.lineTo(width, height);
  graphics.closePath();
  graphics.fillPath();
  graphics.generateTexture(name, width, height);
  graphics.destroy();
}

/**
 * Setup keyboard controls
 * @param {Phaser.Scene} scene - The current scene
 * @returns {Object} Cursor keys object
 */
export function setupKeyboardControls(scene) {
  return scene.input.keyboard.createCursorKeys();
}

/**
 * Move sprite with velocity based on keyboard input
 * @param {Phaser.Physics.Arcade.Sprite} sprite - The sprite to move
 * @param {Object} cursors - Keyboard cursors
 * @param {number} speed - Movement speed
 */
export function moveWithArrowKeys(sprite, cursors, speed = 300) {
  if (cursors.left.isDown) {
    sprite.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    sprite.setVelocityX(speed);
  } else {
    sprite.setVelocityX(0);
  }

  if (cursors.up.isDown) {
    sprite.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    sprite.setVelocityY(speed);
  } else {
    sprite.setVelocityY(0);
  }
}

/**
 * Platform-style movement (left/right + jump)
 * @param {Phaser.Physics.Arcade.Sprite} sprite - The sprite to move
 * @param {Object} cursors - Keyboard cursors
 * @param {number} speed - Movement speed
 * @param {number} jumpPower - Jump velocity
 */
export function platformMovement(sprite, cursors, speed = 200, jumpPower = -400) {
  if (cursors.left.isDown) {
    sprite.setVelocityX(-speed);
    sprite.flipX = true;
  } else if (cursors.right.isDown) {
    sprite.setVelocityX(speed);
    sprite.flipX = false;
  } else {
    sprite.setVelocityX(0);
  }

  if (cursors.up.isDown && sprite.body.touching.down) {
    sprite.setVelocityY(jumpPower);
  }
}

/**
 * Creates a group of enemies
 * @param {Phaser.Scene} scene - The current scene
 * @param {string} key - Texture key
 * @param {number} count - Number of enemies
 * @returns {Phaser.Physics.Arcade.Group}
 */
export function createEnemyGroup(scene, key, count = 10) {
  return scene.physics.add.group({
    defaultKey: key,
    maxSize: count
  });
}

/**
 * Creates a bullet/projectile group
 * @param {Phaser.Scene} scene - The current scene
 * @param {string} key - Texture key
 * @param {number} maxBullets - Maximum bullets
 * @returns {Phaser.Physics.Arcade.Group}
 */
export function createBulletGroup(scene, key, maxBullets = 20) {
  return scene.physics.add.group({
    defaultKey: key,
    maxSize: maxBullets
  });
}

/**
 * Shoot a bullet from a sprite
 * @param {Phaser.Physics.Arcade.Group} bulletGroup - Bullet group
 * @param {Phaser.Physics.Arcade.Sprite} shooter - Sprite shooting
 * @param {number} offsetX - X offset from shooter
 * @param {number} offsetY - Y offset from shooter
 * @param {number} velocityX - Bullet X velocity
 * @param {number} velocityY - Bullet Y velocity
 */
export function shootBullet(bulletGroup, shooter, offsetX = 0, offsetY = -20, velocityX = 0, velocityY = -400) {
  const bullet = bulletGroup.get(shooter.x + offsetX, shooter.y + offsetY);
  if (bullet) {
    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.body.velocity.x = velocityX;
    bullet.body.velocity.y = velocityY;
  }
  return bullet;
}

/**
 * Creates a timer event for spawning
 * @param {Phaser.Scene} scene - The current scene
 * @param {number} delay - Delay in milliseconds
 * @param {Function} callback - Callback function
 * @param {boolean} loop - Whether to loop
 * @returns {Phaser.Time.TimerEvent}
 */
export function createSpawnTimer(scene, delay, callback, loop = true) {
  return scene.time.addEvent({
    delay: delay,
    callback: callback,
    callbackScope: scene,
    loop: loop
  });
}

/**
 * Cleans up off-screen sprites
 * @param {Phaser.Physics.Arcade.Group} group - Group to clean
 * @param {number} worldHeight - World height
 * @param {number} worldWidth - World width
 */
export function cleanupOffscreenSprites(group, worldHeight, worldWidth) {
  group.children.each(sprite => {
    if (sprite.y < 0 || sprite.y > worldHeight ||
        sprite.x < 0 || sprite.x > worldWidth) {
      sprite.destroy();
    }
  });
}

/**
 * Creates a score text display
 * @param {Phaser.Scene} scene - The current scene
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {string} label - Label text
 * @returns {Phaser.GameObjects.Text}
 */
export function createScoreText(scene, x, y, label = 'Score: 0') {
  return scene.add.text(x, y, label, {
    fontSize: '32px',
    fill: '#fff',
    fontFamily: 'Arial',
    stroke: '#000',
    strokeThickness: 4
  });
}

/**
 * Updates score display
 * @param {Phaser.GameObjects.Text} textObject - Text object to update
 * @param {number} score - New score value
 * @param {string} prefix - Prefix text
 */
export function updateScore(textObject, score, prefix = 'Score: ') {
  textObject.setText(prefix + score);
}

/**
 * Creates a game over screen
 * @param {Phaser.Scene} scene - The current scene
 * @param {number} finalScore - Final score
 * @param {Function} restartCallback - Function to call on restart
 */
export function showGameOver(scene, finalScore, restartCallback) {
  const centerX = scene.cameras.main.width / 2;
  const centerY = scene.cameras.main.height / 2;

  const gameOverText = scene.add.text(centerX, centerY,
    `GAME OVER\nScore: ${finalScore}\nClick to Restart`, {
    fontSize: '48px',
    fill: '#fff',
    align: 'center',
    backgroundColor: '#000',
    padding: { x: 20, y: 10 },
    fontFamily: 'Arial'
  }).setOrigin(0.5);

  scene.input.once('pointerdown', restartCallback, scene);

  return gameOverText;
}

/**
 * Spawns random enemy at top of screen
 * @param {Phaser.Physics.Arcade.Group} enemyGroup - Enemy group
 * @param {number} worldWidth - World width
 * @param {number} minSpeed - Minimum falling speed
 * @param {number} maxSpeed - Maximum falling speed
 */
export function spawnRandomEnemy(enemyGroup, worldWidth, minSpeed = 100, maxSpeed = 200) {
  const x = Phaser.Math.Between(50, worldWidth - 50);
  const enemy = enemyGroup.get(x, 0);

  if (enemy) {
    enemy.setActive(true);
    enemy.setVisible(true);
    enemy.setVelocity(
      Phaser.Math.Between(-100, 100),
      Phaser.Math.Between(minSpeed, maxSpeed)
    );
  }

  return enemy;
}

/**
 * Generic collision handler
 * @param {Phaser.Physics.Arcade.Sprite} obj1 - First object
 * @param {Phaser.Physics.Arcade.Sprite} obj2 - Second object
 * @param {Function} callback - Optional callback
 */
export function handleCollision(obj1, obj2, callback) {
  obj1.destroy();
  obj2.destroy();
  if (callback) callback();
}
