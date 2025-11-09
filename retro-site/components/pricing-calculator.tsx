"use client"

import { useState } from "react"

export function PricingCalculator() {
  const [gbsInput, setGbsInput] = useState("200")
  const [processingType, setProcessingType] = useState("lighter")
  const [infraType, setInfraType] = useState("hosted")

  const calculatePricing = () => {
    const gbs = Number.parseInt(gbsInput) || 0
    let buuMin = 0
    let buuMax = 0

    if (processingType === "lighter") {
      buuMin = Math.floor(gbs * 0.245)
      buuMax = Math.floor(gbs * 0.73)
    } else {
      buuMin = Math.floor(gbs * 0.5)
      buuMax = Math.floor(gbs * 1.5)
    }

    const costPerBuu = infraType === "hosted" ? 0.24 : 0.04
    const totalCost = Math.max(100, buuMin * costPerBuu)

    return {
      buuMin,
      buuMax,
      totalCost: Math.round(totalCost),
      costPerBuu,
    }
  }

  const pricing = calculatePricing()

  return (
    <div className="dialog p-4 w-full">
      <div className="title-bar mb-4">
        <div className="title-bar-text">Pro Tier Pricing Calculator</div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2">Data Volume (GBs)</label>
          <input
            type="number"
            value={gbsInput}
            onChange={(e) => setGbsInput(e.target.value)}
            className="w-full p-2 border-2 bg-white text-black"
            style={{
              borderTopColor: "#808080",
              borderLeftColor: "#808080",
              borderRightColor: "#dfdfdf",
              borderBottomColor: "#dfdfdf",
            }}
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Processing Type</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="lighter"
                checked={processingType === "lighter"}
                onChange={(e) => setProcessingType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Lighter analytics (e.g. BI / dashboards)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="heavier"
                checked={processingType === "heavier"}
                onChange={(e) => setProcessingType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Heavier processing (e.g. ML / complex analytics)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Infrastructure</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="hosted"
                checked={infraType === "hosted"}
                onChange={(e) => setInfraType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Hosted Infrastructure</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="byo"
                checked={infraType === "byo"}
                onChange={(e) => setInfraType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Bring Your Own (ClickHouse/Kafka)</span>
            </label>
          </div>
        </div>

        <fieldset className="p-3 bg-white">
          <div className="text-lg font-bold text-center mb-2">Estimated Monthly Cost: ${pricing.totalCost}</div>
          <div className="text-sm text-gray-600">
            <div>
              Estimated BUUs: {pricing.buuMin} - {pricing.buuMax}
            </div>
            <div>Rate: ${pricing.costPerBuu}/BUU</div>
            <div className="text-xs mt-1">*Pro Tier usage pricing. Does not include additional seats.</div>
          </div>
        </fieldset>

        <div className="flex gap-2">
          <button className="btn flex-1 text-sm font-bold">Start Free Trial</button>
          <button className="btn flex-1 text-sm font-bold">Contact Sales</button>
        </div>
      </div>
    </div>
  )
}
