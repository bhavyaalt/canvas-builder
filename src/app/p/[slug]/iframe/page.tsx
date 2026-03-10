import { notFound } from 'next/navigation';
import { getPage } from '@/lib/store';
import { CanvasRenderer } from '@/lib/dsl/renderer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Iframe-friendly version (no extra UI, just the rendered content)
export default async function IframePage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPage(slug);
  
  if (!page) {
    notFound();
  }
  
  return (
    <html>
      <head>
        <title>{page.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="m-0 p-0">
        <CanvasRenderer elements={page.elements} />
      </body>
    </html>
  );
}
