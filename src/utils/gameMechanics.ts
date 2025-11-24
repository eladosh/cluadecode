import { GameDesign } from '../types';

/**
 * Generate game-specific JavaScript based on the design
 */
export const generateGameMechanics = (design: GameDesign): string => {
  // Detect game type based on title or elements
  const title = design.config.title.toLowerCase();

  if (title.includes('collect') || title.includes('coin')) {
    return generateCollectGameMechanics(design);
  }

  if (title.includes('avoid') || title.includes('reach')) {
    return generateAvoidGameMechanics(design);
  }

  if (title.includes('puzzle') || title.includes('match')) {
    return generatePuzzleGameMechanics(design);
  }

  if (title.includes('runner') || title.includes('run')) {
    return generateRunnerGameMechanics(design);
  }

  // Default basic game mechanics
  return generateBasicGameMechanics(design);
};

/**
 * Tap to Collect game mechanics
 */
const generateCollectGameMechanics = (_design: GameDesign): string => {
  return `
    // Tap to Collect Game Mechanics
    let collectedItems = 0;
    const totalCollectibles = document.querySelectorAll('[data-action="score"]').length;

    // Add collection feedback
    document.querySelectorAll('[data-action="score"]').forEach(element => {
      element.addEventListener('click', function(e) {
        e.preventDefault();

        // Animate collection
        this.style.transition = 'all 0.3s ease-out';
        this.style.transform = 'scale(0) rotate(360deg)';
        this.style.opacity = '0';

        // Particle effect
        createParticles(this);

        // Update score
        collectedItems++;
        updateScore(parseInt(this.getAttribute('data-score')) || 10);

        // Check win condition
        if (collectedItems >= totalCollectibles) {
          setTimeout(() => endGame(true), 500);
        }

        // Remove after animation
        setTimeout(() => {
          this.style.display = 'none';
        }, 300);
      });

      // Hover effect
      element.addEventListener('mouseenter', function() {
        if (this.style.display !== 'none') {
          this.style.transform = 'scale(1.1) rotate(5deg)';
        }
      });

      element.addEventListener('mouseleave', function() {
        if (this.style.display !== 'none') {
          this.style.transform = 'scale(1) rotate(0deg)';
        }
      });
    });

    // Particle system
    function createParticles(element) {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = element.style.backgroundColor;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 8;
        const distance = 50 + Math.random() * 50;
        const targetX = centerX + Math.cos(angle) * distance;
        const targetY = centerY + Math.sin(angle) * distance;

        particle.animate([
          { left: centerX + 'px', top: centerY + 'px', opacity: 1 },
          { left: targetX + 'px', top: targetY + 'px', opacity: 0 }
        ], {
          duration: 500,
          easing: 'ease-out'
        }).onfinish = () => particle.remove();
      }
    }

    // Update UI
    document.getElementById('score').textContent = '0/' + totalCollectibles;
    let currentScore = 0;
    const originalUpdateScore = updateScore;
    updateScore = function(value) {
      currentScore += value;
      document.getElementById('score').textContent = collectedItems + '/' + totalCollectibles;
    };
  `;
};

/**
 * Avoid & Reach game mechanics
 */
const generateAvoidGameMechanics = (_design: GameDesign): string => {
  return `
    // Avoid & Reach Game Mechanics
    let gameActive = true;

    // Animate obstacles
    document.querySelectorAll('[data-action="lose"]').forEach((obstacle, index) => {
      // Pulsing danger effect
      setInterval(() => {
        if (gameActive) {
          obstacle.style.boxShadow = '0 0 20px rgba(244, 67, 54, 0.8)';
          setTimeout(() => {
            obstacle.style.boxShadow = '0 0 10px rgba(244, 67, 54, 0.4)';
          }, 500);
        }
      }, 1000 + index * 200);

      // Enhanced feedback on hover
      obstacle.addEventListener('mouseenter', function() {
        if (gameActive) {
          this.style.transform = 'scale(1.1) rotate(45deg)';
          this.style.boxShadow = '0 0 30px rgba(244, 67, 54, 1)';
        }
      });

      obstacle.addEventListener('mouseleave', function() {
        if (gameActive) {
          const rotation = this.style.transform.match(/rotate\\((.+?)deg/)?.[1] || 0;
          this.style.transform = \`scale(1) rotate(\${rotation}deg)\`;
        }
      });

      // Add shake on click
      obstacle.addEventListener('click', function(e) {
        e.preventDefault();
        gameActive = false;

        // Shake animation
        this.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-10px)' },
          { transform: 'translateX(10px)' },
          { transform: 'translateX(-10px)' },
          { transform: 'translateX(10px)' },
          { transform: 'translateX(0)' }
        ], {
          duration: 300,
          easing: 'ease-in-out'
        });

        setTimeout(() => endGame(false), 400);
      });
    });

    // Enhanced goal button
    document.querySelectorAll('[data-action="win"]').forEach(goal => {
      // Glow effect
      setInterval(() => {
        if (gameActive) {
          goal.style.boxShadow = '0 0 30px rgba(76, 175, 80, 1)';
          setTimeout(() => {
            goal.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.6)';
          }, 500);
        }
      }, 1000);

      goal.addEventListener('click', function(e) {
        e.preventDefault();
        if (gameActive) {
          gameActive = false;

          // Victory animation
          this.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.3)' },
            { transform: 'scale(1)' }
          ], {
            duration: 300,
            easing: 'ease-in-out'
          });

          // Confetti effect
          createConfetti();

          setTimeout(() => endGame(true), 500);
        }
      });
    });

    // Confetti system
    function createConfetti() {
      const colors = ['#FFD700', '#4CAF50', '#2196F3', '#FF9800', '#E91E63'];
      for (let i = 0; i < 30; i++) {
        setTimeout(() => {
          const confetti = document.createElement('div');
          confetti.style.position = 'fixed';
          confetti.style.left = Math.random() * window.innerWidth + 'px';
          confetti.style.top = '-10px';
          confetti.style.width = '10px';
          confetti.style.height = '10px';
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.pointerEvents = 'none';
          confetti.style.zIndex = '9999';
          document.body.appendChild(confetti);

          confetti.animate([
            { top: '-10px', transform: 'rotate(0deg)' },
            { top: window.innerHeight + 'px', transform: 'rotate(720deg)' }
          ], {
            duration: 2000 + Math.random() * 1000,
            easing: 'ease-in'
          }).onfinish = () => confetti.remove();
        }, i * 50);
      }
    }
  `;
};

/**
 * Puzzle Match game mechanics
 */
const generatePuzzleGameMechanics = (_design: GameDesign): string => {
  return `
    // Puzzle Match Game Mechanics
    let selectedCards = [];
    let matchedCards = 0;
    const totalMatches = 3;
    let gameActive = true;

    // Card selection logic
    document.querySelectorAll('[data-action="score"]').forEach(card => {
      card.style.cursor = 'pointer';
      card.style.transition = 'all 0.3s ease';

      card.addEventListener('click', function(e) {
        e.preventDefault();
        if (!gameActive || selectedCards.includes(this)) return;

        // Select card
        selectedCards.push(this);
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 20px rgba(156, 39, 176, 1)';

        // Add checkmark
        if (!this.querySelector('.checkmark')) {
          const check = document.createElement('div');
          check.className = 'checkmark';
          check.textContent = '✓';
          check.style.position = 'absolute';
          check.style.top = '50%';
          check.style.left = '50%';
          check.style.transform = 'translate(-50%, -50%)';
          check.style.fontSize = '60px';
          check.style.color = 'white';
          check.style.fontWeight = 'bold';
          this.appendChild(check);
        }

        matchedCards++;

        // Check if all matches found
        if (matchedCards >= totalMatches) {
          gameActive = false;
          setTimeout(() => {
            createConfetti();
            setTimeout(() => endGame(true), 500);
          }, 300);
        }
      });

      card.addEventListener('mouseenter', function() {
        if (gameActive && !selectedCards.includes(this)) {
          this.style.transform = 'scale(1.05) translateY(-5px)';
        }
      });

      card.addEventListener('mouseleave', function() {
        if (!selectedCards.includes(this)) {
          this.style.transform = 'scale(1)';
        }
      });
    });

    // Wrong answer handling
    document.querySelectorAll('[data-action="lose"]').forEach(wrong => {
      wrong.addEventListener('click', function(e) {
        e.preventDefault();
        if (!gameActive) return;

        gameActive = false;

        // Shake animation
        this.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-10px)' },
          { transform: 'translateX(10px)' },
          { transform: 'translateX(-10px)' },
          { transform: 'translateX(0)' }
        ], {
          duration: 400,
          easing: 'ease-in-out'
        });

        setTimeout(() => endGame(false), 500);
      });
    });

    // Confetti for victory
    function createConfetti() {
      const colors = ['#9C27B0', '#E91E63', '#FFD700', '#4CAF50'];
      for (let i = 0; i < 40; i++) {
        setTimeout(() => {
          const confetti = document.createElement('div');
          confetti.style.position = 'fixed';
          confetti.style.left = Math.random() * window.innerWidth + 'px';
          confetti.style.top = '-10px';
          confetti.style.width = '8px';
          confetti.style.height = '8px';
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.borderRadius = '50%';
          confetti.style.pointerEvents = 'none';
          confetti.style.zIndex = '9999';
          document.body.appendChild(confetti);

          confetti.animate([
            { top: '-10px', transform: 'rotate(0deg)' },
            { top: window.innerHeight + 'px', transform: 'rotate(1080deg)' }
          ], {
            duration: 2000 + Math.random() * 1000,
            easing: 'ease-in'
          }).onfinish = () => confetti.remove();
        }, i * 30);
      }
    }

    // Update score display
    document.getElementById('score').textContent = '0/' + totalMatches;
    const originalUpdateScore = updateScore;
    updateScore = function(value) {
      document.getElementById('score').textContent = matchedCards + '/' + totalMatches;
    };
  `;
};

/**
 * Endless Runner game mechanics
 */
const generateRunnerGameMechanics = (_design: GameDesign): string => {
  return `
    // Endless Runner Game Mechanics
    let gameActive = true;
    let playerJumping = false;
    let distance = 0;

    const player = document.querySelector('[data-interactive="false"].game-element');
    const obstacles = document.querySelectorAll('[data-action="lose"]');
    const goal = document.querySelector('[data-action="win"]');

    if (!player) return;

    // Jump mechanics
    let playerY = parseInt(player.style.top) || 0;
    const groundY = playerY;

    function jump() {
      if (!gameActive || playerJumping) return;

      playerJumping = true;
      const jumpHeight = 100;
      const jumpDuration = 400;

      // Jump up
      player.animate([
        { top: playerY + 'px' },
        { top: (playerY - jumpHeight) + 'px' }
      ], {
        duration: jumpDuration / 2,
        easing: 'ease-out',
        fill: 'forwards'
      }).onfinish = () => {
        // Fall down
        player.animate([
          { top: (playerY - jumpHeight) + 'px' },
          { top: playerY + 'px' }
        ], {
          duration: jumpDuration / 2,
          easing: 'ease-in',
          fill: 'forwards'
        }).onfinish = () => {
          playerJumping = false;
        };
      };
    }

    // Click/tap anywhere to jump
    document.getElementById('game-container').addEventListener('click', function(e) {
      if (gameActive) {
        jump();
        e.stopPropagation();
      }
    });

    // Keyboard controls
    document.addEventListener('keydown', function(e) {
      if (e.code === 'Space' && gameActive) {
        e.preventDefault();
        jump();
      }
    });

    // Animate obstacles moving
    obstacles.forEach((obstacle, index) => {
      let obstacleX = parseInt(obstacle.style.left) || 0;
      const moveSpeed = 3;

      function moveObstacle() {
        if (!gameActive) return;

        obstacleX -= moveSpeed;
        obstacle.style.left = obstacleX + 'px';

        // Check collision
        if (checkCollision(player, obstacle) && !playerJumping) {
          gameActive = false;
          endGame(false);
          return;
        }

        // Reset position if off screen
        if (obstacleX < -100) {
          obstacleX = 640 + index * 200;
        }

        requestAnimationFrame(moveObstacle);
      }

      moveObstacle();
    });

    // Animate goal
    if (goal) {
      let goalX = parseInt(goal.style.left) || 0;
      const goalSpeed = 2;

      function moveGoal() {
        if (!gameActive) return;

        goalX -= goalSpeed;
        goal.style.left = goalX + 'px';

        // Check if reached goal
        if (checkCollision(player, goal)) {
          gameActive = false;
          createConfetti();
          setTimeout(() => endGame(true), 500);
          return;
        }

        requestAnimationFrame(moveGoal);
      }

      moveGoal();
    }

    // Distance counter
    let distanceInterval = setInterval(() => {
      if (gameActive) {
        distance++;
        updateScore(1);
      } else {
        clearInterval(distanceInterval);
      }
    }, 100);

    // Collision detection
    function checkCollision(el1, el2) {
      const rect1 = el1.getBoundingClientRect();
      const rect2 = el2.getBoundingClientRect();

      return !(rect1.right < rect2.left ||
               rect1.left > rect2.right ||
               rect1.bottom < rect2.top ||
               rect1.top > rect2.bottom);
    }

    // Confetti
    function createConfetti() {
      const colors = ['#FFD700', '#4CAF50', '#2196F3'];
      for (let i = 0; i < 50; i++) {
        setTimeout(() => {
          const confetti = document.createElement('div');
          confetti.style.position = 'fixed';
          confetti.style.left = Math.random() * window.innerWidth + 'px';
          confetti.style.top = '-10px';
          confetti.style.width = '8px';
          confetti.style.height = '8px';
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.pointerEvents = 'none';
          confetti.style.zIndex = '9999';
          document.body.appendChild(confetti);

          confetti.animate([
            { top: '-10px' },
            { top: window.innerHeight + 'px' }
          ], {
            duration: 2000,
            easing: 'ease-in'
          }).onfinish = () => confetti.remove();
        }, i * 20);
      }
    }

    // Instructions
    const instruction = document.createElement('div');
    instruction.textContent = 'TAP or PRESS SPACE to JUMP!';
    instruction.style.position = 'absolute';
    instruction.style.top = '20px';
    instruction.style.left = '50%';
    instruction.style.transform = 'translateX(-50%)';
    instruction.style.color = 'white';
    instruction.style.fontSize = '18px';
    instruction.style.fontWeight = 'bold';
    instruction.style.backgroundColor = 'rgba(0,0,0,0.7)';
    instruction.style.padding = '10px 20px';
    instruction.style.borderRadius = '5px';
    instruction.style.zIndex = '100';
    document.getElementById('game-container').appendChild(instruction);

    setTimeout(() => {
      instruction.style.opacity = '0';
      instruction.style.transition = 'opacity 0.5s';
      setTimeout(() => instruction.remove(), 500);
    }, 3000);
  `;
};

/**
 * Basic game mechanics for custom games
 */
const generateBasicGameMechanics = (_design: GameDesign): string => {
  return `
    // Basic Game Mechanics

    // Add hover effects to all interactive elements
    document.querySelectorAll('[data-interactive="true"]').forEach(element => {
      element.style.transition = 'transform 0.2s ease';

      element.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
      });

      element.addEventListener('mouseleave', function() {
        const rotation = this.style.transform.match(/rotate\\((.+?)deg/)?.[1] || 0;
        this.style.transform = \`scale(1) rotate(\${rotation}deg)\`;
      });
    });
  `;
};
