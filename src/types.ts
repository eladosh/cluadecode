export type ElementType =
  | 'button'
  | 'target'
  | 'obstacle'
  | 'image'
  | 'text'
  | 'rectangle'
  | 'circle'
  | 'cta';

export type AnimationType = 'none' | 'bounce' | 'pulse' | 'shake' | 'float' | 'spin' | 'glow';

export interface GameElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  text?: string;
  fontSize?: number;
  imageUrl?: string;
  isInteractive: boolean;
  action?: 'win' | 'lose' | 'score' | 'cta' | 'none';
  scoreValue?: number;
  zIndex: number;
  animation?: AnimationType;
  animationDuration?: number;
  ctaLink?: string;
  opacity?: number;
}

export interface GameConfig {
  width: number;
  height: number;
  backgroundColor: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
  showTimer?: boolean;
  timerDuration?: number;
  gridSize?: number;
  snapToGrid?: boolean;
}

export interface GameDesign {
  config: GameConfig;
  elements: GameElement[];
}

export type Tool = 'select' | 'pan' | ElementType;

export interface EditorState {
  design: GameDesign;
  selectedElementId: string | null;
  currentTool: Tool;
  isPreviewMode: boolean;
  zoom: number;
  pan: { x: number; y: number };
  showGrid: boolean;
  showMobileFrame: boolean;
}

export interface PlayableAdTemplate {
  id: string;
  name: string;
  description: string;
  category: 'casual' | 'puzzle' | 'action' | 'arcade';
  thumbnail?: string;
  design: GameDesign;
}
