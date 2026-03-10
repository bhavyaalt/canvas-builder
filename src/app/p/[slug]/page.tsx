import { notFound } from 'next/navigation';
import { getPage, getAllPages } from '@/lib/store';
import { CanvasRenderer } from '@/lib/dsl/renderer';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  
  if (!page) {
    return { title: 'Page Not Found' };
  }
  
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPage(slug);
  
  if (!page) {
    notFound();
  }
  
  return (
    <main className="min-h-screen">
      <CanvasRenderer elements={page.elements} />
    </main>
  );
}

// Optional: Generate static pages for known slugs
export async function generateStaticParams() {
  const pages = getAllPages();
  return pages.map((page) => ({
    slug: page.slug,
  }));
}
