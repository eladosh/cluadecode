import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { useBuilderStore } from '../store';

export const ConfigPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { design, updateConfig } = useBuilderStore();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 p-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition-colors z-50"
        title="Canvas Settings"
      >
        <Settings size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 w-80 bg-gray-800 rounded-lg shadow-2xl p-4 z-50 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Canvas Settings</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={design.config.title}
            onChange={(e) => updateConfig({ title: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={design.config.description}
            onChange={(e) => updateConfig({ description: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded text-sm h-20 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Width</label>
            <input
              type="number"
              value={design.config.width}
              onChange={(e) => updateConfig({ width: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Height</label>
            <input
              type="number"
              value={design.config.height}
              onChange={(e) => updateConfig({ height: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Background Color</label>
          <input
            type="color"
            value={design.config.backgroundColor}
            onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>

        <div className="pt-2 border-t border-gray-700">
          <h4 className="text-sm font-medium mb-2">Playable Ad Settings</h4>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">CTA Button Text</label>
              <input
                type="text"
                value={design.config.ctaText || ''}
                onChange={(e) => updateConfig({ ctaText: e.target.value })}
                placeholder="Download Now"
                className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">App Store URL</label>
              <input
                type="text"
                value={design.config.ctaUrl || ''}
                onChange={(e) => updateConfig({ ctaUrl: e.target.value })}
                placeholder="https://apps.apple.com/..."
                className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="snapToGrid"
                checked={design.config.snapToGrid || false}
                onChange={(e) => updateConfig({ snapToGrid: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="snapToGrid" className="text-sm font-medium">
                Snap to Grid
              </label>
            </div>

            {design.config.snapToGrid && (
              <div>
                <label className="block text-sm font-medium mb-1">Grid Size (px)</label>
                <input
                  type="number"
                  value={design.config.gridSize || 20}
                  onChange={(e) => updateConfig({ gridSize: Number(e.target.value) })}
                  min="5"
                  max="50"
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
                />
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700 text-xs text-gray-400">
          <p>📱 Common playable ad sizes:</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <button
              onClick={() => updateConfig({ width: 800, height: 600 })}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              800x600
            </button>
            <button
              onClick={() => updateConfig({ width: 640, height: 960 })}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              640x960
            </button>
            <button
              onClick={() => updateConfig({ width: 320, height: 480 })}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              320x480
            </button>
            <button
              onClick={() => updateConfig({ width: 750, height: 1334 })}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              750x1334
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
