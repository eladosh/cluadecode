import React, { useState } from 'react';
import { X, Sparkles, Gamepad2, Puzzle, Zap, Layout } from 'lucide-react';
import { useBuilderStore } from '../store';
import { playableAdTemplates } from '../data/templates';

export const TemplatesPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { loadDesign } = useBuilderStore();

  const categoryIcons = {
    casual: <Gamepad2 size={20} />,
    puzzle: <Puzzle size={20} />,
    action: <Zap size={20} />,
    arcade: <Sparkles size={20} />
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = playableAdTemplates.find(t => t.id === templateId);
    if (template) {
      loadDesign(template.design);
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 left-4 p-3 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg transition-colors z-40 flex items-center gap-2"
        title="Browse Templates"
      >
        <Layout size={20} />
        <span className="text-sm font-medium">Templates</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Sparkles size={28} className="text-purple-400" />
            <div>
              <h2 className="text-2xl font-bold">Playable Ad Templates</h2>
              <p className="text-sm text-gray-400">Choose a template to get started quickly</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playableAdTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-gray-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all cursor-pointer group"
                onClick={() => handleLoadTemplate(template.id)}
              >
                <div className="aspect-video bg-gray-900 flex items-center justify-center relative overflow-hidden">
                  {/* Template preview visualization */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background: template.design.config.backgroundColor,
                      transform: 'scale(0.3)',
                      transformOrigin: 'center'
                    }}
                  >
                    {template.design.elements.slice(0, 5).map((el) => (
                      <div
                        key={el.id}
                        style={{
                          position: 'absolute',
                          left: el.x,
                          top: el.y,
                          width: el.width,
                          height: el.height,
                          backgroundColor: el.color,
                          borderRadius: el.type === 'circle' ? '50%' : '8px',
                          opacity: 0.8
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs bg-black/50 px-2 py-1 rounded">
                    {categoryIcons[template.category]}
                    <span className="capitalize">{template.category}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-purple-400 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{template.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{template.design.elements.length} elements</span>
                    <span>{template.design.config.width}x{template.design.config.height}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-750">
          <p className="text-sm text-gray-400 text-center">
            💡 Tip: Load a template and customize it to match your game's style
          </p>
        </div>
      </div>
    </div>
  );
};
