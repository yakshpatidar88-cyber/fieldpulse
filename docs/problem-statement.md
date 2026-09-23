# FieldPulse: Problem Statement & Target User Personas

## 1. Executive Summary

Modern field-service enterprises—including HVAC, commercial electrical, appliance repair, plumbing, and industrial equipment maintenance—process hundreds of high-urgency customer service tickets daily. While basic ticketing systems (e.g., standard CRUD helpdesks) can record customer requests, they fail to resolve the core operational challenge:

> **Who is the optimal technician to dispatch right now, taking into account their certified skills, geographical proximity, current shift workload, parts availability, and the customer's strict SLA deadline?**

Misallocating field technicians results in delayed response times, missed Service Level Agreements (SLAs), costly secondary truck rolls (due to missing parts or unqualified personnel), technician burnout, and customer churn. **FieldPulse** is an intelligent, SLA-aware operations and dispatch platform engineered to transform reactive field coordination into an automated, constraint-driven dispatch engine.

---

## 2. Core Problem Breakdown

### 2.1 The "Blind Dispatch" Bottleneck
In traditional field operations, human dispatchers rely on fragmented phone calls, spreadsheets, or generic ticketing dashboards. They routinely assign work based solely on geographical distance or simple round-robin scheduling. This produces three critical failures:
1. **Skill Mismatch**: A technician arrives on-site only to discover they lack the mandatory certification (e.g., EPA 608 for refrigerant handling or commercial high-voltage licensing).
2. **Missing Parts Failure**: The job is dispatched, but the required replacement compressor or control board is out of stock in the technician's van or the central warehouse, forcing a reschedule.
3. **SLA Violations**: High-priority jobs (e.g., a hospital refrigeration failure) get assigned behind non-urgent routine maintenance because dispatchers cannot dynamically evaluate real-time SLA risk windows.

### 2.2 Concurrency & State Inconsistencies
When multiple dispatchers coordinate dozens of technicians simultaneously:
- Multiple dispatchers may assign overlapping jobs to the same technician.
- Inventory parts can be double-reserved by simultaneous jobs, leading to phantom inventory.
- Job status updates from mobile technicians lack strict state-machine enforcement, leading to lost audit trails and untraceable customer disputes.

### 2.3 Operational Metrics Impacted
| Operational Metric | Industry Baseline | Target with FieldPulse |
| :--- | :--- | :--- |
| **First-Time Fix Rate (FTFR)** | 65% – 72% | > 88% |
| **SLA Breach Rate** | 14% – 18% | < 3% |
| **Mean Time to Dispatch (MTTD)** | 45 – 90 minutes | < 5 minutes (Auto-ranked) |
| **Secondary Truck Rolls** | 22% of total dispatches | < 6% |
| **Technician Idle Time** | 28% of working hours | < 12% |

---

## 3. Target User Personas

### Persona 1: Sarah Jenkins – Operations Dispatcher
- **Role**: Field Dispatcher & Customer Coordinator
- **Responsibilities**: Reviews incoming work requests, triages priority, monitors technician routes, resolves exceptions, and assigns field jobs.
- **Pain Points**:
  - Overwhelmed by simultaneous phone calls and tickets.
  - Has to mentally cross-reference technician skills, calendars, traffic, and inventory stock.
  - Anxious about missing enterprise contract SLAs that carry financial penalties.
- **Goals with FieldPulse**: A unified real-time dispatch board with multi-criteria ranked recommendations and one-click dispatch approval.

### Persona 2: Marcus Vance – Senior Field Technician
- **Role**: Certified HVAC & Electrical Field Specialist
- **Responsibilities**: Drives to customer locations, diagnoses faults, replaces components, logs work evidence, and obtains customer sign-offs.
- **Pain Points**:
  - Sent to jobs without the required parts or tools.
  - Overloaded with unrealistic back-to-back schedules with overlapping travel windows.
  - Unclear customer history or safety requirements.
- **Goals with FieldPulse**: A clean mobile-first view showing job details, attached part reservations, navigation, clear SLA countdowns, and quick status transitions.

### Persona 3: David Sterling – Service Operations Director
- **Role**: Executive / General Manager
- **Responsibilities**: Oversees field service profitability, workforce utilization, customer satisfaction (CSAT), and SLA compliance across regional territories.
- **Pain Points**:
  - Lack of real-time visibility into active fleet operations.
  - Discovering SLA breaches only after customers escalate or penalize invoices.
  - Inability to trace why bad dispatch decisions were made due to lack of audit history.
- **Goals with FieldPulse**: High-level KPI dashboard tracking active jobs, SLA risk distribution, technician utilization, and comprehensive audit trails.

### Persona 4: Elena Rostova – Commercial Facility Customer
- **Role**: Facility Manager (Customer)
- **Responsibilities**: Manages commercial buildings and requires rapid equipment repair to maintain business continuity.
- **Pain Points**:
  - Vague arrival windows ("technician will arrive between 8 AM and 5 PM").
  - Technicians who show up unprepared.
  - Breached maintenance contracts.
- **Goals with FieldPulse**: Instant request acknowledgment, predictable SLA deadlines, real-time status updates, and digital proof-of-work completion.
