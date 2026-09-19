# OpsFlow System Architecture & Technical Interview Preparation Guide 🎯

This document is designed for technical interview walkthroughs, architectural defenses, and deep-dive evaluations of the OpsFlow platform.

---

## 1. High-Level System Architecture

OpsFlow follows a distributed event-driven and RESTful layered pattern engineered for high reliability, strict SLA constraints, and concurrent consistency.

```
                     +---------------------------------------+
                     |         Web Browser Client            |
                     |   (React 18 + TS + Tailwind + Leaflet)|
                     +-------------------+-------------------+
                                         |
                       REST API (JSON)   |   WebSocket (STOMP / SockJS)
                       Bearer JWT        |   /topic/alerts, /topic/jobs
                                         v
                     +---------------------------------------+
                     |       Spring Boot 3 REST API          |
                     |   (Java 21, Spring Security, MVC)     |
                     +-------------------+-------------------+
                                         |
                 +-----------------------+-----------------------+
                 |                       |                       |
                 v                       v                       v
      +--------------------+  +--------------------+  +--------------------+
      |  PostgreSQL 16 DB  |  |   Redis 7 Cache    |  | SLA Risk Watchdog  |
      | Flyway Migrations  |  | Distributed Locks  |  | Polling Scheduler  |
      | Pessimistic Locks  |  | STOMP Message Bus  |  | 60-Sec Audit Loop  |
      +--------------------+  +--------------------+  +--------------------+
```

---

## 2. Core Architectural Decisions & Trade-Offs

### 1. Concurrency Control: Why Pessimistic Locking over Optimistic Locking for Parts?
- **Problem**: When multiple dispatchers or automated batch dispatchers assign emergency jobs simultaneously, parts with limited stock (e.g. 1 heavy-duty HVAC compressor left) risk being oversold.
- **Solution**: OpsFlow applies JPA `PessimisticLockScope.WRITE` (`SELECT ... FOR UPDATE`) on the `InventoryItem` record during reservation.
- **Trade-Off**: Pessimistic locking briefly blocks concurrent transactions on the exact part row. However, since warehouse stock transactions are sub-millisecond, this eliminates phantom stock allocations and eliminates the expensive retry-storms associated with optimistic lock exceptions.

### 2. Multi-Factor Candidate Scoring Engine
- **Formula**:
  $$\text{Score} = (0.35 \times \text{Skill}) + (0.25 \times \text{Distance}) + (0.20 \times \text{Workload}) + (0.20 \times \text{SLA Urgency})$$
- **Hard Constraint Pruning**: Technicians missing **any** mandatory skill certification or exceeding `max_concurrent_jobs` are disqualified immediately before scoring calculations.
- **Haversine Distance**: Computes great-circle geographical distance between the job coordinates $(lat_1, lon_1)$ and technician coordinates $(lat_2, lon_2)$ using earth radius $R = 6371\text{ km}$:
  $$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)$$
  $$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$
  $$d = R \cdot c$$

### 3. SLA Breach Watchdog Engine
- **Decoupled Background Polling**: A Spring `@Scheduled` background worker executes every 60 seconds to scan active, uncompleted SLAs.
- **Tiered Escalation Thresholds**:
  - `CRITICAL`: Warning at 70% of resolution window elapsed.
  - `HIGH`: Warning at 75% elapsed.
  - `MEDIUM`: Warning at 80% elapsed.
  - `LOW`: Warning at 85% elapsed.
  - Past deadline: Transitions immediately to `BREACHED`.
- **Idempotency**: Audits and WebSocket notifications are only broadcast on state transitions (`HEALTHY` → `WARNING` or `WARNING` → `BREACHED`), preventing alert fatigue.

### 4. Hybrid Real-Time Transport: WebSocket STOMP + SockJS Fallback
- **Why STOMP**: Standardizes publish-subscribe routing via simple `/topic` channels without requiring complex bespoke frame encoders.
- **SockJS Fallback**: Ensures uninterrupted streaming telemetry even behind strict corporate proxies or firewalls that disallow raw WebSocket TCP upgrade handshakes.

---

## 3. Resume Pitch & Impact Bullets

Here are production-ready resume bullets tailored for senior backend / full-stack engineering roles:

- **Architected OpsFlow**, an intelligent SLA-aware field service dispatch platform using **Spring Boot 3, Java 21, React 18, PostgreSQL 16, and Redis 7**.
- **Engineered multi-criteria technician dispatch algorithm** evaluating mandatory skill certificates, Haversine spherical proximity, shift workload, and contract SLA deadlines to optimize first-time fix rates.
- **Implemented pessimistic write locking (`SELECT FOR UPDATE`)** for inventory stock reservations, preventing race conditions and duplicate parts allocations under parallel dispatch requests.
- **Built asynchronous background SLA escalation watchdog** polling active jobs on 60-second intervals with tiered risk escalations and real-time STOMP alerts over WebSocket.
- **Developed modular React 18 + TypeScript SPA** featuring interactive Leaflet mapping, dynamic scoring breakdowns, JWT RBAC security, and dark-theme Tailwind UI.
- **Dockerized full-stack architecture** with multi-stage Alpine images, Nginx reverse proxy, and Testcontainers automated integration tests.
