// Compiles StyleProps to Tailwind classes
import { StyleProps } from './types';

export function compileStyles(styles?: StyleProps): string {
  if (!styles) return '';
  
  const classes: string[] = [];
  
  // Width
  if (styles.width) {
    if (styles.width === '100%') classes.push('w-full');
    else if (styles.width === 'auto') classes.push('w-auto');
    else classes.push(`w-[${styles.width}]`);
  }
  
  // Height
  if (styles.height) {
    if (styles.height === '100%') classes.push('h-full');
    else if (styles.height === 'auto') classes.push('h-auto');
    else classes.push(`h-[${styles.height}]`);
  }
  
  // Padding
  if (styles.padding) {
    classes.push(`p-[${styles.padding}]`);
  }
  
  // Margin
  if (styles.margin) {
    classes.push(`m-[${styles.margin}]`);
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
  
  // Gap
  if (styles.gap) {
    classes.push(`gap-[${styles.gap}]`);
  }
  
  // Background color
  if (styles.backgroundColor) {
    if (styles.backgroundColor.startsWith('#')) {
      classes.push(`bg-[${styles.backgroundColor}]`);
    } else {
      classes.push(`bg-${styles.backgroundColor}`);
    }
  }
  
  // Text color
  if (styles.color) {
    if (styles.color.startsWith('#')) {
      classes.push(`text-[${styles.color}]`);
    } else {
      classes.push(`text-${styles.color}`);
    }
  }
  
  // Border color
  if (styles.borderColor) {
    if (styles.borderColor.startsWith('#')) {
      classes.push(`border-[${styles.borderColor}]`);
    } else {
      classes.push(`border-${styles.borderColor}`);
    }
  }
  
  // Border width
  if (styles.borderWidth) {
    if (styles.borderWidth === '1px') classes.push('border');
    else if (styles.borderWidth === '2px') classes.push('border-2');
    else classes.push(`border-[${styles.borderWidth}]`);
  }
  
  // Border radius
  if (styles.borderRadius) {
    const radiusMap: Record<string, string> = {
      '0': 'rounded-none',
      '4px': 'rounded',
      '8px': 'rounded-lg',
      '12px': 'rounded-xl',
      '16px': 'rounded-2xl',
      '9999px': 'rounded-full',
    };
    classes.push(radiusMap[styles.borderRadius] || `rounded-[${styles.borderRadius}]`);
  }
  
  // Border style
  if (styles.borderStyle) {
    if (styles.borderStyle !== 'solid') {
      classes.push(`border-${styles.borderStyle}`);
    }
  }
  
  // Font size
  if (styles.fontSize) {
    const sizeMap: Record<string, string> = {
      '12px': 'text-xs',
      '14px': 'text-sm',
      '16px': 'text-base',
      '18px': 'text-lg',
      '20px': 'text-xl',
      '24px': 'text-2xl',
      '30px': 'text-3xl',
      '36px': 'text-4xl',
    };
    classes.push(sizeMap[styles.fontSize] || `text-[${styles.fontSize}]`);
  }
  
  // Font weight
  if (styles.fontWeight) {
    const weightMap = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };
    classes.push(weightMap[styles.fontWeight]);
  }
  
  // Text align
  if (styles.textAlign) {
    classes.push(`text-${styles.textAlign}`);
  }
  
  // Shadow
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
    classes.push(`opacity-[${styles.opacity}]`);
  }
  
  return classes.join(' ');
}
