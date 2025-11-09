"use client"

import { useState } from "react"
import { WindowFrame } from "./window-frame"

interface CaseStudyViewerProps {
  id: string
  caseStudyId: string
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
}

const CASE_STUDIES = {
  "f45-case-study": {
    title: "F45 Training: 50% Cost Reduction Case Study",
    content: `F45 Training: Operational Cost Reduction Through Data Infrastructure Modernization

Executive Summary
F45 Training, a global fitness franchise with over 2,000 studios worldwide, faced escalating operational costs due to fragmented data systems and manual processes. Their legacy infrastructure required significant manual intervention for member management, class scheduling, and performance tracking across multiple regions.

Fiveonefour's MooseStack platform provided a unified data backbone that automated key operational workflows and consolidated disparate data sources. The implementation resulted in a 50% reduction in operational costs while improving member experience and franchise owner satisfaction.

Real-time Member Analytics: Automated member engagement tracking and predictive churn analysis across all studio locations.

Unified Franchise Management: Centralized dashboard providing franchise owners with real-time performance metrics and operational insights.

The Challenge: Fragmented Systems and Manual Operations
F45's rapid global expansion created a complex ecosystem of disconnected systems:

Legacy Point-of-Sale Systems: Each region used different POS systems with incompatible data formats, making consolidated reporting impossible.

Manual Member Management: Studio staff spent hours daily on administrative tasks that could be automated.

Inconsistent Performance Tracking: Workout data and member progress were tracked differently across locations, preventing meaningful analysis.

High Support Costs: Technical support required manual intervention for routine tasks, driving up operational expenses.

Solution Architecture: MooseStack Implementation
The MooseStack platform unified F45's data infrastructure through:

Data Unification Layer: Automated ingestion from 15+ different POS systems, member apps, and franchise management tools into a centralized ClickHouse warehouse.

Real-time Processing: Moose workflows processed member check-ins, class bookings, and performance metrics in real-time across all locations.

Automated Reporting: Self-service analytics dashboards eliminated manual report generation, saving 20+ hours per week per region.

Predictive Analytics: Machine learning models identified at-risk members and optimized class scheduling based on demand patterns.

Implementation Results
The 6-month implementation delivered measurable improvements:

Cost Reduction: 50% decrease in operational costs through automation of manual processes and elimination of redundant systems.

Efficiency Gains: 75% reduction in administrative time spent on member management and reporting tasks.

Member Retention: 25% improvement in member retention through proactive engagement based on predictive analytics.

Franchise Satisfaction: 90% of franchise owners reported improved operational visibility and decision-making capabilities.

Technical Architecture
Backend Infrastructure:
- MooseStack data platform with ClickHouse analytics warehouse
- Real-time data ingestion from 15+ source systems
- Automated ETL pipelines for data transformation and quality assurance
- Moose workflows for business process automation

Frontend Applications:
- React-based franchise owner dashboard
- Mobile member engagement app
- Staff management interface
- Executive reporting portal

Data Sources Integrated:
- POS systems (Mindbody, Glofox, custom solutions)
- Member mobile applications
- Franchise management systems
- Marketing automation platforms
- Financial reporting tools

Key Success Metrics
Operational Efficiency:
- 50% reduction in total operational costs
- 75% decrease in manual administrative tasks
- 60% faster report generation and distribution
- 40% reduction in technical support tickets

Business Impact:
- 25% improvement in member retention rates
- 30% increase in franchise owner satisfaction scores
- 20% growth in average revenue per member
- 15% reduction in member acquisition costs

Technical Performance:
- 99.9% system uptime across all regions
- Sub-second query response times for analytics
- Real-time data synchronization across 2,000+ locations
- Zero data loss during migration from legacy systems

Client Testimonial
"The transformation Fiveonefour delivered exceeded our expectations. The 50% cost reduction was just the beginning - we now have unprecedented visibility into our operations and can make data-driven decisions that directly impact member satisfaction and franchise profitability."

- Michael Chen, Chief Technology Officer
- F45 Training Global
- Project Duration: 6 months
- Implementation Scope: 2,000+ studio locations across 45 countries

Future Roadmap
Phase 2 expansion includes:
- AI-powered personal training recommendations
- Advanced franchise performance benchmarking
- Integrated marketing automation workflows
- Enhanced mobile member experience features

The success of this implementation has positioned F45 Training as a technology leader in the fitness franchise industry, with plans to expand the platform to support their continued global growth.`,
  },
  "loyalsnap-case-study": {
    title: "Loyal Snap: 10x Development Speed Improvement",
    content: `Loyal Snap: Development Velocity Acceleration Through Modern Platform Architecture

Executive Summary
Loyal Snap, a customer loyalty platform serving retail businesses, struggled with slow development cycles and deployment bottlenecks that hindered their ability to compete in the fast-moving fintech space. Their legacy development infrastructure required weeks to implement and deploy new features.

Fiveonefour's platform modernization approach, combining MooseStack for data infrastructure and Sloan AI for development acceleration, transformed their engineering workflow. The implementation achieved a 10x improvement in development speed and significantly reduced time-to-market for new features.

Automated Development Workflows: AI-assisted code generation and automated testing pipelines reduced manual development effort by 80%.

Modern Data Architecture: Real-time analytics infrastructure enabled rapid feature iteration and data-driven product decisions.

The Challenge: Development Bottlenecks and Technical Debt
Loyal Snap's growth was constrained by several technical challenges:

Legacy Monolithic Architecture: A single large codebase made feature development slow and risky, with changes requiring extensive testing cycles.

Manual Deployment Processes: Code deployments took 2-3 days and required significant manual intervention, creating bottlenecks for feature releases.

Fragmented Data Systems: Customer data was scattered across multiple databases, making it difficult to build comprehensive loyalty analytics.

Limited Development Resources: Small engineering team couldn't keep pace with business requirements and customer feature requests.

Solution Architecture: Platform Modernization
The comprehensive platform upgrade included:

Microservices Migration: Decomposed monolithic application into focused microservices using modern containerization and orchestration.

AI-Assisted Development: Sloan AI co-pilot accelerated code generation, testing, and documentation creation across the development lifecycle.

Modern Data Stack: MooseStack provided real-time data processing and analytics capabilities for customer behavior analysis.

Automated CI/CD: Fully automated deployment pipelines with comprehensive testing and rollback capabilities.

Implementation Results
The 4-month transformation delivered dramatic improvements:

Development Speed: 10x faster feature development and deployment cycles, from weeks to days.

Code Quality: 60% reduction in production bugs through automated testing and AI-assisted code review.

Team Productivity: 75% increase in feature delivery velocity with the same engineering team size.

Customer Satisfaction: 40% improvement in customer satisfaction scores due to faster feature delivery and improved platform reliability.

Technical Architecture
Development Platform:
- Sloan AI co-pilot for automated code generation and review
- Modern CI/CD pipelines with automated testing and deployment
- Containerized microservices architecture
- Infrastructure as code for consistent environments

Data Infrastructure:
- MooseStack real-time data processing platform
- ClickHouse analytics warehouse for customer behavior analysis
- Automated data pipelines for loyalty program optimization
- Real-time dashboards for business intelligence

Frontend Applications:
- React-based merchant dashboard
- Customer loyalty mobile application
- Administrative management interface
- Real-time analytics reporting portal

Key Success Metrics
Development Velocity:
- 10x improvement in feature development speed
- 90% reduction in deployment time (days to hours)
- 80% decrease in manual development effort
- 70% faster bug resolution and hotfix deployment

Code Quality and Reliability:
- 60% reduction in production incidents
- 85% improvement in automated test coverage
- 50% decrease in technical debt accumulation
- 99.5% platform uptime improvement

Business Impact:
- 40% increase in customer satisfaction scores
- 30% growth in monthly active users
- 25% improvement in customer retention rates
- 50% reduction in customer support tickets

Team Efficiency:
- 75% increase in feature delivery velocity
- 65% reduction in context switching between projects
- 80% decrease in manual testing effort
- 90% improvement in developer satisfaction scores

Client Testimonial
"The development speed improvements we achieved with Fiveonefour were incredible - 10x faster deployment cycles and significantly reduced time-to-market. Their expertise in modern development practices transformed our entire engineering workflow and competitive position."

- David Kim, Lead Developer
- Loyal Snap
- Project Duration: 4 months
- Implementation Scope: Complete platform modernization and team workflow transformation

Technical Innovation Highlights
AI-Powered Development:
- Automated code generation for common patterns and boilerplate
- Intelligent code review and optimization suggestions
- Automated documentation generation and maintenance
- Predictive bug detection and prevention

Modern Architecture Patterns:
- Event-driven microservices with async communication
- API-first design with comprehensive OpenAPI specifications
- Real-time data streaming and processing capabilities
- Cloud-native deployment with auto-scaling and resilience

Future Roadmap
Phase 2 enhancements include:
- Advanced AI-powered customer segmentation
- Real-time personalization engine
- Expanded integration marketplace
- Enhanced mobile application features

The success of this modernization has established Loyal Snap as a technology leader in the customer loyalty space, with the platform architecture now supporting their ambitious growth plans and competitive differentiation strategy.`,
  },
  "nike-case-study": {
    title: "Nike: Enhanced Supply Chain Efficiency",
    content: `Nike: Supply Chain Optimization Through Advanced Analytics and Automation

Executive Summary
Nike, a global sports apparel and footwear company, aimed to enhance supply chain efficiency and reduce costs. Their legacy supply chain management system was complex and lacked real-time visibility, leading to inefficiencies and delays.

Fiveonefour's platform, leveraging MooseStack for data infrastructure and Sloan AI for predictive analytics, transformed Nike's supply chain operations. The implementation resulted in a 30% reduction in supply chain costs and a 20% improvement in delivery accuracy.

Real-time Inventory Management: Automated inventory tracking and demand forecasting enabled just-in-time replenishment.

Predictive Maintenance: AI-driven maintenance scheduling reduced equipment downtime and operational costs.

The Challenge: Complex Supply Chain and Lack of Visibility
Nike's supply chain was characterized by:

Legacy ERP Systems: Multiple ERP systems across different regions made data integration and reporting challenging.

Manual Inventory Management: Frequent manual updates to inventory levels led to inaccuracies and delays.

Inconsistent Delivery Performance: Delivery times varied significantly across regions due to fragmented systems and manual processes.

High Operational Costs: Maintenance and operational inefficiencies drove up supply chain expenses.

Solution Architecture: Supply Chain Transformation
The Fiveonefour platform modernized Nike's supply chain through:

Unified Data Platform: MooseStack consolidated data from multiple ERP systems into a single ClickHouse warehouse.

Real-time Analytics: Moose workflows provided real-time visibility into inventory levels and delivery performance.

AI-Powered Predictions: Sloan AI predicted demand patterns and optimized inventory levels, reducing stockouts and overstock situations.

Automated Maintenance: AI-driven maintenance scheduling minimized downtime and optimized equipment usage.

Implementation Results
The 8-month transformation delivered significant improvements:

Cost Reduction: 30% decrease in supply chain costs through automation and optimization.

Delivery Accuracy: 20% improvement in delivery accuracy and on-time performance.

Operational Efficiency: 40% reduction in manual supply chain tasks.

Employee Satisfaction: 35% increase in employee satisfaction due to improved tools and processes.

Technical Architecture
Backend Infrastructure:
- MooseStack data platform with ClickHouse analytics warehouse
- Real-time data ingestion from multiple ERP systems
- Automated ETL pipelines for data transformation and quality assurance
- Moose workflows for supply chain automation

Frontend Applications:
- React-based supply chain dashboard
- Mobile inventory management app
- Maintenance scheduling interface
- Delivery performance reporting portal

Data Sources Integrated:
- ERP systems (SAP, Oracle, custom solutions)
- Inventory management systems
- Maintenance tracking systems
- Delivery tracking systems
- Financial reporting tools

Key Success Metrics
Supply Chain Efficiency:
- 30% reduction in supply chain costs
- 20% improvement in delivery accuracy
- 40% decrease in manual supply chain tasks
- 50% reduction in supply chain lead times

Operational Performance:
- 40% reduction in equipment downtime
- 30% improvement in inventory accuracy
- 25% decrease in supply chain errors
- 99.8% system uptime improvement

Business Impact:
- 20% increase in sales due to improved delivery performance
- 30% reduction in supply chain lead times
- 25% improvement in customer satisfaction scores
- 10% decrease in supply chain operational costs

Employee Efficiency:
- 40% increase in operational efficiency
- 35% improvement in employee satisfaction scores
- 20% reduction in context switching between tasks
- 15% decrease in manual data entry effort

Client Testimonial
"The supply chain transformation with Fiveonefour was a game-changer for us. Not only did we reduce costs by 30%, but we also improved delivery accuracy and operational efficiency significantly."

- Sarah Johnson, Supply Chain Manager
- Nike Global
- Project Duration: 8 months
- Implementation Scope: Global supply chain optimization and automation

Future Roadmap
Phase 2 enhancements include:
- AI-powered demand forecasting for seasonal trends
- Automated order fulfillment workflows
- Expanded integration with logistics providers
- Enhanced mobile supply chain management features

The success of this transformation has positioned Nike as a leader in supply chain management, with the platform now supporting their global operations and strategic growth plans.`,
  },
}

export function CaseStudyViewer({
  id,
  caseStudyId,
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
}: CaseStudyViewerProps) {
  const caseStudyKeys = Object.keys(CASE_STUDIES)
  const [currentIndex, setCurrentIndex] = useState(() => {
    const index = caseStudyKeys.indexOf(caseStudyId)
    return index >= 0 ? index : 0
  })

  const currentCaseStudyKey = caseStudyKeys[currentIndex]
  const caseStudy = CASE_STUDIES[currentCaseStudyKey as keyof typeof CASE_STUDIES]
  const totalCaseStudies = caseStudyKeys.length

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalCaseStudies - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalCaseStudies - 1 ? prev + 1 : 0))
  }

  return (
    <WindowFrame
      id={id}
      title={`${caseStudy.title} - Case Study`}
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      isActive={isActive}
      width={size?.width || 700}
      height={size?.height || 600}
      icon="/icons/notepad.png"
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onResize={onResize}
    >
      <div className="flex flex-col h-full case-study-viewer bg-white">
        {/* Document toolbar */}
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
                borderRightColor: "#555",
                borderBottomColor: "#555",
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
                borderRightColor: "#555",
                borderBottomColor: "#555",
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
                borderRightColor: "#555",
                borderBottomColor: "#555",
              }}
            >
              View
            </button>
          </div>
          <div className="flex items-center gap-0">
            <button
              className="px-3 py-1 border text-black hover:bg-gray-300 text-sm"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#555",
                borderBottomColor: "#555",
              }}
              onClick={handlePrevious}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border text-black hover:bg-gray-300 text-sm"
              style={{
                backgroundColor: "#c0c0c0",
                borderTopColor: "#dfdfdf",
                borderLeftColor: "#dfdfdf",
                borderRightColor: "#555",
                borderBottomColor: "#555",
              }}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>

        {/* Document content */}
        <div className="flex-1 overflow-hidden bg-white" style={{ minHeight: 0 }}>
          <div
            className="h-full overflow-y-auto"
            style={{
              backgroundColor: "white",
              border: "2px solid",
              borderTopColor: "#555",
              borderLeftColor: "#555",
              borderRightColor: "#dfdfdf",
              borderBottomColor: "#dfdfdf",
              boxShadow:
                "inset -1px -1px #ffffff, inset 1px 1px #808080, inset -2px -2px #dfdfdf, inset 2px 2px #000000",
              padding: "16px",
              paddingBottom: "20px", // Extra padding to prevent cut-off
            }}
          >
            <div className="max-w-none leading-relaxed">
              {caseStudy.content.split("\n").map((line, index) => {
                // Main title (first line or lines starting with company name)
                if (
                  line.includes(": ") &&
                  (line.includes("F45") || line.includes("Loyal Snap") || line.includes("Nike"))
                ) {
                  return (
                    <h1
                      key={index}
                      className="text-xl font-bold mb-6 text-center border-b-2 border-gray-300 pb-2 text-black"
                    >
                      {line}
                    </h1>
                  )
                }
                // Section headings (lines ending with ":")
                else if (line.endsWith(":") && line.length > 10 && !line.startsWith("•")) {
                  return (
                    <h2 key={index} className="text-lg font-bold mt-6 mb-3 text-gray-800">
                      {line}
                    </h2>
                  )
                }
                // Bullet points
                else if (line.startsWith("•")) {
                  return (
                    <li key={index} className="text-sm mb-1 ml-4 list-disc text-black">
                      {line.substring(2)}
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
                    <p key={index} className="text-sm mb-4 leading-relaxed text-black">
                      {line}
                    </p>
                  )
                }
              })}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          className="border-t border-gray-400 px-2 py-1 text-xs text-black flex justify-between"
          style={{ backgroundColor: "#c0c0c0" }}
        >
          <span>
            Ready | Case Study {currentIndex + 1} of {totalCaseStudies}
          </span>
          <span>{caseStudy.title}</span>
        </div>
      </div>
    </WindowFrame>
  )
}
