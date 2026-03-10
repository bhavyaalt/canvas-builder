"use client";

import { useState, useCallback } from 'react';
import { CanvasElement, ElementType, CanvasPage } from '@/lib/dsl/types';
import { CanvasRenderer } from '@/lib/dsl/renderer';

// Element templates
const elementTemplates: Record<ElementType, () => Omit<CanvasElement, 'id'>> = {
  container: () => ({
    type: 'container',
    styles: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
    children: [],
  }),
  text: () => ({
    type: 'text',
    content: 'Enter your text here',
  }),
  heading: () => ({
    type: 'heading',
    level: 2,
    content: 'Heading',
  }),
  button: () => ({
    type: 'button',
    label: 'Button',
    variant: 'primary',
  }),
  textinput: () => ({
    type: 'textinput',
    name: 'input',
    label: 'Label',
    placeholder: 'Enter text...',
  }),
  textarea: () => ({
    type: 'textarea',
    name: 'textarea',
    label: 'Label',
    placeholder: 'Enter text...',
    rows: 4,
  }),
  checkbox: () => ({
    type: 'checkbox',
    name: 'checkbox',
    label: 'Checkbox label',
  }),
  radio: () => ({
    type: 'radio',
    name: 'radio',
    value: 'option1',
    label: 'Radio option',
  }),
  select: () => ({
    type: 'select',
    name: 'select',
    label: 'Select',
    placeholder: 'Choose an option',
    options: [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ],
  }),
  image: () => ({
    type: 'image',
    src: 'https://placehold.co/400x200',
    alt: 'Placeholder image',
  }),
  link: () => ({
    type: 'link',
    href: '#',
    content: 'Link text',
  }),
  divider: () => ({
    type: 'divider',
  }),
};

const elementLabels: Record<ElementType, string> = {
  container: '📦 Container',
  text: '📝 Text',
  heading: '🔤 Heading',
  button: '🔘 Button',
  textinput: '✏️ Text Input',
  textarea: '📄 Textarea',
  checkbox: '☑️ Checkbox',
  radio: '⭕ Radio',
  select: '📋 Select',
  image: '🖼️ Image',
  link: '🔗 Link',
  divider: '➖ Divider',
};

function generateId(): string {
  return `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function EditorPage() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('My Page');
  const [pageSlug, setPageSlug] = useState('my-page');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const addElement = useCallback((type: ElementType) => {
    const template = elementTemplates[type]();
    const newElement = {
      ...template,
      id: generateId(),
    } as CanvasElement;
    
    setElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
  }, []);

  const removeElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const moveElement = useCallback((id: string, direction: 'up' | 'down') => {
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;
      
      const newElements = [...prev];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newElements[index], newElements[swapIndex]] = [newElements[swapIndex], newElements[index]];
      return newElements;
    });
  }, []);

  const updateElement = useCallback((id: string, updates: Record<string, unknown>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } as CanvasElement : el))
    );
  }, []);

  const savePage = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: pageSlug,
          title: pageTitle,
          elements,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }
      
      setMessage({ type: 'success', text: `Page saved! View at /p/${pageSlug}` });
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const exportJson = () => {
    const page: Omit<CanvasPage, 'id' | 'meta'> = {
      slug: pageSlug,
      title: pageTitle,
      elements,
    };
    const blob = new Blob([JSON.stringify(page, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pageSlug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const page = JSON.parse(event.target?.result as string);
        if (page.elements) setElements(page.elements);
        if (page.title) setPageTitle(page.title);
        if (page.slug) setPageSlug(page.slug);
        setMessage({ type: 'success', text: 'Page imported!' });
      } catch {
        setMessage({ type: 'error', text: 'Invalid JSON file' });
      }
    };
    reader.readAsText(file);
  };

  const selectedElement = elements.find((el) => el.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar - Elements */}
      <div className="w-64 bg-white border-r p-4 flex flex-col">
        <h2 className="font-bold text-lg mb-4 text-gray-900">Elements</h2>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(elementTemplates) as ElementType[]).map((type) => (
            <button
              key={type}
              onClick={() => addElement(type)}
              style={{
                padding: '8px',
                fontSize: '11px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                textAlign: 'left',
                color: '#1f2937',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#dbeafe';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              {elementLabels[type]}
            </button>
          ))}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-200 space-y-2">
          <button
            onClick={exportJson}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '14px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            📥 Export JSON
          </button>
          <label 
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 12px',
              fontSize: '14px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              color: '#374151',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            📤 Import JSON
            <input type="file" accept=".json" onChange={importJson} className="hidden" />
          </label>
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b p-4 flex items-center gap-4">
          <input
            type="text"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            className="text-lg font-semibold border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none px-1"
            placeholder="Page Title"
          />
          <div className="flex items-center gap-1 text-gray-500">
            <span>/p/</span>
            <input
              type="text"
              value={pageSlug}
              onChange={(e) => setPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              className="border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none px-1"
              placeholder="page-slug"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {message && (
              <span className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </span>
            )}
            <button
              onClick={savePage}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Page'}
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg min-h-[600px]">
            {elements.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 p-8">
                <div className="text-center">
                  <p className="text-xl mb-2">🎨 Your canvas is empty</p>
                  <p className="text-sm">Click an element from the left panel to start building</p>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {elements.map((element) => (
                  <div
                    key={element.id}
                    onClick={() => setSelectedId(element.id)}
                    className={`relative group cursor-pointer ${
                      selectedId === element.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                  >
                    <CanvasRenderer elements={[element]} />
                    <div className="absolute top-0 right-0 hidden group-hover:flex gap-1 p-1 bg-white rounded shadow">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveElement(element.id, 'up'); }}
                        className="p-1 hover:bg-gray-100 rounded text-xs"
                      >
                        ↑
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveElement(element.id, 'down'); }}
                        className="p-1 hover:bg-gray-100 rounded text-xs"
                      >
                        ↓
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeElement(element.id); }}
                        className="p-1 hover:bg-red-100 text-red-600 rounded text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-72 bg-white border-l p-4">
        <h2 className="font-bold text-lg mb-4">Properties</h2>
        {selectedElement ? (
          <ElementProperties
            element={selectedElement}
            onChange={(updates) => updateElement(selectedId!, updates)}
          />
        ) : (
          <p className="text-gray-500 text-sm">Select an element to edit its properties</p>
        )}
      </div>
    </div>
  );
}

// Properties panel component
function ElementProperties({
  element,
  onChange,
}: {
  element: CanvasElement;
  onChange: (updates: Record<string, unknown>) => void;
}) {
  const updateStyle = (key: string, value: string) => {
    onChange({
      styles: { ...element.styles, [key]: value || undefined },
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-2">Type: {element.type}</div>
      
      {/* Content fields based on type */}
      {'content' in element && (
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            value={(element as { content: string }).content}
            onChange={(e) => onChange({ content: e.target.value } )}
            className="w-full px-3 py-2 border rounded text-sm"
            rows={3}
          />
        </div>
      )}
      
      {'label' in element && element.type !== 'checkbox' && element.type !== 'radio' && (
        <div>
          <label className="block text-sm font-medium mb-1">Label</label>
          <input
            type="text"
            value={(element as { label: string }).label}
            onChange={(e) => onChange({ label: e.target.value } )}
            className="w-full px-3 py-2 border rounded text-sm"
          />
        </div>
      )}

      {'placeholder' in element && (
        <div>
          <label className="block text-sm font-medium mb-1">Placeholder</label>
          <input
            type="text"
            value={(element as { placeholder?: string }).placeholder || ''}
            onChange={(e) => onChange({ placeholder: e.target.value } )}
            className="w-full px-3 py-2 border rounded text-sm"
          />
        </div>
      )}

      {'src' in element && (
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            value={(element as { src: string }).src}
            onChange={(e) => onChange({ src: e.target.value } )}
            className="w-full px-3 py-2 border rounded text-sm"
          />
        </div>
      )}

      {'href' in element && (
        <div>
          <label className="block text-sm font-medium mb-1">Link URL</label>
          <input
            type="text"
            value={(element as { href: string }).href}
            onChange={(e) => onChange({ href: e.target.value } )}
            className="w-full px-3 py-2 border rounded text-sm"
          />
        </div>
      )}

      {element.type === 'heading' && (
        <div>
          <label className="block text-sm font-medium mb-1">Level</label>
          <select
            value={(element as { level: number }).level}
            onChange={(e) => onChange({ level: parseInt(e.target.value) } )}
            className="w-full px-3 py-2 border rounded text-sm"
          >
            {[1, 2, 3, 4, 5, 6].map((l) => (
              <option key={l} value={l}>H{l}</option>
            ))}
          </select>
        </div>
      )}

      {element.type === 'button' && (
        <div>
          <label className="block text-sm font-medium mb-1">Variant</label>
          <select
            value={(element as { variant?: string }).variant || 'primary'}
            onChange={(e) => onChange({ variant: e.target.value } )}
            className="w-full px-3 py-2 border rounded text-sm"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
            <option value="ghost">Ghost</option>
          </select>
        </div>
      )}

      {/* Basic style controls */}
      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium text-sm mb-2">Styles</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Background Color</label>
            <input
              type="color"
              value={element.styles?.backgroundColor || '#ffffff'}
              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Text Color</label>
            <input
              type="color"
              value={element.styles?.color || '#000000'}
              onChange={(e) => updateStyle('color', e.target.value)}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Padding</label>
            <input
              type="text"
              value={element.styles?.padding || ''}
              onChange={(e) => updateStyle('padding', e.target.value)}
              placeholder="e.g., 16px"
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Border Radius</label>
            <input
              type="text"
              value={element.styles?.borderRadius || ''}
              onChange={(e) => updateStyle('borderRadius', e.target.value)}
              placeholder="e.g., 8px"
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Text Align</label>
            <select
              value={element.styles?.textAlign || ''}
              onChange={(e) => updateStyle('textAlign', e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
            >
              <option value="">Default</option>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
