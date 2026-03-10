// Simple in-memory store for pages (replace with DB later)
import { CanvasPage, CanvasElement } from './dsl/types';

// Demo pages
const demoPages: Record<string, CanvasPage> = {
  'demo': {
    id: 'demo-1',
    slug: 'demo',
    title: 'Demo Page',
    description: 'A demo page showcasing all elements',
    elements: [
      {
        id: 'container-1',
        type: 'container',
        styles: {
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          backgroundColor: '#f9fafb',
        },
        children: [
          {
            id: 'heading-1',
            type: 'heading',
            level: 1,
            content: 'Welcome to Canvas Builder',
            styles: { textAlign: 'center', color: '#1f2937' },
          },
          {
            id: 'text-1',
            type: 'text',
            content: 'Build beautiful pages with our drag-and-drop editor. This is a demo page showcasing various elements.',
            styles: { textAlign: 'center', color: '#6b7280', fontSize: '18px' },
          },
          {
            id: 'divider-1',
            type: 'divider',
          },
          {
            id: 'container-form',
            type: 'container',
            styles: {
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '12px',
              shadow: 'md',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            },
            children: [
              {
                id: 'heading-2',
                type: 'heading',
                level: 3,
                content: 'Contact Form',
              },
              {
                id: 'input-name',
                type: 'textinput',
                name: 'name',
                label: 'Full Name',
                placeholder: 'Enter your name',
                required: true,
              },
              {
                id: 'input-email',
                type: 'textinput',
                name: 'email',
                label: 'Email',
                placeholder: 'you@example.com',
                inputType: 'email',
                required: true,
              },
              {
                id: 'select-topic',
                type: 'select',
                name: 'topic',
                label: 'Topic',
                placeholder: 'Select a topic',
                options: [
                  { value: 'general', label: 'General Inquiry' },
                  { value: 'support', label: 'Support' },
                  { value: 'feedback', label: 'Feedback' },
                ],
              },
              {
                id: 'textarea-message',
                type: 'textarea',
                name: 'message',
                label: 'Message',
                placeholder: 'Your message here...',
                rows: 4,
              },
              {
                id: 'checkbox-newsletter',
                type: 'checkbox',
                name: 'newsletter',
                label: 'Subscribe to newsletter',
              },
              {
                id: 'container-buttons',
                type: 'container',
                styles: {
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'end',
                },
                children: [
                  {
                    id: 'btn-cancel',
                    type: 'button',
                    label: 'Cancel',
                    variant: 'outline',
                  },
                  {
                    id: 'btn-submit',
                    type: 'button',
                    label: 'Submit',
                    variant: 'primary',
                  },
                ],
              },
            ],
          },
          {
            id: 'link-1',
            type: 'link',
            href: '/editor',
            content: '← Back to Editor',
            styles: { textAlign: 'center' },
          },
        ],
      },
    ],
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};

// In-memory store
const pages: Record<string, CanvasPage> = { ...demoPages };

export function getPage(slug: string): CanvasPage | null {
  return pages[slug] || null;
}

export function getAllPages(): CanvasPage[] {
  return Object.values(pages);
}

export function createPage(page: Omit<CanvasPage, 'id' | 'meta'>): CanvasPage {
  const id = `page-${Date.now()}`;
  const newPage: CanvasPage = {
    ...page,
    id,
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
  pages[page.slug] = newPage;
  return newPage;
}

export function updatePage(slug: string, updates: Partial<CanvasPage>): CanvasPage | null {
  const existing = pages[slug];
  if (!existing) return null;
  
  const updated: CanvasPage = {
    ...existing,
    ...updates,
    slug: updates.slug || existing.slug, // Allow slug change
    meta: {
      ...existing.meta!,
      updatedAt: new Date().toISOString(),
    },
  };
  
  // If slug changed, update the key
  if (updates.slug && updates.slug !== slug) {
    delete pages[slug];
    pages[updates.slug] = updated;
  } else {
    pages[slug] = updated;
  }
  
  return updated;
}

export function deletePage(slug: string): boolean {
  if (!pages[slug]) return false;
  delete pages[slug];
  return true;
}
