"use client"
import { WindowFrame } from "./window-frame"

interface WordEditorProps {
  id: string
  title: string
  content: string
  position: { x: number; y: number }
  zIndex: number
  isAnimating?: boolean
  isMinimized?: boolean
  isMaximized?: boolean
  onMaximize?: () => void
  size?: { width: number; height: number }
  isActive?: boolean
  onClose: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onMinimize?: () => void
  onResize?: (size: { width: number; height: number }) => void
}

const AIOPS_WHITEPAPER_CONTENT = `AIOps for Network Backbone Operations: Anomaly Detection & Predictive Maintenance with Fiveonefour's MooseStack and Sloan

Executive Summary 
In today's complex network backbones, like those of major ISPs, the sheer volume of data is overwhelming. Traditional, reactive monitoring methods can't keep up, leading to costly outages and frustrated customers. AIOps (Artificial Intelligence for IT Operations) is the answer. It uses machine learning to analyze massive data streams, enabling automated anomaly detection and predictive maintenance. This shift from reactive to proactive operations is key to maintaining network health and efficiency.

Fiveonefour's platform is a powerful toolkit for implementing this AIOps strategy. The MooseStack provides an open-source data backbone for real-time analytics, while Sloan, an AI co-pilot, delivers intelligent agents for analysis and automation. Together, they ingest and analyze network data to flag unusual behaviors and forecast potential failures.

Real-time Anomaly Detection: Automatically flags network issues as they occur, providing early warnings that human operators might miss.

Predictive Maintenance: Forecasts component failures and capacity shortfalls, allowing teams to schedule proactive repairs and upgrades, thereby avoiding costly unplanned downtime.

For companies like Charter Communications, this solution can transform their network operations, leading to reduced downtime and faster incident resolution. Industry studies suggest that predictive maintenance can slash maintenance costs by 10-40% and cut downtime in half.

The Challenge: The Data Deluge and the Cost of Reactivity
The network backbone of a large service provider is a high-stakes, high-volume environment. It generates terabytes of logs, metrics, and events daily. Without a unified approach, this data gets siloed, making it nearly impossible for network operations teams to get a full picture. They often find themselves in a constant state of "firefighting," reacting to problems only after they've impacted users.

This reactive model has several major drawbacks:
Inefficient Scheduled Maintenance: Maintenance is often based on fixed intervals rather than actual equipment condition, leading to wasted resources or missed warning signs.
Complex Root Cause Analysis: Diagnosing an outage can take hours or even days as engineers manually sift through disparate data sources.
High Cost of Downtime: An hour of backbone downtime can cost millions in lost revenue and damage to reputation.

The solution is to move beyond simple monitoring and static thresholds. AIOps applies machine learning to continuously analyze data, identifying subtle patterns that precede major incidents. This approach creates a "smart nerve center" for network operations, enabling teams to act on insights rather than just respond to alarms.

Data Unification & OLAP Modernization: From Legacy Stores to AIOps-Ready Data

Why this is hard in backbone operations
Backbone environments accumulate years of telemetry, tickets, configs, and inventory scattered across MongoDB, Postgres, Excel/CSV, homegrown tools, vendor systems, and many, many more. Turning that into a single, analytics-grade corpus is difficult because:

Source sprawl & heterogeneity: JSON docs, relational tables, spreadsheets, delimited logs, and proprietary exports all coexist.

Schema drift & late-arriving data: Device firmware changes and tooling updates add/rename fields; backfills arrive out of order.

Identity & semantics mismatches: device_id vs. hostname; ifIndex vs. ifName; inconsistent units/timezones; regional calendars.

Batch vs. streaming: Some sources are daily dumps; others are second-by-second telemetry. Aligning them on a common timeline is non-trivial.

Cost/performance trade-offs: OLTP systems (Mongo/Postgres) aren't optimized for multi-billion-row scans; spreadsheets lack lineage, quality checks, and repeatability.

AIOps-ready means: a time-indexed, columnar OLAP backbone (e.g., ClickHouse) with unified keys, normalized schemas, rollups/materialized views, feature tables for ML, and data quality SLAs—queryable in seconds, not minutes.

How Fiveonefour accelerates unification (≈90% less effort)
Fiveonefour reduces the manual glue work of data unification by roughly 90% (typical internal benchmark across deployments) via opinionated building blocks:

1) Connectors & CDC out of the box (MooseStack)
Postgres/MySQL: incremental ingest via logical decoding/LSNs; schema introspection → typed OLAP tables.

MongoDB: change streams or snapshot+resume; JSON→columnar projection with nested-field mapping.

Excel/CSV/S3: bulk loaders with header inference, type promotion, and partitioning by date/device/site.

Kafka/Redpanda: high-throughput telemetry/log streams directly mapped to OLAP partitions.

Debezium-compatible inputs: reuse existing CDC where present.

2) Schemas & pipelines "as code"
Declarative stream/table models (TypeScript/Python) generate OLAP DDL, partitioning, TTL, and MVs (1-min/5-min rollups) automatically.

Migrations & lineage tracked in Git; reproducible environments for dev/stage/prod.

3) Network telemetry normalization kit
Canonical entities: Device, Interface, Link, Path, Region with stable keys.

Vendor-agnostic mappings (e.g., optical RX/TX, CRC, drops) → common column names & units.

SCD-2-style config histories (firmware, line cards, optics) to support time-accurate joins.

4) Built-in data quality & observability
Contracts (null %, range checks, referential integrity), lag/completeness monitors, and quarantine tables for bad records.

Pipeline health dashboards (ingest throughput, backfill progress, skew) with alerts.

5) Sloan co-pilot for rapid authoring
Natural-language prompts → generated Moose pipelines, SQL views, and backfill jobs.

Auto-generated join recipes (e.g., syslog ↔ interface metrics ↔ change windows) with explainable lineage.

Guided reconciliation (e.g., "These 2% of interfaces mismatch on key; propose mapping rules?").

What the 90% reduction looks like in practice

Task | Traditional (manual ETL/tooling) | With Fiveonefour (MooseStack + Sloan)
Source inventory & schema mapping | 1–2 weeks of interviews & SQL spelunking | Auto-introspection + Sloan prompts: 1–2 days
Standing up pipelines (8–12 sources) | 4–6 weeks of bespoke code & schedulers | Declarative connectors & workflows: 3–5 days
Normalization & key reconciliation | 2–3 weeks of ad-hoc scripts | Templates + guided rules: 2–3 days
Backfill + CDC cutover | 1–2 weeks with one-off scripts | Built-in snapshot/resume: 1–3 days
DQ/observability | 1 week custom dashboards | Contracts & monitors out-of-the-box: hours

Example composite: A multi-source backbone (Postgres inventory, Mongo incidents, Excel maintenance logs, telemetry via Kafka) often moves from "data everywhere" to a unified OLAP with curated marts in 1–2 weeks vs 8–12 weeks—a ~90% reduction in integration time and human effort.

Reference pattern: "Lift-and-Stream" cutover
Snapshot legacy DBs (Postgres/Mongo) and bulk-load Excel/CSV into raw OLAP tables.

Stand up CDC from OLTP sources; resume from snapshot offsets.

Normalize into curated tables (entities, signals, relationships) via materialized views.

Publish AIOps-ready marts (anomaly inputs, feature stores, golden-signal rollups).

Compare & validate (row counts, checksums, KPI parity), then flip consumers (dashboards/ML) to OLAP.

Sunset ad-hoc extracts; keep CDC for continuous freshness.

Risk controls & governance
Zero-downtime migration (read-only on sources; backpressure-aware loaders).

Row-level audits and revert plans for mappings.

RBAC/PII handling at ingest; tokenization where needed.

Versioned model cards for curated marts feeding anomaly detectors and predictive models.`

const DOCKER_DESKTOP_CONTENT = `Docker Desktop: Container Management Platform

Docker Desktop is a comprehensive container management platform that provides developers with an easy-to-use interface for building, running, and managing Docker containers on their local machines.

Key Features:
• Container lifecycle management
• Image repository integration
• Development environment consistency
• Resource monitoring and optimization
• Kubernetes integration support

Docker Desktop simplifies the containerization workflow, allowing developers to focus on building applications rather than managing infrastructure complexities.`

const NEON_DB_CONTENT = `Neon Database: Serverless PostgreSQL Platform

Neon is a modern, serverless PostgreSQL platform designed for developers who need scalable, cost-effective database solutions without the operational overhead of traditional database management.

Platform Benefits:
• Automatic scaling based on demand
• Branching for database schema changes
• Point-in-time recovery capabilities
• Global edge deployment options
• Developer-friendly API integration

Neon combines the power of PostgreSQL with modern cloud-native architecture, enabling teams to build data-driven applications with confidence and efficiency.`

export function WordEditor({
  id,
  title,
  content,
  position,
  zIndex,
  isAnimating,
  isMinimized,
  isMaximized,
  onMaximize,
  size,
  isActive,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onResize,
}: WordEditorProps) {
  const displayContent =
    content === "aiops-whitepaper"
      ? AIOPS_WHITEPAPER_CONTENT
      : content === "docker-desktop"
        ? DOCKER_DESKTOP_CONTENT
        : content === "neon-db"
          ? NEON_DB_CONTENT
          : content

  const isDockerApp = content === "docker-desktop"
  const isNeonApp = content === "neon-db"

  if (isDockerApp || isNeonApp) {
    return (
      <WindowFrame
        id={id}
        title={`${isDockerApp ? "Docker Desktop" : "Neon Database"} - Document`}
        position={position}
        zIndex={zIndex}
        isAnimating={isAnimating}
        isMinimized={isMinimized}
        isMaximized={isMaximized}
        onMaximize={onMaximize}
        width={size?.width || 700}
        height={size?.height || 600}
        icon="/icons/notepad.png"
        isActive={isActive}
        onClose={onClose}
        onFocus={onFocus}
        onMove={onMove}
        onMinimize={onMinimize}
        onResize={onResize}
        customFooterContent={
          <div className="flex justify-between w-full">
            <span className="flex items-center gap-1">
              <span>Ready</span>
              <span>| Document 1 of 1</span>
            </span>
            <span>{isDockerApp ? "Docker Desktop" : "Neon Database"}</span>
          </div>
        }
      >
        {/* Document toolbar */}
        <div
          className="flex items-center justify-between border-b border-gray-400 px-2 py-1"
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
              ◀ Previous
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
              Next ▶
            </button>
          </div>
        </div>

        {/* Document content */}
        <div className="flex-1 p-4 overflow-auto" style={{ backgroundColor: "white" }}>
          <div className="max-w-none text-black leading-relaxed">
            {displayContent.split("\n").map((line, index) => {
              // Main title (first line or lines with colons indicating main topics)
              if (line.includes(": ") && (line.includes("Docker Desktop") || line.includes("Neon Database"))) {
                return (
                  <h1 key={index} className="text-xl font-bold mb-6 text-center border-b-2 border-gray-300 pb-2">
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
                  <li key={index} className="text-sm mb-1 ml-4 list-disc">
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
                  <p key={index} className="text-sm mb-4 leading-relaxed">
                    {line}
                  </p>
                )
              }
            })}
          </div>
        </div>
      </WindowFrame>
    )
  }

  return (
    <WindowFrame
      id={id}
      title={`${title} - Document`}
      position={position}
      zIndex={zIndex}
      isAnimating={isAnimating}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      onMaximize={onMaximize}
      width={size?.width || 700}
      height={size?.height || 600}
      icon="/icons/notepad.png"
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      onMove={onMove}
      onMinimize={onMinimize}
      onResize={onResize}
      customFooterContent={
        <div className="flex justify-between w-full">
          <span className="flex items-center gap-1">
            <span>Ready</span>
            <span>| Document 1 of 1</span>
          </span>
          <span>{title}</span>
        </div>
      }
    >
      {/* Document toolbar */}
      <div
        className="flex items-center justify-between border-b border-gray-400 px-2 py-1"
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
            ◀ Previous
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
            Next ▶
          </button>
        </div>
      </div>

      {/* Document content */}
      <div className="flex-1 p-4 overflow-auto" style={{ backgroundColor: "white" }}>
        <div className="max-w-none text-black leading-relaxed">
          {displayContent.split("\n").map((line, index) => {
            // Main title (first line or lines with AIOps/Fiveonefour)
            if (line.includes("AIOps for Network Backbone Operations") || (line.includes(": ") && line.length > 50)) {
              return (
                <h1 key={index} className="text-xl font-bold mb-6 text-center border-b-2 border-gray-300 pb-2">
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
                <li key={index} className="text-sm mb-1 ml-4 list-disc">
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
                <p key={index} className="text-sm mb-4 leading-relaxed">
                  {line}
                </p>
              )
            }
          })}
        </div>
      </div>
    </WindowFrame>
  )
}
