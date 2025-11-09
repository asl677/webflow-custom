"use client"

import { WindowFrame } from "./window-frame"

interface EnterpriseAppProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  onMaximize?: () => void
  isActive?: boolean
  size?: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onResize: (size: { width: number; height: number }) => void
}

export function EnterpriseApp({
  id,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  onMaximize,
  isActive,
  size,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onResize,
}: EnterpriseAppProps) {
  return (
    <WindowFrame
      id={id}
      title="Enterprise Solutions"
      icon="/icons/fax_machine-1.png"
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMaximize={onMaximize}
      isActive={isActive}
      width={size?.width || 600}
      height={size?.height || 700}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
    >
      <div className="h-full overflow-auto" style={{ backgroundColor: "#c0c0c0" }}>
        <div className="p-3 max-w-full mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <img
                src="/icons/fax_machine-1.png"
                alt="Enterprise"
                width="32"
                height="32"
                loading="eager"
                fetchPriority="high"
                className="w-8 h-8"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <h1 className="text-sm md:text-base font-bold text-black mb-1">
              Enterprise-grade analytics infrastructure
            </h1>
            <p className="text-xs text-black mb-3">Deploy anywhere and integrate with your existing data systems.</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                className="px-3 py-1 text-white text-xs font-bold border-2"
                style={{
                  backgroundColor: "#316AC5",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                Request Demo
              </button>
              <button
                className="px-3 py-1 text-black text-xs font-bold border-2"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                Talk to Sales
              </button>
            </div>
          </div>

          {/* Enterprise Features */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            {/* Security & Compliance */}
            <div
              className="border-2 bg-white p-3"
              style={{
                borderTopColor: "#808080",
                borderLeftColor: "#808080",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
              }}
            >
              <div className="text-center mb-3">
                <h3 className="text-xs font-bold mb-1 text-black">Security & Compliance</h3>
                <p className="text-xs text-black mb-2">Enterprise-grade security controls</p>
                <button
                  className="w-full py-1 text-black text-xs font-bold border-2"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#dfdfdf",
                    borderLeftColor: "#dfdfdf",
                    borderRightColor: "#808080",
                    borderBottomColor: "#808080",
                  }}
                >
                  Learn More
                </button>
              </div>
              <ul className="space-y-1 text-xs text-black">
                <li>✓ SSO integrations</li>
                <li>✓ SOC 2 Type II compliance</li>
                <li>✓ GDPR & HIPAA ready</li>
                <li>✓ Role-based access control</li>
                <li>✓ Audit logging</li>
              </ul>
            </div>

            {/* Deployment Options */}
            <div
              className="border-2 bg-white p-3 relative"
              style={{
                borderTopColor: "#808080",
                borderLeftColor: "#808080",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
              }}
            >
              <div
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-black px-2 py-1 text-xs font-bold border-2"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                FLEXIBLE
              </div>
              <div className="text-center mb-3">
                <h3 className="text-xs font-bold mb-1 text-black">Deployment Options</h3>
                <p className="text-xs text-black mb-1">Deploy anywhere you need</p>
                <p className="text-sm font-bold mb-2 text-black">Custom Pricing</p>
                <button
                  className="w-full py-1 text-white text-xs font-bold border-2"
                  style={{
                    backgroundColor: "#316AC5",
                    borderTopColor: "#dfdfdf",
                    borderLeftColor: "#dfdfdf",
                    borderRightColor: "#808080",
                    borderBottomColor: "#808080",
                  }}
                >
                  Contact Sales
                </button>
              </div>
              <ul className="space-y-1 text-xs text-black">
                <li>✓ Bring Your Own Cloud</li>
                <li>✓ On-premises deployment</li>
                <li>✓ Hybrid cloud setup</li>
                <li>✓ Multi-region support</li>
                <li>✓ Custom integrations</li>
              </ul>
            </div>

            {/* Support & SLAs */}
            <div
              className="border-2 bg-white p-3"
              style={{
                borderTopColor: "#808080",
                borderLeftColor: "#808080",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
              }}
            >
              <div className="text-center mb-3">
                <h3 className="text-xs font-bold mb-1 text-black">Support & SLAs</h3>
                <p className="text-xs text-black mb-2">24/7 enterprise support</p>
                <button
                  className="w-full py-1 text-black text-xs font-bold border-2"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#dfdfdf",
                    borderLeftColor: "#dfdfdf",
                    borderRightColor: "#808080",
                    borderBottomColor: "#808080",
                  }}
                >
                  View SLAs
                </button>
              </div>
              <ul className="space-y-1 text-xs text-black">
                <li>✓ 99.9% uptime SLA</li>
                <li>✓ Dedicated support team</li>
                <li>✓ Priority response times</li>
                <li>✓ Custom training sessions</li>
                <li>✓ Architecture consulting</li>
              </ul>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="mb-4">
            <h2 className="text-sm font-bold text-center mb-3 text-black">Enterprise Performance</h2>
            <div
              className="border-2 bg-white p-3"
              style={{
                borderTopColor: "#808080",
                borderLeftColor: "#808080",
                borderRightColor: "#dfdfdf",
                borderBottomColor: "#dfdfdf",
              }}
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm font-bold text-black">10x</div>
                  <div className="text-xs text-black">Faster migration</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-black">50+%</div>
                  <div className="text-xs text-black">Cost reduction</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-black">Gb to Pb+</div>
                  <div className="text-xs text-black">Scale</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <h2 className="text-sm font-bold mb-2 text-black">Ready to get started?</h2>
            <p className="text-xs text-black mb-3">
              Let's discuss your enterprise requirements and custom deployment options.
            </p>
            <div className="flex flex-col gap-2 justify-center">
              <button
                className="px-3 py-1 text-white text-xs font-bold border-2"
                style={{
                  backgroundColor: "#316AC5",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                Request Demo
              </button>
              <button
                className="px-3 py-1 text-black text-xs font-bold border-2"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                Talk to Enterprise Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}
