import React from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';
import { useBuilderStore } from '../store';

export const ElementsPanel: React.FC = () => {
  const { design, selectedElementId, selectElement, deleteElement } = useBuilderStore();

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Layers size={20} />
        <h2 className="text-lg font-bold">Elements</h2>
        <span className="text-sm text-gray-400">({design.elements.length})</span>
      </div>

      {design.elements.length === 0 ? (
        <p className="text-gray-400 text-sm">No elements yet. Click on the canvas to add elements!</p>
      ) : (
        <div className="space-y-2">
          {[...design.elements]
            .sort((a, b) => b.zIndex - a.zIndex)
            .map((element, index) => (
              <div
                key={element.id}
                onClick={() => selectElement(element.id)}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedElementId === element.id
                    ? 'bg-blue-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">#{design.elements.length - index}</span>
                    <span className="font-medium text-sm capitalize">{element.type}</span>
                  </div>
                  <Eye size={14} className="text-gray-400" />
                </div>
                {element.text && (
                  <div className="text-xs text-gray-400 mt-1 truncate">"{element.text}"</div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(element.x)}, {Math.round(element.y)} • {Math.round(element.width)}x
                  {Math.round(element.height)}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
