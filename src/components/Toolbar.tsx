import React from 'react';
import {
  Play,
  Square,
  MousePointer2,
  Type,
  Circle,
  Image as ImageIcon,
  Target,
  XCircle,
  Hand,
  ZoomIn,
  ZoomOut,
  Download,
  Upload,
  RotateCcw,
  FileCode
} from 'lucide-react';
import { useBuilderStore } from '../store';
import { Tool } from '../types';
import { downloadPlayableHTML } from '../utils/export';

export const Toolbar: React.FC = () => {
  const { currentTool, setTool, togglePreview, isPreviewMode, zoom, setZoom, resetDesign } = useBuilderStore();

  const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: 'select', icon: <MousePointer2 size={20} />, label: 'Select' },
    { id: 'pan', icon: <Hand size={20} />, label: 'Pan' },
    { id: 'button', icon: <Square size={20} />, label: 'Button' },
    { id: 'target', icon: <Target size={20} />, label: 'Target' },
    { id: 'obstacle', icon: <XCircle size={20} />, label: 'Obstacle' },
    { id: 'rectangle', icon: <Square size={20} />, label: 'Rectangle' },
    { id: 'circle', icon: <Circle size={20} />, label: 'Circle' },
    { id: 'text', icon: <Type size={20} />, label: 'Text' },
    { id: 'image', icon: <ImageIcon size={20} />, label: 'Image' }
  ];

  const handleExport = () => {
    const { design } = useBuilderStore.getState();
    const dataStr = JSON.stringify(design, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'playable-ad-design.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const design = JSON.parse(e.target?.result as string);
            useBuilderStore.getState().loadDesign(design);
          } catch (error) {
            alert('Failed to load design file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportHTML = () => {
    const { design } = useBuilderStore.getState();
    downloadPlayableHTML(design);
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center gap-2 flex-wrap">
      <div className="flex gap-1 border-r border-gray-600 pr-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setTool(tool.id)}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              currentTool === tool.id ? 'bg-blue-600' : 'bg-gray-700'
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="flex gap-1 border-r border-gray-600 pr-2">
        <button
          onClick={() => setZoom(zoom - 0.1)}
          className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={() => setZoom(zoom + 0.1)}
          className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors text-sm"
          title="Reset Zoom"
        >
          {(zoom * 100).toFixed(0)}%
        </button>
      </div>

      <div className="flex gap-1 border-r border-gray-600 pr-2">
        <button
          onClick={togglePreview}
          className={`p-2 rounded hover:bg-gray-600 transition-colors flex items-center gap-2 ${
            isPreviewMode ? 'bg-green-600' : 'bg-gray-700'
          }`}
          title="Preview Mode"
        >
          <Play size={20} />
          <span className="text-sm">{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
        </button>
      </div>

      <div className="flex gap-1">
        <button
          onClick={handleImport}
          className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          title="Import Design (JSON)"
        >
          <Upload size={20} />
        </button>
        <button
          onClick={handleExport}
          className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          title="Export Design (JSON)"
        >
          <Download size={20} />
        </button>
        <button
          onClick={handleExportHTML}
          className="p-2 rounded bg-green-600 hover:bg-green-700 transition-colors"
          title="Export Playable HTML"
        >
          <FileCode size={20} />
        </button>
        <button
          onClick={resetDesign}
          className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          title="Reset Design"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};
