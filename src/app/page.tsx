import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            🎨 Canvas Builder
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Build beautiful pages with a drag-and-drop editor. 
            No code required. Export to JSON. Embed anywhere.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/editor"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-colors"
            >
              Open Editor →
            </Link>
            <Link
              href="/p/demo"
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-lg transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="text-3xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">JSON DSL</h3>
            <p className="text-gray-400">
              Pages are stored as JSON. Export, import, version control - 
              your data, your way.
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="text-3xl mb-4">🔌</div>
            <h3 className="text-xl font-semibold mb-2">Embeddable</h3>
            <p className="text-gray-400">
              Each page has an iframe-friendly URL. Embed your creations 
              anywhere on the web.
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">React Powered</h3>
            <p className="text-gray-400">
              Built on Next.js. Your JSON DSL compiles to real React 
              components at runtime.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gray-800/30 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-4xl mb-2">1️⃣</div>
              <p className="text-sm text-gray-300">Create elements in the editor</p>
            </div>
            <div>
              <div className="text-4xl mb-2">2️⃣</div>
              <p className="text-sm text-gray-300">Style them with visual tools</p>
            </div>
            <div>
              <div className="text-4xl mb-2">3️⃣</div>
              <p className="text-sm text-gray-300">Save to get a unique URL</p>
            </div>
            <div>
              <div className="text-4xl mb-2">4️⃣</div>
              <p className="text-sm text-gray-300">Embed or share anywhere</p>
            </div>
          </div>
        </div>

        {/* Element Types */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold mb-6">Available Elements</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              '📝 Text', '🔤 Heading', '🔘 Button', '✏️ Text Input',
              '📄 Textarea', '☑️ Checkbox', '⭕ Radio', '📋 Select',
              '🖼️ Image', '🔗 Link', '📦 Container', '➖ Divider'
            ].map((el) => (
              <span key={el} className="px-4 py-2 bg-gray-700/50 rounded-lg text-sm">
                {el}
              </span>
            ))}
          </div>
        </div>

        {/* Embed Example */}
        <div className="bg-gray-800/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Embed Your Pages</h2>
          <p className="text-gray-400 text-center mb-6">
            Use the iframe URL to embed pages anywhere:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <code className="text-green-400">
              {`<iframe src="https://your-domain.com/p/your-page/iframe" />`}
            </code>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>Built with Next.js + Tailwind CSS</p>
          <p className="mt-2">
            <Link href="/editor" className="text-blue-400 hover:underline">
              Start Building →
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
