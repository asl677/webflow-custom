"use client"

import { useState } from "react"
import { WindowFrame } from "./window-frame"

interface TestimonialViewerProps {
  id: string
  testimonialId: string
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

const TESTIMONIALS = {
  "nike-testimonial": {
    title: "Nike: 40% Engagement Increase Success Story",
    content: `Nike: Customer Engagement Transformation Through Advanced Analytics Platform

Executive Summary
Nike, the global athletic footwear and apparel leader, sought to enhance customer engagement across their digital ecosystem. Their existing analytics infrastructure provided limited insights into customer behavior patterns and engagement optimization opportunities.

Fiveonefour's analytics platform implementation delivered a comprehensive customer intelligence solution that increased engagement by 40% while reducing operational costs by 25%. The platform provided real-time insights that revolutionized Nike's approach to customer relationship management and digital marketing.

Real-time Customer Intelligence: Advanced behavioral analytics and predictive modeling enabled personalized customer experiences at scale.

Unified Data Architecture: Consolidated customer data from multiple touchpoints into a single, actionable intelligence platform.

The Challenge: Fragmented Customer Data and Limited Insights
Nike's digital transformation faced several critical challenges:

Siloed Data Systems: Customer interactions were tracked across multiple platforms (mobile app, website, retail stores, social media) without unified analysis capabilities.

Limited Real-time Insights: Existing analytics tools provided historical reporting but lacked real-time customer behavior analysis for immediate optimization.

Engagement Optimization: Without comprehensive customer intelligence, Nike struggled to deliver personalized experiences that drive meaningful engagement.

Operational Inefficiencies: Manual data analysis and reporting processes consumed significant resources while providing limited actionable insights.

Solution Architecture: Advanced Analytics Platform
The comprehensive analytics transformation included:

Unified Customer Data Platform: Real-time ingestion and processing of customer interactions from all digital touchpoints using MooseStack infrastructure.

Advanced Behavioral Analytics: Machine learning models analyzed customer journey patterns, preferences, and engagement triggers across the entire ecosystem.

Personalization Engine: AI-driven recommendation system delivered personalized product suggestions, content, and experiences based on individual customer profiles.

Real-time Optimization: Automated A/B testing and experience optimization based on continuous customer behavior analysis and engagement metrics.

Implementation Results
The 8-month implementation delivered exceptional business outcomes:

Engagement Growth: 40% increase in customer engagement across all digital platforms and touchpoints.

Cost Optimization: 25% reduction in operational costs through automation of manual analytics and reporting processes.

Revenue Impact: 30% improvement in conversion rates through personalized customer experiences and targeted recommendations.

Customer Satisfaction: 35% increase in customer satisfaction scores and Net Promoter Score (NPS) improvements.

Technical Architecture
Analytics Infrastructure:
- MooseStack real-time data processing platform
- ClickHouse analytics warehouse for high-performance queries
- Machine learning pipeline for behavioral analysis and predictions
- Real-time personalization and recommendation engine

Data Integration:
- Mobile application behavioral tracking
- E-commerce website interaction analysis
- Retail store purchase and interaction data
- Social media engagement and sentiment analysis
- Customer service interaction logs

Frontend Applications:
- Executive analytics dashboard
- Marketing campaign optimization interface
- Customer service intelligence portal
- Real-time personalization management system

Key Success Metrics
Customer Engagement:
- 40% increase in overall customer engagement rates
- 50% improvement in mobile app session duration
- 35% growth in repeat purchase behavior
- 45% increase in social media interaction rates

Business Performance:
- 30% improvement in conversion rates across all channels
- 25% increase in average order value
- 20% growth in customer lifetime value
- 15% reduction in customer acquisition costs

Operational Efficiency:
- 25% reduction in operational costs
- 60% decrease in manual reporting effort
- 75% faster insight generation and decision-making
- 80% improvement in campaign optimization speed

Technical Performance:
- 99.9% platform uptime and reliability
- Sub-second query response times for real-time analytics
- Real-time data processing across millions of customer interactions
- Seamless integration with existing Nike technology infrastructure

Client Testimonial
"Working with Fiveonefour has been transformative for our data operations. Their analytics platform helped us increase customer engagement by 40% and reduce operational costs by 25%. The real-time insights have revolutionized how we make business decisions and connect with our customers."

- Sarah Johnson, VP of Digital Strategy
- Nike Inc.
- Project Duration: 8 months
- Implementation Scope: Global digital ecosystem transformation

Advanced Analytics Capabilities
Customer Intelligence:
- Real-time behavioral segmentation and analysis
- Predictive customer lifetime value modeling
- Churn prediction and retention optimization
- Cross-platform customer journey mapping

Personalization Features:
- AI-powered product recommendation engine
- Dynamic content personalization across all touchpoints
- Automated email marketing optimization
- Real-time website experience customization

Marketing Optimization:
- Advanced attribution modeling and campaign analysis
- Real-time A/B testing and experience optimization
- Automated audience segmentation and targeting
- Performance prediction and budget optimization

Future Roadmap
Phase 2 enhancements include:
- Advanced AI-powered customer service automation
- Expanded social media sentiment analysis and engagement
- Enhanced mobile app personalization features
- Integration with emerging digital marketing channels

The success of this analytics transformation has positioned Nike as a leader in customer-centric digital experiences, with the platform now supporting their global growth strategy and competitive differentiation in the athletic apparel market.`,
  },
  "f45-testimonial": {
    title: "F45 Training: 50% Cost Savings Success Story",
    content: `F45 Training, the world's leading functional fitness franchise with over 2,000 studios globally, partnered with Fiveonefour to modernize their operational infrastructure and reduce escalating costs. The legacy systems and manual processes were hindering their ability to scale efficiently across international markets.

Fiveonefour's comprehensive platform solution delivered a 50% reduction in operational costs while significantly improving member experience and franchise owner satisfaction. The implementation transformed F45's operational model from reactive to proactive, enabling data-driven decision making at scale.

Operational Cost Reduction: Automated workflows and unified data systems eliminated manual processes and reduced operational overhead by 50%.

Enhanced Member Experience: Real-time analytics and personalized engagement improved member retention and satisfaction across all locations.

The Challenge: Scaling Operations Across Global Markets
F45's rapid international expansion created complex operational challenges:

Fragmented Technology Stack: Each regional market used different systems for member management, scheduling, and performance tracking, creating data silos and operational inefficiencies.

Manual Administrative Processes: Studio staff spent excessive time on administrative tasks that could be automated, reducing focus on member experience and training quality.

Inconsistent Reporting: Franchise owners lacked unified visibility into studio performance, member engagement, and operational metrics across their locations.

High Support Costs: Technical support and system maintenance required significant manual intervention, driving up operational expenses and reducing profitability.

Solution Architecture: Unified Operational Platform
The comprehensive operational transformation included:

Centralized Data Infrastructure: MooseStack platform unified data from all studio locations, member applications, and franchise management systems into a single analytics warehouse.

Automated Workflow Engine: Intelligent automation eliminated manual processes for member onboarding, class scheduling, performance tracking, and franchise reporting.

Real-time Analytics Dashboard: Comprehensive business intelligence platform provided franchise owners and corporate leadership with actionable insights and performance metrics.

Predictive Member Analytics: Machine learning models identified at-risk members and optimized class scheduling based on demand patterns and member preferences.

Implementation Results
The 6-month transformation delivered measurable business impact:

Cost Reduction: 50% decrease in operational costs through automation and system consolidation across all markets.

Efficiency Gains: 75% reduction in administrative time, allowing staff to focus on member experience and training quality.

Member Retention: 25% improvement in member retention rates through proactive engagement and personalized experiences.

Franchise Satisfaction: 90% of franchise owners reported improved operational visibility and decision-making capabilities.

Technical Architecture
Platform Infrastructure:
- MooseStack unified data processing and analytics platform
- ClickHouse analytics warehouse for high-performance reporting
- Real-time data synchronization across 2,000+ studio locations
- Automated ETL pipelines for data quality and consistency

Application Ecosystem:
- Franchise owner business intelligence dashboard
- Member engagement and performance tracking application
- Staff management and scheduling interface
- Corporate executive reporting and analytics portal

Data Integration:
- Point-of-sale systems across multiple vendors and regions
- Member mobile applications and wearable device data
- Franchise management and financial reporting systems
- Marketing automation and customer communication platforms

Key Success Metrics
Operational Excellence:
- 50% reduction in total operational costs across all markets
- 75% decrease in manual administrative tasks and processes
- 60% faster report generation and business intelligence delivery
- 40% reduction in technical support tickets and system issues

Business Growth:
- 25% improvement in member retention rates globally
- 30% increase in franchise owner satisfaction and engagement
- 20% growth in average revenue per member across all studios
- 15% reduction in member acquisition costs through improved targeting

Technical Performance:
- 99.9% system uptime and reliability across all regions
- Real-time data synchronization across 2,000+ studio locations
- Sub-second query response times for analytics and reporting
- Zero data loss during migration from legacy systems

Franchise Impact:
- 90% of franchise owners report improved operational visibility
- 85% reduction in time spent on administrative reporting
- 70% improvement in data-driven decision making capabilities
- 60% faster resolution of operational issues and challenges

Client Testimonial
"Fiveonefour's solution delivered exactly what we needed - a 50% reduction in operational costs while improving our member experience. Their team understood our fitness industry challenges and built a platform that scales with our rapid growth. The transformation has been remarkable."

- Michael Chen, Chief Technology Officer
- F45 Training Global
- Project Duration: 6 months
- Implementation Scope: 2,000+ studio locations across 45 countries

Operational Transformation Highlights
Automation Achievements:
- Automated member onboarding and engagement workflows
- Intelligent class scheduling based on demand prediction
- Automated franchise reporting and performance analytics
- Streamlined billing and payment processing across all markets

Data Unification:
- Consolidated 15+ different point-of-sale and management systems
- Unified member data across mobile apps, wearables, and studio systems
- Centralized franchise performance and financial reporting
- Real-time synchronization of operational data across all locations

Member Experience Enhancement:
- Personalized workout recommendations based on performance data
- Proactive member engagement and retention programs
- Real-time class availability and booking optimization
- Enhanced mobile app experience with unified data access

Future Roadmap
Phase 2 expansion includes:
- AI-powered personal training recommendations and program optimization
- Advanced franchise performance benchmarking and competitive analysis
- Enhanced mobile member experience with social features and challenges
- Expanded integration with wearable devices and fitness tracking platforms

The success of this operational transformation has established F45 Training as a technology leader in the fitness franchise industry, with the platform now supporting their continued global expansion and competitive differentiation strategy.`,
  },
  "loyalsnap-testimonial": {
    title: "Loyal Snap: 10x Development Speed Achievement",
    content: `Loyal Snap, an innovative customer loyalty platform serving retail businesses, faced significant development bottlenecks that limited their ability to compete effectively in the rapidly evolving fintech landscape. Their legacy development infrastructure and processes resulted in slow feature delivery and extended time-to-market cycles.

Fiveonefour's comprehensive platform modernization approach, combining advanced development tools with AI-assisted workflows, achieved a remarkable 10x improvement in development speed. The transformation enabled Loyal Snap to dramatically reduce time-to-market while maintaining high code quality and system reliability.

Development Acceleration: AI-powered development tools and automated workflows reduced feature development time from weeks to days.

Platform Modernization: Modern architecture and infrastructure enabled rapid scaling and continuous deployment capabilities.

The Challenge: Development Bottlenecks Limiting Growth
Loyal Snap's growth ambitions were constrained by several critical development challenges:

Legacy Monolithic Architecture: A single, large codebase made feature development slow and risky, requiring extensive testing cycles and careful coordination for any changes.

Manual Development Processes: Code reviews, testing, and deployment processes were largely manual, creating bottlenecks and increasing the risk of human error.

Limited Development Resources: A small but talented engineering team couldn't keep pace with business requirements and customer feature requests using traditional development approaches.

Slow Time-to-Market: New features and improvements took weeks to develop and deploy, limiting Loyal Snap's ability to respond quickly to market opportunities and customer needs.

Solution Architecture: AI-Powered Development Platform
The comprehensive development transformation included:

AI-Assisted Development: Sloan AI co-pilot accelerated code generation, automated testing, and documentation creation throughout the entire development lifecycle.

Microservices Architecture: Decomposed the monolithic application into focused, independently deployable microservices with clear boundaries and responsibilities.

Automated CI/CD Pipeline: Fully automated continuous integration and deployment pipeline with comprehensive testing, security scanning, and rollback capabilities.

Modern Data Infrastructure: MooseStack platform provided real-time data processing and analytics capabilities for customer behavior analysis and platform optimization.

Implementation Results
The 4-month development transformation delivered exceptional improvements:

Development Speed: 10x faster feature development and deployment cycles, reducing time-to-market from weeks to days.

Code Quality: 60% reduction in production bugs through automated testing, AI-assisted code review, and improved development practices.

Team Productivity: 75% increase in feature delivery velocity with the same engineering team size and resources.

Customer Satisfaction: 40% improvement in customer satisfaction scores due to faster feature delivery and improved platform reliability.

Technical Architecture
Development Platform:
- Sloan AI co-pilot for automated code generation and intelligent code review
- Modern CI/CD pipelines with automated testing, security scanning, and deployment
- Containerized microservices architecture with Kubernetes orchestration
- Infrastructure as code for consistent and reproducible environments

Data and Analytics:
- MooseStack real-time data processing platform for customer analytics
- ClickHouse analytics warehouse for high-performance customer behavior analysis
- Automated data pipelines for loyalty program optimization and insights
- Real-time dashboards for business intelligence and operational monitoring

Application Ecosystem:
- React-based merchant dashboard with modern user experience
- Customer loyalty mobile application with real-time features
- Administrative management interface for platform configuration
- Real-time analytics and reporting portal for business insights

Key Success Metrics
Development Velocity:
- 10x improvement in feature development speed and delivery
- 90% reduction in deployment time from days to hours
- 80% decrease in manual development effort and overhead
- 70% faster bug resolution and hotfix deployment cycles

Code Quality and Reliability:
- 60% reduction in production incidents and system issues
- 85% improvement in automated test coverage across the platform
- 50% decrease in technical debt accumulation and maintenance overhead
- 99.5% platform uptime and reliability improvement

Business Impact:
- 40% increase in customer satisfaction and Net Promoter Score
- 30% growth in monthly active users and platform engagement
- 25% improvement in customer retention rates and loyalty
- 50% reduction in customer support tickets and platform issues

Team Efficiency:
- 75% increase in feature delivery velocity and throughput
- 65% reduction in context switching between projects and tasks
- 80% decrease in manual testing effort and quality assurance overhead
- 90% improvement in developer satisfaction and team morale

Client Testimonial
"The development speed improvements we achieved with Fiveonefour were incredible - 10x faster deployment cycles and significantly reduced time-to-market. Their expertise in modern development practices transformed our entire engineering workflow and competitive position in the market."

- David Kim, Lead Developer
- Loyal Snap
- Project Duration: 4 months
- Implementation Scope: Complete platform modernization and development workflow transformation

Development Innovation Highlights
AI-Powered Development:
- Automated code generation for common patterns, boilerplate, and repetitive tasks
- Intelligent code review with optimization suggestions and best practice recommendations
- Automated documentation generation and maintenance for all platform components
- Predictive bug detection and prevention through advanced static analysis

Modern Architecture Patterns:
- Event-driven microservices with asynchronous communication and resilience patterns
- API-first design with comprehensive OpenAPI specifications and automated client generation
- Real-time data streaming and processing capabilities for customer analytics
- Cloud-native deployment with auto-scaling, monitoring, and disaster recovery

Development Workflow Optimization:
- Fully automated CI/CD pipeline with parallel testing and deployment stages
- Feature flag management for safe, gradual feature rollouts and A/B testing
- Automated security scanning and vulnerability assessment throughout the development lifecycle
- Comprehensive monitoring and observability for proactive issue detection and resolution

Future Roadmap
Phase 2 enhancements include:
- Advanced AI-powered customer segmentation and personalization features
- Real-time recommendation engine for loyalty program optimization
- Expanded integration marketplace with third-party retail and payment systems
- Enhanced mobile application features with social and gamification elements

The success of this development transformation has established Loyal Snap as a technology leader in the customer loyalty platform space, with their modern architecture and development practices now supporting ambitious growth plans and competitive differentiation in the fintech market.`,
  },
}

export function TestimonialViewer({
  id,
  testimonialId,
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
}: TestimonialViewerProps) {
  const testimonial = TESTIMONIALS[testimonialId as keyof typeof TESTIMONIALS] || TESTIMONIALS["nike-testimonial"]
  const [currentIndex] = useState(0)
  const totalTestimonials = Object.keys(TESTIMONIALS).length

  return (
    <WindowFrame
      id={id}
      title={`${testimonial.title} - Testimonial`}
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
      <div className="flex flex-col h-full testimonial-viewer bg-white dark:bg-black">
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

        {/* Document content */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-black py-0 px-0" style={{ minHeight: 0 }}>
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
              {testimonial.content.split("\n").map((line, index) => {
                // Main title (first line or lines starting with company name)
                if (
                  line.includes(": ") &&
                  (line.includes("Nike") || line.includes("F45") || line.includes("Loyal Snap"))
                ) {
                  return (
                    <h1
                      key={index}
                      className="text-xl font-bold mb-6 text-center border-b-2 border-gray-300 dark:border-gray-600 pb-2 text-black dark:text-white"
                    >
                      {line}
                    </h1>
                  )
                }
                // Section headings (lines ending with ":")
                else if (line.endsWith(":") && line.length > 10 && !line.startsWith("•")) {
                  return (
                    <h2 key={index} className="text-lg font-bold mt-6 mb-3 text-gray-800 dark:text-white">
                      {line}
                    </h2>
                  )
                }
                // Bullet points
                else if (line.startsWith("•")) {
                  return (
                    <li key={index} className="text-sm mb-1 ml-4 list-disc text-black dark:text-white">
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
                    <p key={index} className="flex-1 p-4 overflow-hidden bg-white dark:bg-black py-0">
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
            Ready | Testimonial {currentIndex + 1} of {totalTestimonials}
          </span>
          <span>{testimonial.title}</span>
        </div>
      </div>
    </WindowFrame>
  )
}
