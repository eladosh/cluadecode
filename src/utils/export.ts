import { GameDesign, AnimationType } from '../types';
import { generateGameMechanics } from './gameMechanics';

const getAnimationCSS = (animation?: AnimationType, duration?: number): string => {
  if (!animation || animation === 'none') return '';

  const animationDuration = duration || 2;
  const animations: Record<string, string> = {
    bounce: `animation: bounce ${animationDuration}s ease-in-out infinite;`,
    pulse: `animation: pulse ${animationDuration}s ease-in-out infinite;`,
    shake: `animation: shake ${animationDuration}s ease-in-out infinite;`,
    float: `animation: float ${animationDuration}s ease-in-out infinite;`,
    spin: `animation: spin ${animationDuration}s linear infinite;`,
    glow: `animation: glow ${animationDuration}s ease-in-out infinite;`
  };

  return animations[animation] || '';
};

export const generatePlayableHTML = (design: GameDesign): string => {
  const elementsHTML = design.elements
    .sort((a, b) => a.zIndex - b.zIndex)
    .map((element) => {
      const borderRadius =
        element.type === 'circle' ? '50%' :
        ['button', 'cta'].includes(element.type) ? '8px' : '0';

      const fontWeight = ['button', 'cta'].includes(element.type) ? 'bold' : 'normal';
      const boxShadow = ['button', 'cta'].includes(element.type) ? '0 4px 6px rgba(0,0,0,0.3)' : 'none';

      const style = `
        position: absolute;
        left: ${element.x}px;
        top: ${element.y}px;
        width: ${element.width}px;
        height: ${element.height}px;
        background-color: ${element.color};
        transform: rotate(${element.rotation}deg);
        border-radius: ${borderRadius};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: ${element.fontSize || 16}px;
        font-weight: ${fontWeight};
        cursor: ${element.isInteractive ? 'pointer' : 'default'};
        user-select: none;
        box-shadow: ${boxShadow};
        z-index: ${element.zIndex};
        opacity: ${element.opacity ?? 1};
        ${getAnimationCSS(element.animation, element.animationDuration)}
      `.trim();

      const dataAttrs = element.isInteractive
        ? `data-interactive="true" data-action="${element.action || 'none'}" data-score="${element.scoreValue || 0}" data-cta="${element.ctaLink || ''}"`
        : '';

      let content = '';
      if (element.text) {
        content = `<span>${element.text}</span>`;
      }
      if (element.imageUrl) {
        content = `<img src="${element.imageUrl}" alt="Game element" style="width: 100%; height: 100%; object-fit: cover;">`;
      }

      return `    <div class="game-element" ${dataAttrs} style="${style}">${content}</div>`;
    })
    .join('\n');

  const htmlSize = new Blob([elementsHTML]).size;
  const estimatedTotalSize = Math.round(htmlSize * 2.5 / 1024);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="description" content="${design.config.description}">
  <title>${design.config.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    body {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #2a2a3e;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      touch-action: none;
    }

    #game-wrapper {
      position: relative;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #game-container {
      position: relative;
      width: ${design.config.width}px;
      height: ${design.config.height}px;
      max-width: 100vw;
      max-height: 100vh;
      background-color: ${design.config.backgroundColor};
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
      overflow: hidden;
      touch-action: none;
    }

    /* Responsive scaling - maintains aspect ratio */
    @media (max-width: ${design.config.width}px), (max-height: ${design.config.height}px) {
      #game-container {
        width: 100vw;
        height: calc(100vw * ${design.config.height / design.config.width});
      }

      /* If height exceeds viewport, scale by height instead */
      @supports (height: 100dvh) {
        #game-container {
          max-height: 100dvh;
        }
      }
    }

    @media (max-height: ${design.config.height}px) and (min-width: ${design.config.width}px) {
      #game-container {
        width: calc(100vh * ${design.config.width / design.config.height});
        height: 100vh;
      }
    }

    /* Mobile-specific optimizations */
    @media (max-width: 768px) {
      #game-container {
        width: 100vw;
        height: calc(100vw * ${design.config.height / design.config.width});
        max-height: 100vh;
      }
    }

    /* Landscape mobile */
    @media (max-height: 500px) and (orientation: landscape) {
      #game-container {
        width: auto;
        height: 100vh;
        max-width: calc(100vh * ${design.config.width / design.config.height});
      }
    }

    #game-ui {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      font-size: 14px;
      z-index: 1000;
      pointer-events: none;
    }

    #game-over {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.95);
      color: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      display: none;
      z-index: 2000;
      animation: fadeIn 0.3s ease-out;
    }

    #game-over h2 {
      font-size: 32px;
      margin-bottom: 15px;
    }

    #game-over p {
      font-size: 18px;
      margin-bottom: 20px;
    }

    #game-over button {
      padding: 10px 30px;
      font-size: 16px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: transform 0.2s;
    }

    #game-over button:hover {
      background: #45a049;
      transform: scale(1.05);
    }

    #game-over button:active {
      transform: scale(0.95);
    }

    .game-element {
      transition: transform 0.1s ease;
    }

    .game-element:hover {
      transform: scale(1.05) !important;
    }

    .game-element:active {
      transform: scale(0.95) !important;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(255, 152, 0, 0.8); }
      50% { box-shadow: 0 0 40px rgba(255, 152, 0, 1); }
    }
  </style>
</head>
<body>
  <div id="game-wrapper">
    <div id="game-container">
      <div id="game-ui">
        <div>Score: <span id="score">0</span></div>
      </div>

      <div id="game-over">
        <h2 id="game-result">You Win! 🎉</h2>
        <p id="game-score">Final Score: 0</p>
        <button onclick="location.reload()">Play Again</button>
      </div>

${elementsHTML}
    </div>
  </div>

  <script>
    let score = 0;
    const scoreElement = document.getElementById('score');
    const gameOverScreen = document.getElementById('game-over');
    const gameResult = document.getElementById('game-result');
    const gameScore = document.getElementById('game-score');

    function updateScore(value) {
      score += value;
      scoreElement.textContent = score;
    }

    function endGame(isWin) {
      gameResult.textContent = isWin ? 'You Win! 🎉' : 'Game Over 😢';
      gameScore.textContent = 'Final Score: ' + score;
      gameOverScreen.style.display = 'block';
    }

    // Game-specific mechanics
    ${generateGameMechanics(design)}

    // Add click/touch handlers to interactive elements
    document.querySelectorAll('[data-interactive="true"]').forEach(element => {
      const handleClick = function(e) {
        e.preventDefault();
        const action = this.getAttribute('data-action');
        const scoreValue = parseInt(this.getAttribute('data-score')) || 0;
        const ctaLink = this.getAttribute('data-cta');

        switch(action) {
          case 'win':
            endGame(true);
            break;
          case 'lose':
            endGame(false);
            break;
          case 'score':
            updateScore(scoreValue);
            // Add visual feedback
            this.style.transform = 'scale(0)';
            setTimeout(() => {
              this.style.display = 'none';
            }, 300);
            break;
          case 'cta':
            if (ctaLink) {
              window.open(ctaLink, '_blank');
            }
            break;
        }
      };

      // Support both mouse and touch events
      element.addEventListener('click', handleClick);
      element.addEventListener('touchstart', function(e) {
        e.preventDefault();
        handleClick.call(this, e);
      }, { passive: false });
    });

    // Prevent default touch behaviors
    document.getElementById('game-container').addEventListener('touchmove', function(e) {
      e.preventDefault();
    }, { passive: false });

    console.log('${design.config.title} loaded');
    console.log('Interactive elements:', document.querySelectorAll('[data-interactive="true"]').length);
    console.log('Estimated size: ~${estimatedTotalSize}KB');
  </script>
</body>
</html>`;
};

export const downloadPlayableHTML = (design: GameDesign) => {
  const html = generatePlayableHTML(design);
  const blob = new Blob([html], { type: 'text/html' });
  const size = (blob.size / 1024).toFixed(2);

  console.log(`Generated playable ad: ${size}KB`);

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${design.config.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
  link.click();
  URL.revokeObjectURL(url);
};
