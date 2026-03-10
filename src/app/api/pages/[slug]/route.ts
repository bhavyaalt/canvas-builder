import { NextRequest, NextResponse } from 'next/server';
import { getPage, updatePage, deletePage } from '@/lib/store';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/pages/[slug] - Get a single page
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const page = getPage(slug);
  
  if (!page) {
    return NextResponse.json(
      { error: 'Page not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ page });
}

// PUT /api/pages/[slug] - Update a page
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  
  try {
    const body = await request.json();
    const page = updatePage(slug, body);
    
    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ page });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE /api/pages/[slug] - Delete a page
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const deleted = deletePage(slug);
  
  if (!deleted) {
    return NextResponse.json(
      { error: 'Page not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ success: true });
}
