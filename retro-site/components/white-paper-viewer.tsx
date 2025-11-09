"use client"

import { useState } from "react"
import { WindowFrame } from "./window-frame"

interface WhitePaperViewerProps {
  id: string
  position: { x: number; y: number }
  zIndex: number
  size?: { width: number; height: number }
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  content: string
  isActive?: boolean
  icon?: string
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize: () => void
  onMaximize: () => void
  onResize?: (size: { width: number; height: number }) => void
}

const AIOPS_WHITEPAPER_CONTENT = `AIOps Network Operations

Executive Summary

Artificial Intelligence for IT Operations (AIOps) represents a paradigm shift in how organizations manage and optimize their network infrastructure. By leveraging machine learning algorithms, predictive analytics, and automated response systems, AIOps transforms reactive network management into proactive, intelligent operations.

Key Benefits

• Predictive Issue Detection: Machine learning models analyze network patterns to identify potential issues before they impact operations
• Automated Root Cause Analysis: AI algorithms correlate events across multiple systems to quickly identify the source of network problems
• Intelligent Alerting: Reduces alert fatigue by filtering noise and prioritizing critical issues based on business impact
• Performance Optimization: Continuous analysis of network performance metrics enables automatic optimization recommendations

Implementation Framework

1. Data Collection and Integration
   - Aggregate data from network devices, applications, and infrastructure components
   - Establish real-time data pipelines for continuous monitoring
   - Implement standardized data formats for cross-platform compatibility

2. Machine Learning Model Development
   - Develop baseline models for normal network behavior
   - Train anomaly detection algorithms on historical data
   - Implement predictive models for capacity planning and failure prediction

3. Automation and Orchestration
   - Create automated response workflows for common network issues
   - Implement self-healing network configurations
   - Establish approval workflows for critical automated actions

4. Continuous Improvement
   - Monitor model performance and accuracy
   - Retrain models with new data and feedback
   - Expand automation capabilities based on operational success

Technical Architecture

The AIOps platform consists of several key components:

Data Layer: Collects and normalizes data from diverse network sources including SNMP, syslog, flow data, and application metrics.

Analytics Engine: Processes data using machine learning algorithms for pattern recognition, anomaly detection, and predictive analysis.

Automation Framework: Executes automated responses based on AI recommendations, including configuration changes, traffic rerouting, and resource allocation.

Visualization Dashboard: Provides real-time insights into network health, AI recommendations, and automation status.

ROI and Business Impact

Organizations implementing AIOps typically see:
- 60-80% reduction in mean time to resolution (MTTR)
- 40-60% decrease in network-related incidents
- 30-50% improvement in network performance optimization
- Significant reduction in operational overhead and manual intervention

Conclusion

AIOps represents the future of network operations, enabling organizations to move from reactive troubleshooting to proactive optimization. By implementing intelligent automation and predictive analytics, network teams can focus on strategic initiatives while ensuring optimal network performance and reliability.

The successful implementation of AIOps requires careful planning, proper data integration, and a commitment to continuous improvement. Organizations that embrace this technology will gain significant competitive advantages through improved network reliability, reduced operational costs, and enhanced user experience.`

export function WhitePaperViewer({
  id,
  position,
  zIndex,
  size,
  isAnimating,
  isMinimized,
  isMaximized,
  content,
  isActive,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onMaximize,
  onResize,
}: WhitePaperViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 1

  const getContent = () => {
    if (content === "aiops-whitepaper") {
      return AIOPS_WHITEPAPER_CONTENT
    }
    return content
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <WindowFrame
      id={id}
      title="White Paper Viewer"
      position={position}
      zIndex={zIndex}
      width={size?.width || 700}
      height={size?.height || 600}
      size={size}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      icon="/icons/notepad-icon.png"
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onResize={onResize}
    >
      <div className="flex flex-col h-full white-paper-viewer bg-white">
        {/* Document Toolbar */}
        <div
          className="flex items-center justify-between border-b border-gray-400 px-0 py-0"
          style={{ backgroundColor: "#c0c0c0" }}
        >
          <div className="flex items-center gap-0">
            <button
              className="px-2 py-1 border text-black hover:bg-gray-300 text-sm"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              File
            </button>
            <button
              className="px-2 py-1 border text-black hover:bg-gray-300 text-sm"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              Edit
            </button>
            <button
              className="px-2 py-1 border text-black hover:bg-gray-300 text-sm"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              View
            </button>
          </div>
          <div className="flex items-center gap-0">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
              className="px-3 py-1 border text-black hover:bg-gray-300 text-sm"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              Previous
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 border text-black hover:bg-gray-300 text-sm"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#808080",
                borderBottomColor: "#808080",
              }}
            >
              Next
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-hidden bg-white">
          <div
            className="h-full overflow-y-auto"
            style={{
              backgroundColor: "white",
              border: "2px solid",
              borderTopColor: "#808080",
              borderLeftColor: "#808080",
              borderRightColor: "#dfdfdf",
              borderBottomColor: "#dfdfdf",
              boxShadow:
                "inset -1px -1px #ffffff, inset 1px 1px #808080, inset -2px -2px #dfdfdf, inset 2px 2px #000000",
            }}
          >
            <div className="max-w-none leading-relaxed break-words word-wrap p-4">
              {getContent()
                .split("\n")
                .map((line, index) => {
                  // Main title (first line)
                  if (index === 0) {
                    return (
                      <h1
                        key={index}
                        className="text-xl font-bold mb-6 text-center border-b-2 border-gray-300 pb-2 text-black break-words"
                      >
                        {line}
                      </h1>
                    )
                  }
                  // Section headings (lines that are standalone and not bullet points)
                  else if (
                    line.trim() !== "" &&
                    !line.startsWith("•") &&
                    !line.startsWith("-") &&
                    !line.startsWith("   ") &&
                    line.length < 50 &&
                    !line.includes(":")
                  ) {
                    return (
                      <h2 key={index} className="text-lg font-bold mt-6 mb-3 text-gray-800 break-words">
                        {line}
                      </h2>
                    )
                  }
                  // Bullet points
                  else if (line.startsWith("•")) {
                    return (
                      <li key={index} className="text-sm mb-1 ml-4 list-disc text-black break-words">
                        {line.substring(2)}
                      </li>
                    )
                  }
                  // Numbered lists
                  else if (line.match(/^\d+\./)) {
                    return (
                      <li key={index} className="text-sm mb-1 ml-4 list-decimal text-black break-words">
                        {line.replace(/^\d+\.\s*/, "")}
                      </li>
                    )
                  }
                  // Empty lines
                  else if (line.trim() === "") {
                    return <div key={index} className="mb-3"></div>
                  }
                  // Regular paragraphs
                  else {
                    return (
                      <p key={index} className="text-sm mb-4 leading-relaxed text-black break-words">
                        {line}
                      </p>
                    )
                  }
                })}
            </div>
          </div>
        </div>

        {/* Status Bar */}
      </div>
    </WindowFrame>
  )
}
