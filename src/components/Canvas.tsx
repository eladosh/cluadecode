import React, { useRef, useState, useEffect } from 'react';
import { useBuilderStore } from '../store';
import { GameElement, AnimationType } from '../types';

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
    showGrid,
    showMobileFrame,
    addElement,
    updateElement,
    selectElement
  } = useBuilderStore();

  const snapToGrid = (value: number): number => {
    if (!design.config.snapToGrid || !design.config.gridSize) return value;
    const gridSize = design.config.gridSize;
    return Math.round(value / gridSize) * gridSize;
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    let x = (e.clientX - rect.left - pan.x) / zoom;
    let y = (e.clientY - rect.top - pan.y) / zoom;

    if (currentTool !== 'select' && currentTool !== 'pan') {
      const defaultSizes: Record<string, { width: number; height: number }> = {
        button: { width: 120, height: 50 },
        target: { width: 80, height: 80 },
        obstacle: { width: 100, height: 100 },
        rectangle: { width: 150, height: 100 },
        circle: { width: 80, height: 80 },
        text: { width: 200, height: 40 },
        image: { width: 150, height: 150 },
        cta: { width: 200, height: 60 }
      };

      const size = defaultSizes[currentTool] || { width: 100, height: 100 };

      x = snapToGrid(x - size.width / 2);
      y = snapToGrid(y - size.height / 2);

      const colorMap: Record<string, string> = {
        button: '#4CAF50',
        cta: '#FF9800',
        obstacle: '#f44336',
        target: '#FFD700',
        text: 'transparent',
        image: '#666666',
        rectangle: '#2196F3',
        circle: '#9C27B0'
      };

      const textMap: Record<string, string | undefined> = {
        text: 'Sample Text',
        button: 'Click Me!',
        cta: design.config.ctaText || 'Download Now'
      };

      addElement({
        type: currentTool,
        x,
        y,
        ...size,
        rotation: 0,
        color: colorMap[currentTool] || '#2196F3',
        text: textMap[currentTool],
        fontSize: currentTool === 'cta' ? 18 : 16,
        isInteractive: ['button', 'target', 'cta', 'obstacle'].includes(currentTool),
        action: currentTool === 'button' ? 'win' : currentTool === 'cta' ? 'cta' : currentTool === 'obstacle' ? 'lose' : 'none',
        animation: currentTool === 'cta' ? 'pulse' : 'none',
        animationDuration: 2,
        ctaLink: currentTool === 'cta' ? (design.config.ctaUrl || '') : undefined,
        opacity: 1
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

    let x = (e.clientX - rect.left - pan.x) / zoom;
    let y = (e.clientY - rect.top - pan.y) / zoom;

    x = snapToGrid(x - dragOffset.x);
    y = snapToGrid(y - dragOffset.y);

    updateElement(selectedElementId, { x, y });
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

  const getAnimationCSS = (animation?: AnimationType): string => {
    if (!animation || animation === 'none') return '';

    const animations = {
      bounce: 'bounce 1s ease-in-out infinite',
      pulse: 'pulse 2s ease-in-out infinite',
      shake: 'shake 0.5s ease-in-out infinite',
      float: 'float 3s ease-in-out infinite',
      spin: 'spin 3s linear infinite',
      glow: 'glow 2s ease-in-out infinite'
    };

    return animations[animation] || '';
  };

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
      zIndex: element.zIndex,
      opacity: element.opacity ?? 1
    };

    const elementStyle: React.CSSProperties = {
      ...baseStyle,
      backgroundColor: element.color,
      borderRadius: element.type === 'circle' ? '50%' : element.type === 'button' || element.type === 'cta' ? '8px' : '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: element.fontSize || 16,
      fontWeight: element.type === 'button' || element.type === 'cta' ? 'bold' : 'normal',
      boxShadow: element.type === 'button' || element.type === 'cta' ? '0 4px 6px rgba(0,0,0,0.3)' : 'none',
      userSelect: 'none',
      animation: isPreviewMode ? getAnimationCSS(element.animation) : 'none'
    };

    return (
      <div
        key={element.id}
        style={elementStyle}
        onMouseDown={(e) => handleElementMouseDown(e, element)}
        onClick={(e) => {
          e.stopPropagation();
          if (isPreviewMode && element.isInteractive) {
            if (element.action === 'cta' && element.ctaLink) {
              window.open(element.ctaLink, '_blank');
            }
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
        )}
      </div>
    );
  };

  const renderGrid = () => {
    if (!showGrid || !design.config.gridSize) return null;

    const gridSize = design.config.gridSize;
    const cols = Math.ceil(design.config.width / gridSize);
    const rows = Math.ceil(design.config.height / gridSize);

    return (
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.3
        }}
      >
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * gridSize}
            y1={0}
            x2={i * gridSize}
            y2={design.config.height}
            stroke="#888"
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: rows + 1 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * gridSize}
            x2={design.config.width}
            y2={i * gridSize}
            stroke="#888"
            strokeWidth="0.5"
          />
        ))}
      </svg>
    );
  };

  const canvasContent = (
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
      {renderGrid()}
      {design.elements
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(renderElement)}
    </div>
  );

  return (
    <div
      ref={canvasRef}
      className="relative flex-1 overflow-hidden"
      style={{ backgroundColor: '#2a2a3e' }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
    >
      {showMobileFrame && (design.config.width <= 480 && design.config.height <= 900) ? (
        <div className="flex items-center justify-center h-full">
          <div
            className="relative bg-gray-900 rounded-3xl p-4 shadow-2xl"
            style={{
              width: design.config.width + 40,
              height: design.config.height + 80
            }}
          >
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gray-800 rounded-full" />
            {canvasContent}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-800 rounded-full" />
          </div>
        </div>
      ) : (
        canvasContent
      )}

      {!isPreviewMode && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded text-sm space-y-1">
          <div>Zoom: {(zoom * 100).toFixed(0)}%</div>
          <div>Tool: {currentTool}</div>
          {design.config.snapToGrid && <div>Grid: {design.config.gridSize}px</div>}
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
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
      `}</style>
    </div>
  );
};
