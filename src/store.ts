import { create } from 'zustand';
import { GameElement, GameDesign, Tool, EditorState } from './types';

interface BuilderStore extends EditorState {
  addElement: (element: Omit<GameElement, 'id' | 'zIndex'>) => void;
  updateElement: (id: string, updates: Partial<GameElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setTool: (tool: Tool) => void;
  togglePreview: () => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  updateConfig: (updates: Partial<GameDesign['config']>) => void;
  loadDesign: (design: GameDesign) => void;
  resetDesign: () => void;
  duplicateElement: (id: string) => void;
  moveElementUp: (id: string) => void;
  moveElementDown: (id: string) => void;
  toggleGrid: () => void;
  toggleMobileFrame: () => void;
}

const defaultDesign: GameDesign = {
  config: {
    width: 640,
    height: 960,
    backgroundColor: '#1a1a2e',
    title: 'New Playable Ad',
    description: 'Design your game mechanic here',
    ctaText: 'Download Now',
    ctaUrl: '',
    snapToGrid: false,
    gridSize: 20
  },
  elements: []
};

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  design: defaultDesign,
  selectedElementId: null,
  currentTool: 'select',
  isPreviewMode: false,
  zoom: 1,
  pan: { x: 0, y: 0 },
  showGrid: false,
  showMobileFrame: false,

  addElement: (element) => {
    const maxZIndex = Math.max(0, ...get().design.elements.map(e => e.zIndex));
    const newElement: GameElement = {
      ...element,
      id: `element-${Date.now()}-${Math.random()}`,
      zIndex: maxZIndex + 1
    };
    set((state) => ({
      design: {
        ...state.design,
        elements: [...state.design.elements, newElement]
      },
      selectedElementId: newElement.id
    }));
  },

  updateElement: (id, updates) => {
    set((state) => ({
      design: {
        ...state.design,
        elements: state.design.elements.map((el) =>
          el.id === id ? { ...el, ...updates } : el
        )
      }
    }));
  },

  deleteElement: (id) => {
    set((state) => ({
      design: {
        ...state.design,
        elements: state.design.elements.filter((el) => el.id !== id)
      },
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
    }));
  },

  selectElement: (id) => {
    set({ selectedElementId: id, currentTool: 'select' });
  },

  setTool: (tool) => {
    set({ currentTool: tool, selectedElementId: tool === 'select' ? get().selectedElementId : null });
  },

  togglePreview: () => {
    set((state) => ({ isPreviewMode: !state.isPreviewMode }));
  },

  setZoom: (zoom) => {
    set({ zoom: Math.max(0.1, Math.min(3, zoom)) });
  },

  setPan: (pan) => {
    set({ pan });
  },

  updateConfig: (updates) => {
    set((state) => ({
      design: {
        ...state.design,
        config: { ...state.design.config, ...updates }
      }
    }));
  },

  loadDesign: (design) => {
    set({ design, selectedElementId: null, isPreviewMode: false });
  },

  resetDesign: () => {
    set({
      design: defaultDesign,
      selectedElementId: null,
      currentTool: 'select',
      isPreviewMode: false,
      zoom: 1,
      pan: { x: 0, y: 0 }
    });
  },

  duplicateElement: (id) => {
    const element = get().design.elements.find(e => e.id === id);
    if (element) {
      const maxZIndex = Math.max(0, ...get().design.elements.map(e => e.zIndex));
      const newElement: GameElement = {
        ...element,
        id: `element-${Date.now()}-${Math.random()}`,
        x: element.x + 20,
        y: element.y + 20,
        zIndex: maxZIndex + 1
      };
      set((state) => ({
        design: {
          ...state.design,
          elements: [...state.design.elements, newElement]
        },
        selectedElementId: newElement.id
      }));
    }
  },

  moveElementUp: (id) => {
    const elements = get().design.elements;
    const index = elements.findIndex(e => e.id === id);
    if (index < elements.length - 1) {
      const newElements = [...elements];
      [newElements[index].zIndex, newElements[index + 1].zIndex] =
        [newElements[index + 1].zIndex, newElements[index].zIndex];
      set((state) => ({
        design: { ...state.design, elements: newElements }
      }));
    }
  },

  moveElementDown: (id) => {
    const elements = get().design.elements;
    const index = elements.findIndex(e => e.id === id);
    if (index > 0) {
      const newElements = [...elements];
      [newElements[index].zIndex, newElements[index - 1].zIndex] =
        [newElements[index - 1].zIndex, newElements[index].zIndex];
      set((state) => ({
        design: { ...state.design, elements: newElements }
      }));
    }
  },

  toggleGrid: () => {
    set((state) => ({ showGrid: !state.showGrid }));
  },

  toggleMobileFrame: () => {
    set((state) => ({ showMobileFrame: !state.showMobileFrame }));
  }
}));
