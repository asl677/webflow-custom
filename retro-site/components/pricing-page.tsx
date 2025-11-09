"use client"

import { PricingCalculator } from "./pricing-calculator"
import { WindowFrame } from "./window-frame"

interface PricingPageProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  isActive?: boolean
  size?: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onMaximize: () => void
  onResize: (size: { width: number; height: number }) => void
  onOpenRequestDemo?: () => void
}

export function PricingPage({
  id,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  isActive,
  size,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onMaximize,
  onResize,
  onOpenRequestDemo,
}: PricingPageProps) {
  return (
    <WindowFrame
      id={id}
      title="Pricing"
      icon="/icons/pricing-icon.png"
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      isActive={isActive}
      width={size?.width || 600}
      height={size?.height || 700}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onResize={onResize}
    >
      <div className="h-full overflow-auto" style={{backgroundColor: "#c0c0c0" }}>
        <div className="p-3 max-w-full mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <img
                src="/icons/pricing-icon.png"
                alt="Pricing"
                className="w-8 h-8"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <h1 className="text-sm md:text-base font-bold text-black mb-1">Flexible pricing that scales with you</h1>
            <p className="text-xs text-black mb-3">Find the plan to power your analytical backend.</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={onOpenRequestDemo}
                className="px-3 py-1 text-black text-xs font-bold border-2"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                Get Started for Free
              </button>
              <button
                onClick={onOpenRequestDemo}
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

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            {/* Free Tier */}
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
                <h3 className="text-xs font-bold mb-1 text-black">Free</h3>
                <p className="text-xs text-black mb-2">Testing your project</p>
                <button
                  onClick={onOpenRequestDemo}
                  className="w-full py-1 text-black text-xs font-bold border-2"
                  style={{
                    backgroundColor: "#c0c0c0",
                    borderTopColor: "#dfdfdf",
                    borderLeftColor: "#dfdfdf",
                    borderRightColor: "#808080",
                    borderBottomColor: "#808080",
                  }}
                >
                  Get Started
                </button>
              </div>
              <ul className="space-y-1 text-xs text-black">
                <li>✓ Local dev server</li>
                <li>✓ Analytical infra as code</li>
                <li>✓ Unlimited deployments</li>
                <li>✓ Preview branches</li>
                <li>✓ Observability logs</li>
              </ul>
            </div>

            {/* Pro Tier */}
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
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-white px-2 py-1 text-xs font-bold"
                style={{ backgroundColor: "#316AC5" }}
              >
                POPULAR
              </div>
              <div className="text-center mb-3">
                <h3 className="text-xs font-bold mb-1 text-black">Pro</h3>
                <p className="text-xs text-black mb-1">Production ready</p>
                <p className="text-sm font-bold mb-2 text-black">$100/month</p>
                <button
                  onClick={onOpenRequestDemo}
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
                <li>✓ Everything in Free plus:</li>
                <li>✓ 10x more usage</li>
                <li>✓ Autoscaling</li>
                <li>✓ Team collaboration</li>
                <li>✓ Standard support</li>
              </ul>
            </div>

            {/* Enterprise Tier */}
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
                <h3 className="text-xs font-bold mb-1 text-black">Enterprise</h3>
                <p className="text-xs text-black mb-2">Highest Security</p>
                <button
                  onClick={onOpenRequestDemo}
                  className="w-full py-1 text-black text-xs font-bold border-2"
                  style={{
                    backgroundColor: "#c0c0c0",
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
                <li>✓ Everything in Pro plus:</li>
                <li>✓ SSO integrations</li>
                <li>✓ Compliance controls</li>
                <li>✓ Bring Your Own Cloud</li>
                <li>✓ Enterprise SLAs</li>
              </ul>
            </div>
          </div>

          {/* Pricing Calculator Section */}
          <div className="mb-4">
            <h2 className="text-sm font-bold text-center mb-3 text-black">Pricing Estimator</h2>
            <PricingCalculator />
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <h2 className="text-sm font-bold mb-2 text-black">We're here to help</h2>
            <p className="text-xs text-black mb-3">From architecture to pricing questions, we'd love to chat.</p>
            <div className="flex flex-col gap-2 justify-center">
              <button
                onClick={onOpenRequestDemo}
                className="px-3 py-1 text-white text-xs font-bold border-2"
                style={{
                  backgroundColor: "#316AC5",
                  borderTopColor: "#dfdfdf",
                  borderLeftColor: "#dfdfdf",
                  borderRightColor: "#808080",
                  borderBottomColor: "#808080",
                }}
              >
                Talk to Sales
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
                Talk to Eng
              </button>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}
