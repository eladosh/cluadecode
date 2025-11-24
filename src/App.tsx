import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { ElementsPanel } from './components/ElementsPanel';
import { PropertiesPanel } from './components/PropertiesPanel';
import { ConfigPanel } from './components/ConfigPanel';
import { TemplatesPanel } from './components/TemplatesPanel';
import { NetworkSelector } from './components/NetworkSelector';
import { useBuilderStore } from './store';

function App() {
  const { design } = useBuilderStore();

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <h1 className="text-2xl font-bold">🎮 Playable Ad Builder</h1>
        <p className="text-sm text-gray-400">{design.config.title}</p>
      </header>

      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        <ElementsPanel />
        <Canvas />
        <PropertiesPanel />
      </div>

      <TemplatesPanel />
      <NetworkSelector />
      <ConfigPanel />

      <footer className="bg-gray-800 border-t border-gray-700 px-6 py-2 text-sm text-gray-400">
        <div className="flex justify-between items-center">
          <span>✨ Create engaging playable ads with animations, CTA buttons, and pre-built templates</span>
          <span>{design.elements.length} elements</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
