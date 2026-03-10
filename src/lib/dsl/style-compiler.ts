// Compiles StyleProps to Tailwind classes + inline styles
// Tailwind can't handle arbitrary values at runtime, so we use inline styles for dynamic values
import { StyleProps } from './types';

export interface CompiledStyles {
  className: string;
  style: React.CSSProperties;
}

export function compileStyles(styles?: StyleProps): CompiledStyles {
  if (!styles) return { className: '', style: {} };
  
  const classes: string[] = [];
  const inlineStyle: React.CSSProperties = {};
  
  // Width
  if (styles.width) {
    if (styles.width === '100%') classes.push('w-full');
    else if (styles.width === 'auto') classes.push('w-auto');
    else inlineStyle.width = styles.width;
  }
  
  // Height
  if (styles.height) {
    if (styles.height === '100%') classes.push('h-full');
    else if (styles.height === 'auto') classes.push('h-auto');
    else inlineStyle.height = styles.height;
  }
  
  // Padding - use inline for custom values
  if (styles.padding) {
    inlineStyle.padding = styles.padding;
  }
  
  // Margin - use inline for custom values
  if (styles.margin) {
    inlineStyle.margin = styles.margin;
  }
  
  // Display
  if (styles.display) {
    const displayMap = {
      block: 'block',
      flex: 'flex',
      grid: 'grid',
      inline: 'inline',
      'inline-block': 'inline-block',
    };
    classes.push(displayMap[styles.display]);
  }
  
  // Flex direction
  if (styles.flexDirection) {
    classes.push(styles.flexDirection === 'row' ? 'flex-row' : 'flex-col');
  }
  
  // Justify content
  if (styles.justifyContent) {
    const justifyMap = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    };
    classes.push(justifyMap[styles.justifyContent]);
  }
  
  // Align items
  if (styles.alignItems) {
    const alignMap = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    };
    classes.push(alignMap[styles.alignItems]);
  }
  
  // Gap - use inline
  if (styles.gap) {
    inlineStyle.gap = styles.gap;
  }
  
  // Background color - ALWAYS use inline for dynamic colors
  if (styles.backgroundColor) {
    inlineStyle.backgroundColor = styles.backgroundColor;
  }
  
  // Text color - ALWAYS use inline for dynamic colors
  if (styles.color) {
    inlineStyle.color = styles.color;
  }
  
  // Border color - use inline
  if (styles.borderColor) {
    inlineStyle.borderColor = styles.borderColor;
  }
  
  // Border width - use inline
  if (styles.borderWidth) {
    inlineStyle.borderWidth = styles.borderWidth;
    inlineStyle.borderStyle = styles.borderStyle || 'solid';
  }
  
  // Border radius - use inline
  if (styles.borderRadius) {
    inlineStyle.borderRadius = styles.borderRadius;
  }
  
  // Border style
  if (styles.borderStyle) {
    inlineStyle.borderStyle = styles.borderStyle;
  }
  
  // Font size - use inline
  if (styles.fontSize) {
    inlineStyle.fontSize = styles.fontSize;
  }
  
  // Font weight
  if (styles.fontWeight) {
    const weightMap: Record<string, number> = {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    };
    inlineStyle.fontWeight = weightMap[styles.fontWeight];
  }
  
  // Text align
  if (styles.textAlign) {
    inlineStyle.textAlign = styles.textAlign;
  }
  
  // Shadow - use Tailwind for these predefined values
  if (styles.shadow && styles.shadow !== 'none') {
    const shadowMap = {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    };
    classes.push(shadowMap[styles.shadow]);
  }
  
  // Opacity
  if (styles.opacity !== undefined && styles.opacity !== 1) {
    inlineStyle.opacity = styles.opacity;
  }
  
  return {
    className: classes.join(' '),
    style: inlineStyle,
  };
}
