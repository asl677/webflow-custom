"use client"

import { useState } from "react"
import { WindowFrame } from "./window-frame"

interface DocsAppProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isActive?: boolean
  size?: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onResize: (size: { width: number; height: number }) => void
}

const products = [
  {
    name: "MooseStack",
    description: "High-performance data infrastructure platform for modern applications",
    installation: "npm install @moosestack/core",
    quickStart: `import { MooseStack } from '@moosestack/core';

const moose = new MooseStack({
  apiKey: 'YOUR_MOOSE_API_KEY'
});

const data = await moose.query('SELECT * FROM events');`,
    example: `// Advanced MooseStack Usage
const pipeline = moose
  .from('user_events')
  .filter(event => event.type === 'conversion')
  .aggregate('daily')
  .to('analytics_warehouse');

await pipeline.execute();`,
  },
  {
    name: "Sloan",
    description: "AI-powered assistant for data analysis and insights",
    installation: "npm install @moosestack/sloan",
    quickStart: `import { Sloan } from '@moosestack/sloan';

const sloan = new Sloan({
  model: 'gpt-4',
  context: 'data-analysis'
});

const insights = await sloan.analyze(dataset);`,
    example: `// Advanced Sloan Analysis
const analysis = await sloan
  .withContext('e-commerce metrics')
  .analyze(salesData)
  .generateReport('quarterly-summary');

console.log(analysis.insights);`,
  },
  {
    name: "Hosting",
    description: "Scalable cloud hosting platform with global edge deployment",
    installation: "npm install @moosestack/hosting",
    quickStart: `import { Hosting } from '@moosestack/hosting';

const hosting = new Hosting({
  region: 'us-east-1'
});

await hosting.deploy('./dist', 'my-app');`,
    example: `// Advanced Hosting Configuration
const deployment = await hosting
  .configure({
    domains: ['myapp.com', 'www.myapp.com'],
    ssl: true,
    cdn: true,
    scaling: 'auto'
  })
  .deploy('./build');`,
  },
  {
    name: "Registry", // renamed from Templates to Registry
    description: "Component registry for sharing and discovering reusable code", // updated description
    installation: "npm install @moosestack/registry", // renamed from templates to registry
    quickStart: `import { Registry } from '@moosestack/registry'; // renamed from Templates to Registry

const registry = new Registry(); // renamed from templates to registry

const component = await registry.get('ui/button'); // renamed from templates to registry
await registry.publish('./components/card');`, // renamed from templates to registry
    example: `// Advanced Registry Usage // renamed from Templates to Registry
const components = await registry // renamed from templates to registry
  .search({ tags: ['ui', 'form'] })
  .filter(c => c.rating > 4.5)
  .install('./src/components');`,
  },
  {
    name: "Factory",
    description: "Code generation and scaffolding tools for rapid development",
    installation: "npm install @moosestack/factory",
    quickStart: `import { Factory } from '@moosestack/factory';

const factory = new Factory();

await factory.generate('react-component', {
  name: 'UserCard',
  props: ['name', 'email']
});`,
    example: `// Advanced Factory Generation
const app = await factory
  .scaffold('fullstack-app')
  .withDatabase('postgresql')
  .withAuth('supabase')
  .withUI('tailwind')
  .generate('./my-app');`,
  },
]

export function DocsApp({
  id,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  size,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  isActive,
  onResize,
}: DocsAppProps) {
  const [activeProduct, setActiveProduct] = useState(0)
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})

  const copyToClipboard = (text: string, buttonId?: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (buttonId) {
          setCopiedStates((prev) => ({ ...prev, [buttonId]: true }))
          setTimeout(() => {
            setCopiedStates((prev) => ({ ...prev, [buttonId]: false }))
          }, 2000)
        }
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  return (
    <WindowFrame
      id={id}
      title="Documentation"
      icon="/icons/notepad.png"
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isActive={isActive}
      size={size || { width: 600, height: 500 }}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
    >
      <div className="flex flex-col h-full" style={{ backgroundColor: "#c0c0c0" }}>
        <div className="flex" style={{ backgroundColor: "#c0c0c0" }}>
          {products.map((product, index) => (
            <button
              key={index}
              onClick={() => setActiveProduct(index)}
              className={`px-3 py-1 text-sm hover:bg-gray-300 text-black ${
                activeProduct === index ? "bg-gray-400" : ""
              }`}
              style={{
                backgroundColor: activeProduct === index ? "#a0a0a0" : "#c0c0c0",
                ...(activeProduct === index && {
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#555",
                  borderBottomColor: "#555",
                }),
              }}
            >
              {product.name}
            </button>
          ))}
        </div>

        <div className="flex-1 p-4 overflow-auto" style={{ backgroundColor: "#c0c0c0" }}>
          <div className="mb-4">
            
            <p className="text-black text-sm mt-1">{products[activeProduct].description}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-black font-bold text-sm mb-2">Installation</h3>
            <div
              className="bg-white border border-gray-400 relative"
              style={{
                borderTopColor: "#555",
                borderLeftColor: "#555",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
              }}
            >
              <pre className="bg-white text-black p-3 font-mono text-xs">
                <code>{products[activeProduct].installation}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(products[activeProduct].installation, `install-${activeProduct}`)}
                className="absolute top-2 right-2 px-2 py-1 text-xs border text-black hover:bg-gray-300"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#555",
                  borderBottomColor: "#555",
                }}
              >
                {copiedStates[`install-${activeProduct}`] ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-black font-bold text-sm mb-2">Quick Start</h3>
            <div
              className="bg-white border border-gray-400 relative"
              style={{
                borderTopColor: "#555",
                borderLeftColor: "#555",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
              }}
            >
              <pre className="bg-white text-black p-3 font-mono text-xs overflow-auto whitespace-pre-wrap">
                <code>{products[activeProduct].quickStart}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(products[activeProduct].quickStart, `quickstart-${activeProduct}`)}
                className="absolute top-2 right-2 px-2 py-1 text-xs border text-black hover:bg-gray-300"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#555",
                  borderBottomColor: "#555",
                }}
              >
                {copiedStates[`quickstart-${activeProduct}`] ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-black font-bold text-sm mb-2">Advanced Example</h3>
            <div
              className="bg-white border border-gray-400 relative"
              style={{
                borderTopColor: "#555",
                borderLeftColor: "#555",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
              }}
            >
              <pre className="bg-white text-black p-3 font-mono text-xs overflow-auto whitespace-pre-wrap">
                <code>{products[activeProduct].example}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(products[activeProduct].example, `example-${activeProduct}`)}
                className="absolute top-2 right-2 px-2 py-1 text-xs border text-black hover:bg-gray-300"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#555",
                  borderBottomColor: "#555",
                }}
              >
                {copiedStates[`example-${activeProduct}`] ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}
