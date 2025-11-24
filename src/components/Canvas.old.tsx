import React, { useRef, useState, useEffect } from 'react';
import { useBuilderStore } from '../store';
import { GameElement } from '../types';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<string | null>(null);

  const {
    design,
    selectedElementId,
    currentTool,
    isPreviewMode,
    zoom,
    pan,
    addElement,
    updateElement,
    selectElement,
    setPan
  } = useBuilderStore();

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    if (currentTool !== 'select' && currentTool !== 'pan') {
      const defaultSizes: Record<string, { width: number; height: number }> = {
        button: { width: 120, height: 50 },
        target: { width: 80, height: 80 },
        obstacle: { width: 100, height: 100 },
        rectangle: { width: 150, height: 100 },
        circle: { width: 80, height: 80 },
        text: { width: 200, height: 40 },
        image: { width: 150, height: 150 }
      };

      const size = defaultSizes[currentTool] || { width: 100, height: 100 };

      addElement({
        type: currentTool,
        x: x - size.width / 2,
        y: y - size.height / 2,
        ...size,
        rotation: 0,
        color: currentTool === 'button' ? '#4CAF50' : currentTool === 'obstacle' ? '#f44336' : '#2196F3',
        text: currentTool === 'text' ? 'Sample Text' : currentTool === 'button' ? 'Click Me!' : undefined,
        fontSize: 16,
        isInteractive: currentTool === 'button' || currentTool === 'target',
        action: currentTool === 'button' ? 'win' : 'none'
      });
    } else {
      selectElement(null);
    }
  };

  const handleElementMouseDown = (e: React.MouseEvent, element: GameElement) => {
    if (isPreviewMode) return;
    e.stopPropagation();

    selectElement(element.id);
    setIsDragging(true);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    setDragOffset({
      x: x - element.x,
      y: y - element.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElementId) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    updateElement(selectedElementId, {
      x: x - dragOffset.x,
      y: y - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging, isResizing]);

  const renderElement = (element: GameElement) => {
    const isSelected = element.id === selectedElementId && !isPreviewMode;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: `rotate(${element.rotation}deg)`,
      cursor: isPreviewMode ? (element.isInteractive ? 'pointer' : 'default') : 'move',
      border: isSelected ? '2px solid #2196F3' : 'none',
      zIndex: element.zIndex
    };

    const elementStyle: React.CSSProperties = {
      ...baseStyle,
      backgroundColor: element.color,
      borderRadius: element.type === 'circle' ? '50%' : element.type === 'button' ? '8px' : '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: element.fontSize || 16,
      fontWeight: element.type === 'button' ? 'bold' : 'normal',
      boxShadow: element.type === 'button' ? '0 4px 6px rgba(0,0,0,0.3)' : 'none',
      userSelect: 'none'
    };

    return (
      <div
        key={element.id}
        style={elementStyle}
        onMouseDown={(e) => handleElementMouseDown(e, element)}
        onClick={(e) => {
          e.stopPropagation();
          if (isPreviewMode && element.isInteractive) {
            console.log(`Element clicked: ${element.type} - Action: ${element.action}`);
          }
        }}
      >
        {element.text && <span>{element.text}</span>}
        {element.imageUrl && (
          <img
            src={element.imageUrl}
            alt="Game element"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        {isSelected && !isPreviewMode && (
          <>
            <div
              style={{
                position: 'absolute',
                right: -5,
                bottom: -5,
                width: 10,
                height: 10,
                backgroundColor: '#2196F3',
                cursor: 'se-resize',
                borderRadius: '50%'
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsResizing(element.id);
              }}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div
      ref={canvasRef}
      className="relative flex-1 overflow-hidden"
      style={{ backgroundColor: '#2a2a3e' }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
    >
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          position: 'relative',
          width: design.config.width,
          height: design.config.height,
          backgroundColor: design.config.backgroundColor,
          margin: '50px auto',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}
      >
        {design.elements
          .sort((a, b) => a.zIndex - b.zIndex)
          .map(renderElement)}
      </div>

      {!isPreviewMode && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded text-sm">
          Zoom: {(zoom * 100).toFixed(0)}% | Tool: {currentTool}
        </div>
      )}
    </div>
  );
};
