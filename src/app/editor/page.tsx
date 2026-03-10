"use client";

import { useState, useCallback } from 'react';
import { CanvasElement, ElementType, CanvasPage } from '@/lib/dsl/types';
import { CanvasRenderer } from '@/lib/dsl/renderer';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// Sortable element wrapper
function SortableElement({
  element,
  isSelected,
  onSelect,
  onRemove,
}: {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={isSelected ? 'ring-2 ring-blue-500 ring-offset-2 rounded' : ''}
    >
      {/* Drag handle + element */}
      <div className="group relative">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          style={{
            position: 'absolute',
            left: '-28px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '4px',
            cursor: 'grab',
            color: '#9ca3af',
            opacity: 0,
            transition: 'opacity 0.15s',
          }}
          className="group-hover:opacity-100"
        >
          ⋮⋮
        </div>
        
        {/* Element content */}
        <CanvasRenderer elements={[element]} />
        
        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            padding: '4px 8px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#dc2626',
            cursor: 'pointer',
            opacity: 0,
            transition: 'opacity 0.15s',
          }}
          className="group-hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
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

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setElements((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
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
              <div className="p-4 pl-10">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={elements.map((e) => e.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {elements.map((element) => (
                        <SortableElement
                          key={element.id}
                          element={element}
                          isSelected={selectedId === element.id}
                          onSelect={() => setSelectedId(element.id)}
                          onRemove={() => removeElement(element.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div style={{ width: '288px', backgroundColor: 'white', borderLeft: '1px solid #e5e7eb', padding: '16px' }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '16px', color: '#111827' }}>Properties</h2>
        {selectedElement ? (
          <ElementProperties
            element={selectedElement}
            onChange={(updates) => updateElement(selectedId!, updates)}
          />
        ) : (
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Select an element to edit its properties</p>
        )}
      </div>
    </div>
  );
}

// Styles for properties panel
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '4px',
  color: '#374151',
};

const smallLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  marginBottom: '4px',
  color: '#4b5563',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px',
  color: '#111827',
  backgroundColor: '#ffffff',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
};

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
        <strong>Type:</strong> {element.type}
      </div>
      
      {/* Content fields based on type */}
      {'content' in element && (
        <div>
          <label style={labelStyle}>Content</label>
          <textarea
            value={(element as { content: string }).content}
            onChange={(e) => onChange({ content: e.target.value })}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
            rows={3}
          />
        </div>
      )}
      
      {'label' in element && element.type !== 'checkbox' && element.type !== 'radio' && (
        <div>
          <label style={labelStyle}>Label</label>
          <input
            type="text"
            value={(element as { label: string }).label}
            onChange={(e) => onChange({ label: e.target.value })}
            style={inputStyle}
          />
        </div>
      )}

      {'placeholder' in element && (
        <div>
          <label style={labelStyle}>Placeholder</label>
          <input
            type="text"
            value={(element as { placeholder?: string }).placeholder || ''}
            onChange={(e) => onChange({ placeholder: e.target.value })}
            style={inputStyle}
          />
        </div>
      )}

      {'src' in element && (
        <div>
          <label style={labelStyle}>Image URL</label>
          <input
            type="text"
            value={(element as { src: string }).src}
            onChange={(e) => onChange({ src: e.target.value })}
            style={inputStyle}
          />
        </div>
      )}

      {'href' in element && (
        <div>
          <label style={labelStyle}>Link URL</label>
          <input
            type="text"
            value={(element as { href: string }).href}
            onChange={(e) => onChange({ href: e.target.value })}
            style={inputStyle}
          />
        </div>
      )}

      {element.type === 'heading' && (
        <div>
          <label style={labelStyle}>Level</label>
          <select
            value={(element as { level: number }).level}
            onChange={(e) => onChange({ level: parseInt(e.target.value) })}
            style={selectStyle}
          >
            {[1, 2, 3, 4, 5, 6].map((l) => (
              <option key={l} value={l}>H{l}</option>
            ))}
          </select>
        </div>
      )}

      {element.type === 'button' && (
        <div>
          <label style={labelStyle}>Variant</label>
          <select
            value={(element as { variant?: string }).variant || 'primary'}
            onChange={(e) => onChange({ variant: e.target.value })}
            style={selectStyle}
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
            <option value="ghost">Ghost</option>
          </select>
        </div>
      )}

      {/* Basic style controls */}
      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginTop: '8px' }}>
        <h3 style={{ fontWeight: 500, fontSize: '14px', marginBottom: '12px', color: '#111827' }}>Styles</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={smallLabelStyle}>Background Color</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={element.styles?.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                style={{ width: '48px', height: '32px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', padding: 0 }}
              />
              <input
                type="text"
                value={element.styles?.backgroundColor || ''}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                placeholder="#ffffff"
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
          </div>
          
          <div>
            <label style={smallLabelStyle}>Text Color</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={element.styles?.color || '#000000'}
                onChange={(e) => updateStyle('color', e.target.value)}
                style={{ width: '48px', height: '32px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', padding: 0 }}
              />
              <input
                type="text"
                value={element.styles?.color || ''}
                onChange={(e) => updateStyle('color', e.target.value)}
                placeholder="#000000"
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
          </div>

          <div>
            <label style={smallLabelStyle}>Padding</label>
            <input
              type="text"
              value={element.styles?.padding || ''}
              onChange={(e) => updateStyle('padding', e.target.value)}
              placeholder="e.g., 16px"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={smallLabelStyle}>Border Radius</label>
            <input
              type="text"
              value={element.styles?.borderRadius || ''}
              onChange={(e) => updateStyle('borderRadius', e.target.value)}
              placeholder="e.g., 8px"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={smallLabelStyle}>Text Align</label>
            <select
              value={element.styles?.textAlign || ''}
              onChange={(e) => updateStyle('textAlign', e.target.value)}
              style={selectStyle}
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
