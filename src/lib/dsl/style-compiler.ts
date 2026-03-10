// Compiles StyleProps to Tailwind classes + inline styles
// Tailwind can't handle arbitrary values at runtime, so we use inline styles for dynamic values
import { StyleProps } from './types';

export interface CompiledStyles {
  className: string;
  style: React.CSSProperties;
}

// Parse custom CSS string into CSSProperties object
function parseCustomCSS(css: string): React.CSSProperties {
  if (!css) return {};
  
  const style: Record<string, string> = {};
  
  // Split by semicolons and parse each property
  const declarations = css.split(';').filter(Boolean);
  
  for (const decl of declarations) {
    const colonIndex = decl.indexOf(':');
    if (colonIndex === -1) continue;
    
    const property = decl.slice(0, colonIndex).trim();
    const value = decl.slice(colonIndex + 1).trim();
    
    if (!property || !value) continue;
    
    // Convert kebab-case to camelCase
    const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    style[camelProperty] = value;
  }
  
  return style as React.CSSProperties;
}

export function compileStyles(styles?: StyleProps): CompiledStyles {
  if (!styles) return { className: '', style: {} };
  
  const classes: string[] = [];
  const inlineStyle: React.CSSProperties = {};
  
  // Position
  if (styles.position) {
    inlineStyle.position = styles.position;
  }
  
  if (styles.top) inlineStyle.top = styles.top;
  if (styles.left) inlineStyle.left = styles.left;
  if (styles.right) inlineStyle.right = styles.right;
  if (styles.bottom) inlineStyle.bottom = styles.bottom;
  if (styles.zIndex !== undefined) inlineStyle.zIndex = styles.zIndex;
  
  // Width/Height
  if (styles.width) {
    if (styles.width === '100%') classes.push('w-full');
    else if (styles.width === 'auto') classes.push('w-auto');
    else inlineStyle.width = styles.width;
  }
  
  if (styles.height) {
    if (styles.height === '100%') classes.push('h-full');
    else if (styles.height === 'auto') classes.push('h-auto');
    else inlineStyle.height = styles.height;
  }
  
  if (styles.minWidth) inlineStyle.minWidth = styles.minWidth;
  if (styles.minHeight) inlineStyle.minHeight = styles.minHeight;
  if (styles.maxWidth) inlineStyle.maxWidth = styles.maxWidth;
  if (styles.maxHeight) inlineStyle.maxHeight = styles.maxHeight;
  
  // Padding & Margin
  if (styles.padding) inlineStyle.padding = styles.padding;
  if (styles.margin) inlineStyle.margin = styles.margin;
  
  // Display
  if (styles.display) {
    const displayMap = {
      block: 'block',
      flex: 'flex',
      grid: 'grid',
      inline: 'inline',
      'inline-block': 'inline-block',
      none: 'hidden',
    };
    classes.push(displayMap[styles.display]);
  }
  
  // Flex properties
  if (styles.flexDirection) {
    classes.push(styles.flexDirection === 'row' ? 'flex-row' : 'flex-col');
  }
  
  if (styles.flexWrap === 'wrap') {
    classes.push('flex-wrap');
  }
  
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
  
  if (styles.alignItems) {
    const alignMap = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    };
    classes.push(alignMap[styles.alignItems]);
  }
  
  if (styles.gap) inlineStyle.gap = styles.gap;
  
  if (styles.overflow) {
    inlineStyle.overflow = styles.overflow;
  }
  
  // Colors - ALWAYS use inline for dynamic colors
  if (styles.backgroundColor) inlineStyle.backgroundColor = styles.backgroundColor;
  if (styles.color) inlineStyle.color = styles.color;
  if (styles.borderColor) inlineStyle.borderColor = styles.borderColor;
  
  // Border
  if (styles.borderWidth) {
    inlineStyle.borderWidth = styles.borderWidth;
    inlineStyle.borderStyle = styles.borderStyle || 'solid';
  }
  if (styles.borderRadius) inlineStyle.borderRadius = styles.borderRadius;
  if (styles.borderStyle) inlineStyle.borderStyle = styles.borderStyle;
  
  // Typography
  if (styles.fontSize) inlineStyle.fontSize = styles.fontSize;
  if (styles.fontWeight) {
    const weightMap: Record<string, number> = {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    };
    inlineStyle.fontWeight = weightMap[styles.fontWeight];
  }
  if (styles.textAlign) inlineStyle.textAlign = styles.textAlign;
  if (styles.lineHeight) inlineStyle.lineHeight = styles.lineHeight;
  if (styles.letterSpacing) inlineStyle.letterSpacing = styles.letterSpacing;
  
  // Shadow - use Tailwind for predefined values
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
  
  // Parse and merge custom CSS (applied last to allow overrides)
  if (styles.customCSS) {
    const customStyles = parseCustomCSS(styles.customCSS);
    Object.assign(inlineStyle, customStyles);
  }
  
  return {
    className: classes.join(' '),
    style: inlineStyle,
  };
}
