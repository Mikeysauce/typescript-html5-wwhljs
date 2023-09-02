async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface EntityOptions {
  name: string;
  damage: number;
  defense: number;
  health: number;
  position: {
    x: number;
    y: number;
  };
}

class Entity {
  options: EntityOptions;

  constructor(options: EntityOptions) {
    this.options = options;
  }

  getPosition(): { x: number; y: number } {
    return this.options.position;
  }

  setPosition(x: number, y: number) {
    this.options.position.x = x;
    this.options.position.y = y;
  }

  attack(target: Entity) {
    const attack = this.options.damage - target.options.defense;

    const isOverkill = attack > target.options.health;

    console.log(
      `[${this.options.name}] attack made for ${attack}, isOverkill: ${isOverkill}`
    );

    if (isOverkill) {
      target.options.health = 0;
    } else {
      target.options.health -= attack;
    }
  }

  moveTowards(target: Entity) {
    const speed = 5;
    const targetPosition = target.getPosition();
    const currentPosition = this.getPosition();

    console.log(
      `[${this.options.name}] ${this.options.position.x} ${this.options.position.y} moving towards (${target.options.name}) ${target.options.position.x} ${target.options.position.y}...`
    );

    const xDiff = targetPosition.x - currentPosition.x;
    const yDiff = targetPosition.y - currentPosition.y;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        this.setPosition(currentPosition.x + speed, currentPosition.y);
      } else {
        this.setPosition(currentPosition.x - speed, currentPosition.y);
      }
    } else {
      if (yDiff > 0) {
        this.setPosition(currentPosition.x, currentPosition.y + speed);
      } else {
        this.setPosition(currentPosition.x, currentPosition.y - speed);
      }
    }
  }
}

class Player extends Entity {}
class Enemy extends Entity {}

async function gameLoop(player: Player, enemy: Enemy) {
  let inBattle = false;

  // Game loop rules:
  // 1. Player and enemy start at opposite ends of the screen
  // 2. Player moves towards enemy
  while (!inBattle) {
    player.moveTowards(enemy);
    if (
      Math.abs(player.options.position.x - enemy.options.position.x) <= 10 ||
      Math.abs(player.options.position.y - enemy.options.position.y) <= 10
    ) {
      inBattle = true;
    }
    await wait(100);
  }

  // 8. If player reaches enemy, battle starts
  inBattle = true;
  console.log('Battle starts!');

  while (inBattle) {
    // 4. Player attacks enemy
    player.attack(enemy);
    await wait(100);

    // 5. Enemy attacks player
    enemy.attack(player);
    await wait(100);

    // 6. If player dies, game over
    if (player.options.health <= 0) {
      console.log('Game over! Player died.');
      return;
    }

    // 7. If enemy dies, player wins
    if (enemy.options.health <= 0) {
      console.log('Player wins!');
      inBattle = false;
      break;
    }

    // 9. If player runs away, battle ends
    if (player.options.position.x > enemy.options.position.x + 50) {
      console.log('Player runs away!');
      inBattle = false;
      break;
    }
  }

  // 10. If player wins battle, player moves on
  console.log('Player moves on!');
  await wait(100);

  // 12. If player wins all battles, player wins game
  console.log('Player wins game!');
}

async function setup(
  difficulty: 'easy' | 'normal' | 'hard' | 'legendary' = 'easy'
) {
  const gridSize = 200;
  const cellSize = 5;
  const canvas = document.createElement('canvas');
  canvas.width = gridSize * cellSize;
  canvas.height = gridSize * cellSize;
  document.body.appendChild(canvas);
  const context = canvas.getContext('2d');

  const player = new Player({
    name: 'Player',
    damage: 35,
    health: 200,
    defense: 10,
    position: {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    },
  });
  const enemy = new Enemy({
    name: 'Azeroa',
    damage: 15,
    health: 100,
    defense: 10,
    position: {
      x: gridSize - 1,
      y: 0,
    },
  });

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  // player.render(context, cellSize);
  // enemy.render(context, cellSize);

  // await gameLoop(player, enemy);
}

setup();
// gameLoop();
