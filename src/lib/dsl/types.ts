// Canvas Builder DSL Types
// JSON-based domain-specific language for defining UI components

export type ElementType = 
  | 'container'
  | 'text'
  | 'heading'
  | 'button'
  | 'textinput'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'image'
  | 'link'
  | 'divider';

export interface StyleProps {
  // Layout
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  display?: 'block' | 'flex' | 'grid' | 'inline' | 'inline-block';
  flexDirection?: 'row' | 'column';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  gap?: string;
  
  // Colors
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  
  // Border
  borderWidth?: string;
  borderRadius?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  
  // Typography
  fontSize?: string;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  
  // Effects
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  styles?: StyleProps;
  className?: string;
  children?: CanvasElement[];
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
}

export interface HeadingElement extends BaseElement {
  type: 'heading';
  content: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ButtonElement extends BaseElement {
  type: 'button';
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  onClick?: string; // Action identifier or URL
}

export interface TextInputElement extends BaseElement {
  type: 'textinput';
  placeholder?: string;
  label?: string;
  name: string;
  required?: boolean;
  inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
}

export interface TextareaElement extends BaseElement {
  type: 'textarea';
  placeholder?: string;
  label?: string;
  name: string;
  rows?: number;
  required?: boolean;
}

export interface CheckboxElement extends BaseElement {
  type: 'checkbox';
  label: string;
  name: string;
  checked?: boolean;
}

export interface RadioElement extends BaseElement {
  type: 'radio';
  label: string;
  name: string;
  value: string;
  checked?: boolean;
}

export interface SelectElement extends BaseElement {
  type: 'select';
  label?: string;
  name: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}

export interface LinkElement extends BaseElement {
  type: 'link';
  href: string;
  content: string;
  target?: '_blank' | '_self';
}

export interface DividerElement extends BaseElement {
  type: 'divider';
}

export interface ContainerElement extends BaseElement {
  type: 'container';
  children: CanvasElement[];
}

export type CanvasElement =
  | ContainerElement
  | TextElement
  | HeadingElement
  | ButtonElement
  | TextInputElement
  | TextareaElement
  | CheckboxElement
  | RadioElement
  | SelectElement
  | ImageElement
  | LinkElement
  | DividerElement;

// Page definition
export interface CanvasPage {
  id: string;
  slug: string;
  title: string;
  description?: string;
  elements: CanvasElement[];
  meta?: {
    createdAt: string;
    updatedAt: string;
    author?: string;
  };
}
