export type ElementType =
  | 'button'
  | 'target'
  | 'obstacle'
  | 'image'
  | 'text'
  | 'rectangle'
  | 'circle';

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
  action?: 'win' | 'lose' | 'score' | 'none';
  scoreValue?: number;
  zIndex: number;
}

export interface GameConfig {
  width: number;
  height: number;
  backgroundColor: string;
  title: string;
  description: string;
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
}
