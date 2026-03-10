import { NextRequest, NextResponse } from 'next/server';
import { getAllPages, createPage } from '@/lib/store';

// GET /api/pages - List all pages
export async function GET() {
  const pages = getAllPages();
  return NextResponse.json({ pages });
}

// POST /api/pages - Create a new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.slug || !body.title) {
      return NextResponse.json(
        { error: 'slug and title are required' },
        { status: 400 }
      );
    }
    
    const page = createPage({
      slug: body.slug,
      title: body.title,
      description: body.description,
      elements: body.elements || [],
    });
    
    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
