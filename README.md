# Playable Ad Builder

A powerful visual builder for creating playable ad game mechanics and layouts. Design interactive game experiences with an intuitive drag-and-drop interface and export them as standalone HTML files.

## Features

### 🎨 Visual Layout Builder
- **Drag-and-drop interface** for easy element placement
- **Real-time canvas editing** with zoom and pan controls
- **Multiple element types**: buttons, targets, obstacles, shapes, text, and images
- **Visual property editor** for customizing every aspect of your elements

### 🎮 Game Elements
- **Interactive Buttons**: Create clickable buttons with win/lose actions
- **Targets**: Add game targets for scoring mechanics
- **Obstacles**: Place obstacles to create challenges
- **Shapes**: Add rectangles and circles for visual design
- **Text**: Add customizable text elements
- **Images**: Import external images for richer visuals

### ⚙️ Customization Options
- Position (X, Y coordinates)
- Size (width, height)
- Rotation (0-360 degrees)
- Color customization
- Font size and text content
- Interactive behaviors (win, lose, score)
- Layer ordering (z-index)

### 👀 Preview Mode
- **Live preview** of your playable ad
- Test interactive elements before export
- See exactly how players will experience your game

### 💾 Import/Export
- **Export to HTML**: Generate standalone playable ad files
- **Save designs as JSON**: Share and reuse your layouts
- **Import designs**: Load and edit existing layouts

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cluadecode
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage Guide

### Creating Your First Playable Ad

1. **Select a Tool**: Click on any tool in the toolbar (button, target, shape, etc.)
2. **Place Elements**: Click on the canvas to place the selected element
3. **Customize**: Select an element to edit its properties in the right panel
4. **Preview**: Click the "Preview" button to test your interactive elements
5. **Export**: Click the green HTML export button to download your playable ad

### Tool Overview

#### Selection Tools
- **Select (Mouse)**: Select and move elements on the canvas
- **Pan (Hand)**: Pan around the canvas without selecting elements

#### Element Tools
- **Button**: Create interactive buttons with actions
- **Target**: Add game targets
- **Obstacle**: Place obstacles
- **Rectangle**: Add rectangular shapes
- **Circle**: Add circular shapes
- **Text**: Add text labels
- **Image**: Insert images (requires URL)

### Keyboard Shortcuts

- `Delete`: Remove selected element
- `Ctrl/Cmd + D`: Duplicate selected element
- `Ctrl/Cmd + Z`: Undo (coming soon)

### Properties Panel

When you select an element, you can customize:

- **Position**: X and Y coordinates
- **Size**: Width and height in pixels
- **Rotation**: Rotate the element from 0-360 degrees
- **Color**: Change the background color
- **Text**: Edit text content (for text/button elements)
- **Font Size**: Adjust text size
- **Interactive**: Make the element clickable
- **Action**: Set what happens on click (win, lose, score)
- **Layer Order**: Move element up or down in the rendering order

### Canvas Settings

Click the settings icon (bottom-left) to configure:

- **Canvas size**: Set width and height (common sizes provided)
- **Background color**: Customize the game background
- **Title & Description**: Add metadata to your design

## Building for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── Canvas.tsx       # Main canvas workspace
│   ├── Toolbar.tsx      # Top toolbar with tools
│   ├── ElementsPanel.tsx # Left panel showing all elements
│   ├── PropertiesPanel.tsx # Right panel for editing properties
│   └── ConfigPanel.tsx  # Canvas configuration dialog
├── utils/
│   └── export.ts        # HTML export functionality
├── types.ts             # TypeScript type definitions
├── store.ts             # Zustand state management
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **Lucide React**: Icon library

## Export Format

Exported HTML files are standalone and include:
- All game elements with positioning and styling
- Interactive click handlers
- Score tracking system
- Win/lose game logic
- Game over screen with replay functionality
- Responsive design

The exported files work in any modern browser without dependencies.

## Example Use Cases

1. **Simple Click Game**: Create buttons with win/lose actions
2. **Collection Game**: Add multiple targets with score values
3. **Avoid Obstacles**: Mix targets and obstacles for challenge
4. **Story Playable**: Use buttons to progress through a narrative
5. **Puzzle Game**: Arrange elements to create puzzle mechanics

## Tips for Best Results

- **Keep it simple**: Playable ads work best with clear, simple mechanics
- **Test interactions**: Always preview before exporting
- **Use contrasting colors**: Make interactive elements stand out
- **Mobile-first**: Consider common mobile ad sizes (320x480, 800x600)
- **Clear call-to-action**: Use buttons with clear text like "Play Now!"

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this for your projects!

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Built with ❤️ for game designers and marketing teams
