# **Canvas Builder**
### Product & Technical Documentation
*Version 1.0 | March 2026*

---

## **Table of Contents**
1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [Target Audience](#4-target-audience)
5. [Key Features](#5-key-features)
6. [How It Works](#6-how-it-works)
7. [Use Cases](#7-use-cases)
8. [Technical Architecture](#8-technical-architecture)
9. [Data Model](#9-data-model)
10. [API Reference](#10-api-reference)
11. [Roadmap](#11-roadmap)
12. [Competitive Analysis](#12-competitive-analysis)
13. [Business Model](#13-business-model)

---

## **1. Executive Summary**

Canvas Builder is a no-code page builder that enables anyone to create beautiful, functional web pages through an intuitive drag-and-drop interface. Pages are stored as lightweight JSON files, making them portable, version-controllable, and embeddable anywhere on the web.

**Key Value Propositions:**
- **Zero coding required** — Create pages visually
- **JSON-based storage** — Own your data, export anytime
- **Embeddable** — Use pages anywhere via iframe
- **Fast & lightweight** — No bloated page builders

---

## **2. Problem Statement**

### The Challenge
Creating web pages today requires either:
- **Technical skills** (HTML/CSS/JS) that most people don't have
- **Expensive tools** (Webflow, Squarespace) with monthly subscriptions
- **Complex CMSs** (WordPress) with steep learning curves

### Pain Points

| User Type | Pain Point |
|-----------|-----------|
| Marketers | Need developer help for every landing page |
| Small businesses | Can't afford $50+/month for website builders |
| Developers | Waste time on repetitive UI work |
| Agencies | No easy way to hand off editable pages to clients |

---

## **3. Solution Overview**

Canvas Builder bridges the gap between "I need a webpage" and "I can build a webpage" by providing:

✅ **Visual Editor** — Drag, drop, style. No code.  
✅ **Portable Output** — Pages saved as JSON, not locked in  
✅ **Instant Publishing** — One click to get a shareable URL  
✅ **Embed Anywhere** — Drop pages into existing sites via iframe  
✅ **Developer-Friendly** — JSON DSL means devs can programmatically generate pages  

---

## **4. Target Audience**

### Primary Users

| Segment | Use Case | Value |
|---------|----------|-------|
| **Indie Hackers** | Landing pages for side projects | Ship faster without design skills |
| **Marketers** | Campaign landing pages | No dev dependency |
| **Educators** | Course content pages | Easy content updates |
| **Small Businesses** | Simple web presence | Affordable alternative |

### Secondary Users

| Segment | Use Case | Value |
|---------|----------|-------|
| **Developers** | Rapid prototyping | Generate UIs via JSON |
| **Agencies** | Client deliverables | Hand off editable pages |
| **Product Teams** | Internal tools | Quick dashboards/forms |

---

## **5. Key Features**

### 5.1 Drag-and-Drop Editor
- Intuitive element palette (12+ element types)
- Real-time preview as you build
- Nested containers for complex layouts

### 5.2 Element Library

| Category | Elements |
|----------|----------|
| **Content** | Text, Heading, Image, Link, Divider |
| **Forms** | Text Input, Textarea, Checkbox, Radio, Select, Button |
| **Layout** | Container (flex/grid support) |

### 5.3 Style System
- Visual controls for colors, spacing, typography
- Responsive design options
- Custom CSS escape hatch for power users

### 5.4 Publishing & Sharing
- Instant publish to unique URL (`/p/your-page`)
- Embeddable iframe version (`/p/your-page/iframe`)
- Export/import JSON files

### 5.5 Data Ownership
- Download your pages as JSON anytime
- No vendor lock-in
- Version control friendly (Git)

---

## **6. How It Works**

### For Non-Technical Users

```
Step 1: Open the Editor
        ↓
Step 2: Drag elements onto your canvas
        (headings, text, images, buttons, forms)
        ↓
Step 3: Click any element to customize
        (colors, fonts, spacing, content)
        ↓
Step 4: Click "Save Page"
        ↓
Step 5: Share your unique link or embed on your site!
```

### Visual Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  📦 Pick     │ ──▶ │  🎨 Style    │ ──▶ │  🚀 Publish  │
│  Elements    │     │  Your Page   │     │  & Share     │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## **7. Use Cases**

### Use Case 1: Startup Landing Page
> *"I need a landing page for my new app but don't want to spend weeks on it."*

**Solution:** Build a complete landing page in 30 minutes with hero section, features, pricing, and email capture form.

### Use Case 2: Event Registration
> *"We're hosting a conference and need a registration page."*

**Solution:** Create a branded page with event details, schedule, and registration form. Embed on existing website.

### Use Case 3: Internal Dashboard
> *"Our team needs a simple status page for our services."*

**Solution:** Build a dashboard with containers, text updates, and status indicators. Share internally via URL.

### Use Case 4: Client Deliverable
> *"I built a page for a client but they want to make text changes themselves."*

**Solution:** Hand off the editor link. Client can update content without touching code.

---

## **8. Technical Architecture**

### 8.1 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │   Editor    │  │  Renderer   │  │  Publisher  │        │
│   │   (React)   │  │ (DSL→JSX)   │  │  (Viewer)   │        │
│   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│          │                │                │                │
│          └────────────────┼────────────────┘                │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │  JSON DSL   │                          │
│                    │   (State)   │                          │
│                    └──────┬──────┘                          │
│                           │                                  │
└───────────────────────────┼─────────────────────────────────┘
                            │
                     ┌──────▼──────┐
                     │  REST API   │
                     │  (Next.js)  │
                     └──────┬──────┘
                            │
                     ┌──────▼──────┐
                     │   Storage   │
                     │ (Supabase)  │
                     └─────────────┘
```

### 8.2 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16, React 19 | UI framework |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Drag & Drop** | dnd-kit | Accessible DnD |
| **State** | React useState | Local state management |
| **API** | Next.js API Routes | REST endpoints |
| **Database** | Supabase (planned) | Persistent storage |
| **Hosting** | Vercel | Edge deployment |

### 8.3 Core Modules

| Module | File | Responsibility |
|--------|------|----------------|
| **DSL Types** | `src/lib/dsl/types.ts` | TypeScript interfaces for all elements |
| **Renderer** | `src/lib/dsl/renderer.tsx` | Converts JSON → React components |
| **Style Compiler** | `src/lib/dsl/style-compiler.ts` | Converts style props → CSS |
| **Element Utils** | `src/lib/element-utils.ts` | Tree manipulation (add, move, delete) |
| **Store** | `src/lib/store.ts` | Data persistence layer |

---

## **9. Data Model**

### 9.1 Page Schema

```typescript
interface CanvasPage {
  id: string;           // Unique identifier
  slug: string;         // URL-friendly name
  title: string;        // Page title
  description?: string; // SEO description
  elements: Element[];  // Page content
  meta: {
    createdAt: string;  // ISO timestamp
    updatedAt: string;  // ISO timestamp
    author?: string;    // Creator ID
  };
}
```

### 9.2 Element Schema

```typescript
interface Element {
  id: string;           // Unique within page
  type: ElementType;    // 'text' | 'heading' | 'button' | ...
  styles?: StyleProps;  // Visual styling
  children?: Element[]; // Nested elements (containers only)
  // Type-specific props
  content?: string;     // For text/heading
  label?: string;       // For inputs/buttons
  src?: string;         // For images
  href?: string;        // For links
  // ... etc
}
```

### 9.3 Style Properties

```typescript
interface StyleProps {
  // Layout
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  display?: 'block' | 'flex' | 'grid';
  flexDirection?: 'row' | 'column';
  gap?: string;
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around';
  
  // Position
  position?: 'static' | 'relative' | 'absolute' | 'fixed';
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zIndex?: number;
  
  // Appearance
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  
  // Typography
  fontSize?: string;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: string;
  
  // Escape hatch
  customCSS?: string;  // Raw CSS for advanced users
}
```

### 9.4 Supported Element Types

| Type | Description | Key Props |
|------|-------------|-----------|
| `container` | Layout wrapper | children, display, flexDirection, gap |
| `text` | Paragraph text | content |
| `heading` | Title (h1-h6) | content, level |
| `button` | Clickable button | label, variant, onClick |
| `textinput` | Single-line input | name, label, placeholder, type |
| `textarea` | Multi-line input | name, label, rows |
| `checkbox` | Toggle input | name, label, checked |
| `radio` | Option selector | name, label, value |
| `select` | Dropdown | name, options[], placeholder |
| `image` | Picture | src, alt, objectFit |
| `link` | Hyperlink | href, content, target |
| `divider` | Horizontal line | (none) |

---

## **10. API Reference**

### 10.1 Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/pages` | Create new page |
| `GET` | `/api/pages/[slug]` | Get page by slug |
| `PUT` | `/api/pages/[slug]` | Update existing page |
| `DELETE` | `/api/pages/[slug]` | Delete page |

### 10.2 Create Page

**Request:**
```http
POST /api/pages
Content-Type: application/json

{
  "slug": "my-landing-page",
  "title": "My Landing Page",
  "elements": [...]
}
```

**Response:**
```json
{
  "success": true,
  "page": {
    "id": "page-1234567890",
    "slug": "my-landing-page",
    "title": "My Landing Page",
    "elements": [...],
    "meta": {
      "createdAt": "2026-03-17T12:00:00Z",
      "updatedAt": "2026-03-17T12:00:00Z"
    }
  }
}
```

### 10.3 Get Page

**Request:**
```http
GET /api/pages/my-landing-page
```

**Response:**
```json
{
  "page": {
    "id": "page-1234567890",
    "slug": "my-landing-page",
    "title": "My Landing Page",
    "elements": [...],
    "meta": {...}
  }
}
```

### 10.4 Update Page

**Request:**
```http
PUT /api/pages/my-landing-page
Content-Type: application/json

{
  "title": "Updated Title",
  "elements": [...]
}
```

### 10.5 Delete Page

**Request:**
```http
DELETE /api/pages/my-landing-page
```

---

## **11. Roadmap**

### Phase 1: Foundation ✅
- [x] Drag-and-drop editor
- [x] 12 element types
- [x] Style customization
- [x] JSON export/import
- [x] Publish & embed

### Phase 2: Persistence (Q2 2026)
- [ ] Supabase database integration
- [ ] User authentication
- [ ] Personal page dashboard
- [ ] Page versioning & history

### Phase 3: Enhanced Editor (Q3 2026)
- [ ] Undo/redo functionality
- [ ] Keyboard shortcuts
- [ ] Copy/paste elements
- [ ] Element templates library
- [ ] Mobile responsive preview

### Phase 4: Forms & Data (Q4 2026)
- [ ] Form submission capture
- [ ] Email notifications
- [ ] Webhook integrations
- [ ] Basic analytics

### Phase 5: Collaboration (2027)
- [ ] Real-time multi-user editing
- [ ] Comments on elements
- [ ] Team workspaces
- [ ] Role-based permissions

---

## **12. Competitive Analysis**

| Feature | Canvas Builder | Webflow | Carrd | Notion |
|---------|---------------|---------|-------|--------|
| **No-code editor** | ✅ | ✅ | ✅ | ✅ |
| **JSON export** | ✅ | ❌ | ❌ | ❌ |
| **Embeddable** | ✅ | ⚠️ | ⚠️ | ✅ |
| **Self-hostable** | ✅ | ❌ | ❌ | ❌ |
| **Form elements** | ✅ | ✅ | ✅ | ⚠️ |
| **Free tier** | ✅ | ⚠️ | ✅ | ✅ |
| **Learning curve** | Low | High | Low | Low |
| **Price** | Free/TBD | $14+/mo | $9+/mo | $8+/mo |

### Differentiators
1. **Data ownership** — JSON-first, no lock-in
2. **Developer-friendly** — Programmatic page generation
3. **Lightweight** — No bloat, fast loading
4. **Open architecture** — Easy to extend/customize

---

## **13. Business Model**

### Freemium Model

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 3 pages, basic elements, Canvas Builder branding |
| **Pro** | $9/mo | Unlimited pages, custom domains, no branding |
| **Team** | $29/mo | Collaboration, shared workspace, analytics |
| **Enterprise** | Custom | Self-hosting, SSO, priority support |

### Revenue Streams
1. **Subscriptions** — Monthly/annual plans
2. **Templates** — Premium pre-built page templates
3. **White-label** — Agencies embed in their products
4. **API Access** — Programmatic page generation

---

## **Appendix**

### A. Sample JSON Page

```json
{
  "slug": "hello-world",
  "title": "Hello World",
  "elements": [
    {
      "id": "container-1",
      "type": "container",
      "styles": {
        "padding": "48px",
        "display": "flex",
        "flexDirection": "column",
        "alignItems": "center",
        "gap": "24px"
      },
      "children": [
        {
          "id": "heading-1",
          "type": "heading",
          "level": 1,
          "content": "Welcome to Canvas Builder"
        },
        {
          "id": "text-1",
          "type": "text",
          "content": "Build beautiful pages without code."
        },
        {
          "id": "button-1",
          "type": "button",
          "label": "Get Started",
          "variant": "primary"
        }
      ]
    }
  ]
}
```

### B. Embed Code

```html
<iframe 
  src="https://canvas-builder.vercel.app/p/hello-world/iframe"
  width="100%" 
  height="600"
  style="border: none; border-radius: 8px;"
  loading="lazy"
></iframe>
```

### C. File Structure

```
canvas-builder/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout
│   │   ├── editor/
│   │   │   └── page.tsx          # Main editor UI
│   │   ├── p/[slug]/
│   │   │   ├── page.tsx          # Published view
│   │   │   └── iframe/
│   │   │       └── page.tsx      # Embeddable version
│   │   └── api/pages/
│   │       ├── route.ts          # POST (create)
│   │       └── [slug]/
│   │           └── route.ts      # GET/PUT/DELETE
│   │
│   └── lib/
│       ├── dsl/
│       │   ├── types.ts          # TypeScript interfaces
│       │   ├── renderer.tsx      # DSL → React
│       │   └── style-compiler.ts # Styles → CSS/Tailwind
│       ├── store.ts              # Data persistence
│       └── element-utils.ts      # Tree manipulation
│
├── public/                       # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

---

*Document prepared by Shawn | Last updated: March 17, 2026*
