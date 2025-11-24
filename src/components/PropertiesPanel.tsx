import React from 'react';
import { Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react';
import { useBuilderStore } from '../store';

export const PropertiesPanel: React.FC = () => {
  const { design, selectedElementId, updateElement, deleteElement, duplicateElement, moveElementUp, moveElementDown } =
    useBuilderStore();

  const selectedElement = design.elements.find((el) => el.id === selectedElementId);

  if (!selectedElement) {
    return (
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
        <h2 className="text-xl font-bold mb-4">Properties</h2>
        <p className="text-gray-400 text-sm">Select an element to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Properties</h2>
        <div className="flex gap-1">
          <button
            onClick={() => duplicateElement(selectedElement.id)}
            className="p-1 rounded bg-gray-700 hover:bg-gray-600"
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={() => deleteElement(selectedElement.id)}
            className="p-1 rounded bg-red-600 hover:bg-red-700"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <input
            type="text"
            value={selectedElement.type}
            disabled
            className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">X</label>
            <input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Y</label>
            <input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Width</label>
            <input
              type="number"
              value={Math.round(selectedElement.width)}
              onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Height</label>
            <input
              type="number"
              value={Math.round(selectedElement.height)}
              onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rotation</label>
          <input
            type="range"
            min="0"
            max="360"
            value={selectedElement.rotation}
            onChange={(e) => updateElement(selectedElement.id, { rotation: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-gray-400 text-center">{selectedElement.rotation}°</div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            type="color"
            value={selectedElement.color}
            onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={selectedElement.opacity ?? 1}
            onChange={(e) => updateElement(selectedElement.id, { opacity: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-gray-400 text-center">{((selectedElement.opacity ?? 1) * 100).toFixed(0)}%</div>
        </div>

        {(selectedElement.type === 'text' || selectedElement.type === 'button' || selectedElement.type === 'cta') && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Text</label>
              <input
                type="text"
                value={selectedElement.text || ''}
                onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Font Size</label>
              <input
                type="number"
                value={selectedElement.fontSize || 16}
                onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
              />
            </div>
          </>
        )}

        {selectedElement.type === 'image' && (
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              value={selectedElement.imageUrl || ''}
              onChange={(e) => updateElement(selectedElement.id, { imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="interactive"
            checked={selectedElement.isInteractive}
            onChange={(e) => updateElement(selectedElement.id, { isInteractive: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="interactive" className="text-sm font-medium">
            Interactive
          </label>
        </div>

        {selectedElement.isInteractive && (
          <div>
            <label className="block text-sm font-medium mb-1">Action</label>
            <select
              value={selectedElement.action || 'none'}
              onChange={(e) => updateElement(selectedElement.id, { action: e.target.value as any })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
            >
              <option value="none">None</option>
              <option value="win">Win</option>
              <option value="lose">Lose</option>
              <option value="score">Score</option>
              <option value="cta">Call-to-Action</option>
            </select>
          </div>
        )}

        {selectedElement.action === 'score' && (
          <div>
            <label className="block text-sm font-medium mb-1">Score Value</label>
            <input
              type="number"
              value={selectedElement.scoreValue || 0}
              onChange={(e) => updateElement(selectedElement.id, { scoreValue: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
            />
          </div>
        )}

        {selectedElement.action === 'cta' && (
          <div>
            <label className="block text-sm font-medium mb-1">CTA Link (App Store URL)</label>
            <input
              type="text"
              value={selectedElement.ctaLink || ''}
              onChange={(e) => updateElement(selectedElement.id, { ctaLink: e.target.value })}
              placeholder="https://apps.apple.com/..."
              className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Animation</label>
          <select
            value={selectedElement.animation || 'none'}
            onChange={(e) => updateElement(selectedElement.id, { animation: e.target.value as any })}
            className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
          >
            <option value="none">None</option>
            <option value="bounce">Bounce</option>
            <option value="pulse">Pulse</option>
            <option value="shake">Shake</option>
            <option value="float">Float</option>
            <option value="spin">Spin</option>
            <option value="glow">Glow</option>
          </select>
        </div>

        {selectedElement.animation && selectedElement.animation !== 'none' && (
          <div>
            <label className="block text-sm font-medium mb-1">Animation Duration (seconds)</label>
            <input
              type="number"
              min="0.5"
              max="10"
              step="0.5"
              value={selectedElement.animationDuration || 2}
              onChange={(e) => updateElement(selectedElement.id, { animationDuration: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Layer Order</label>
          <div className="flex gap-2">
            <button
              onClick={() => moveElementUp(selectedElement.id)}
              className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm flex items-center justify-center gap-2"
            >
              <ArrowUp size={16} />
              Move Up
            </button>
            <button
              onClick={() => moveElementDown(selectedElement.id)}
              className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm flex items-center justify-center gap-2"
            >
              <ArrowDown size={16} />
              Move Down
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
