import { GameDesign } from '../types';

export const generatePlayableHTML = (design: GameDesign): string => {
  const elementsHTML = design.elements
    .sort((a, b) => a.zIndex - b.zIndex)
    .map((element) => {
      const style = `
        position: absolute;
        left: ${element.x}px;
        top: ${element.y}px;
        width: ${element.width}px;
        height: ${element.height}px;
        background-color: ${element.color};
        transform: rotate(${element.rotation}deg);
        border-radius: ${element.type === 'circle' ? '50%' : element.type === 'button' ? '8px' : '0'};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: ${element.fontSize || 16}px;
        font-weight: ${element.type === 'button' ? 'bold' : 'normal'};
        cursor: ${element.isInteractive ? 'pointer' : 'default'};
        user-select: none;
        box-shadow: ${element.type === 'button' ? '0 4px 6px rgba(0,0,0,0.3)' : 'none'};
        z-index: ${element.zIndex};
      `.trim();

      const dataAttrs = element.isInteractive
        ? `data-interactive="true" data-action="${element.action || 'none'}" data-score="${element.scoreValue || 0}"`
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${design.config.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #2a2a3e;
      font-family: Arial, sans-serif;
    }

    #game-container {
      position: relative;
      width: ${design.config.width}px;
      height: ${design.config.height}px;
      background-color: ${design.config.backgroundColor};
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
      overflow: hidden;
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
    }

    #game-over {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      display: none;
      z-index: 2000;
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
    }

    #game-over button:hover {
      background: #45a049;
    }

    .game-element {
      transition: transform 0.1s ease;
    }

    .game-element:active {
      transform: scale(0.95) !important;
    }
  </style>
</head>
<body>
  <div id="game-container">
    <div id="game-ui">
      <div>Score: <span id="score">0</span></div>
    </div>

    <div id="game-over">
      <h2 id="game-result">You Win!</h2>
      <p id="game-score">Final Score: 0</p>
      <button onclick="location.reload()">Play Again</button>
    </div>

${elementsHTML}
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
      gameScore.textContent = \`Final Score: \${score}\`;
      gameOverScreen.style.display = 'block';
    }

    // Add click handlers to interactive elements
    document.querySelectorAll('[data-interactive="true"]').forEach(element => {
      element.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        const scoreValue = parseInt(this.getAttribute('data-score')) || 0;

        switch(action) {
          case 'win':
            endGame(true);
            break;
          case 'lose':
            endGame(false);
            break;
          case 'score':
            updateScore(scoreValue);
            // Optional: remove element after clicking
            // this.style.display = 'none';
            break;
        }
      });

      // Add hover effect
      element.addEventListener('mouseenter', function() {
        this.style.transform = \`rotate(\${this.style.transform.match(/rotate\\((.+?)deg/)?.[1] || 0}deg) scale(1.05)\`;
      });

      element.addEventListener('mouseleave', function() {
        this.style.transform = \`rotate(\${this.style.transform.match(/rotate\\((.+?)deg/)?.[1] || 0}deg) scale(1)\`;
      });
    });

    console.log('Playable ad loaded. Interactive elements:', document.querySelectorAll('[data-interactive="true"]').length);
  </script>
</body>
</html>`;
};

export const downloadPlayableHTML = (design: GameDesign) => {
  const html = generatePlayableHTML(design);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${design.config.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
  link.click();
  URL.revokeObjectURL(url);
};
