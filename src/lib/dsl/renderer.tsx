"use client";

import React from 'react';
import {
  CanvasElement,
  ContainerElement,
  TextElement,
  HeadingElement,
  ButtonElement,
  TextInputElement,
  TextareaElement,
  CheckboxElement,
  RadioElement,
  SelectElement,
  ImageElement,
  LinkElement,
  DividerElement,
} from './types';
import { compileStyles } from './style-compiler';

// Element Renderers
function renderContainer(element: ContainerElement): React.ReactNode {
  const styles = compileStyles(element.styles);
  return (
    <div
      key={element.id}
      className={`${styles} ${element.className || ''}`}
    >
      {element.children?.map(renderElement)}
    </div>
  );
}

function renderText(element: TextElement): React.ReactNode {
  const styles = compileStyles(element.styles);
  return (
    <p
      key={element.id}
      className={`${styles} ${element.className || ''}`}
    >
      {element.content}
    </p>
  );
}

function renderHeading(element: HeadingElement): React.ReactNode {
  const styles = compileStyles(element.styles);
  const Tag = `h${element.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const sizeClasses = {
    1: 'text-4xl font-bold',
    2: 'text-3xl font-bold',
    3: 'text-2xl font-semibold',
    4: 'text-xl font-semibold',
    5: 'text-lg font-medium',
    6: 'text-base font-medium',
  };
  return (
    <Tag
      key={element.id}
      className={`${sizeClasses[element.level]} ${styles} ${element.className || ''}`}
    >
      {element.content}
    </Tag>
  );
}

function renderButton(element: ButtonElement): React.ReactNode {
  const styles = compileStyles(element.styles);
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-blue-600 hover:bg-blue-50',
  };
  const variant = element.variant || 'primary';
  
  const handleClick = () => {
    if (element.onClick) {
      if (element.onClick.startsWith('http')) {
        window.open(element.onClick, '_blank');
      } else {
        // Custom action handling
        console.log('Action:', element.onClick);
      }
    }
  };
  
  return (
    <button
      key={element.id}
      onClick={handleClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${variantClasses[variant]} ${styles} ${element.className || ''}`}
    >
      {element.label}
    </button>
  );
}

function renderTextInput(element: TextInputElement): React.ReactNode {
  const styles = compileStyles(element.styles);
  return (
    <div key={element.id} className="flex flex-col gap-1">
      {element.label && (
        <label htmlFor={element.name} className="text-sm font-medium text-gray-700">
          {element.label}
          {element.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={element.inputType || 'text'}
        id={element.name}
        name={element.name}
        placeholder={element.placeholder}
        required={element.required}
        className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${styles} ${element.className || ''}`}
      />
    </div>
  );
}

function renderTextarea(element: TextareaElement): React.ReactNode {
  const styles = compileStyles(element.styles);
  return (
    <div key={element.id} className="flex flex-col gap-1">
      {element.label && (
        <label htmlFor={element.name} className="text-sm font-medium text-gray-700">
          {element.label}
          {element.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={element.name}
        name={element.name}
        placeholder={element.placeholder}
        rows={element.rows || 4}
        required={element.required}
        className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y ${styles} ${element.className || ''}`}
      />
    </div>
  );
}

function renderCheckbox(element: CheckboxElement): React.ReactNode {
  const styles = compileStyles(element.styles);
  return (
    <label
      key={element.id}
      className={`flex items-center gap-2 cursor-pointer ${styles} ${element.className || ''}`}
    >
      <input
        type="checkbox"
        name={element.name}
        defaultChecked={element.checked}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span className="text-gray-700">{element.label}</span>
    </label>
  );
}

function renderRadio(element: RadioElement): React.ReactNode {
  const styles = compileStyles(element.styles);
  return (
    <label
      key={element.id}
      className={`flex items-center gap-2 cursor-pointer ${styles} ${element.className || ''}`}
    >
      <input
        type="radio"
        name={element.name}
        value={element.value}
        defaultChecked={element.checked}
        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
      />
      <span className="text-gray-700">{element.label}</span>
    </label>
  );
}

function renderSelect(element: SelectElement): React.ReactNode {
  const styles = compileStyles(element.styles);
  return (
    <div key={element.id} className="flex flex-col gap-1">
      {element.label && (
        <label htmlFor={element.name} className="text-sm font-medium text-gray-700">
          {element.label}
          {element.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={element.name}
        name={element.name}
        required={element.required}
        className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${styles} ${element.className || ''}`}
      >
        {element.placeholder && (
          <option value="" disabled>
            {element.placeholder}
          </option>
        )}
        {element.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function renderImage(element: ImageElement): React.ReactNode {
  const styles = compileStyles(element.styles);
  const fitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
  };
  return (
    <img
      key={element.id}
      src={element.src}
      alt={element.alt}
      className={`${fitClasses[element.objectFit || 'cover']} ${styles} ${element.className || ''}`}
    />
  );
}

function renderLink(element: LinkElement): React.ReactNode {
  const styles = compileStyles(element.styles);
  return (
    <a
      key={element.id}
      href={element.href}
      target={element.target || '_self'}
      rel={element.target === '_blank' ? 'noopener noreferrer' : undefined}
      className={`text-blue-600 hover:underline ${styles} ${element.className || ''}`}
    >
      {element.content}
    </a>
  );
}

function renderDivider(element: DividerElement): React.ReactNode {
  const styles = compileStyles(element.styles);
  return (
    <hr
      key={element.id}
      className={`border-t border-gray-200 my-4 ${styles} ${element.className || ''}`}
    />
  );
}

// Main render function
export function renderElement(element: CanvasElement): React.ReactNode {
  switch (element.type) {
    case 'container':
      return renderContainer(element);
    case 'text':
      return renderText(element);
    case 'heading':
      return renderHeading(element);
    case 'button':
      return renderButton(element);
    case 'textinput':
      return renderTextInput(element);
    case 'textarea':
      return renderTextarea(element);
    case 'checkbox':
      return renderCheckbox(element);
    case 'radio':
      return renderRadio(element);
    case 'select':
      return renderSelect(element);
    case 'image':
      return renderImage(element);
    case 'link':
      return renderLink(element);
    case 'divider':
      return renderDivider(element);
    default:
      console.warn('Unknown element type:', (element as CanvasElement).type);
      return null;
  }
}

// Page renderer component
interface CanvasRendererProps {
  elements: CanvasElement[];
  className?: string;
}

export function CanvasRenderer({ elements, className }: CanvasRendererProps) {
  return (
    <div className={className}>
      {elements.map(renderElement)}
    </div>
  );
}
