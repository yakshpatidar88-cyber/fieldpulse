# OpsFlow ⚡

### Intelligent SLA-Aware Field Service Dispatch & Operations Platform

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg?style=flat&logo=openjdk)](https://openjdk.org/)
[![Spring Boot 3.3](https://img.shields.io/badge/Spring%20Boot-3.3.3-brightgreen.svg?style=flat&logo=springboot)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/React-18.3-blue.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-red.svg?style=flat&logo=redis)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg?style=flat&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

OpsFlow transforms reactive customer service requests into an automated, constraint-driven field dispatch engine. Built for HVAC, commercial electrical, appliance repair, and industrial equipment maintenance companies, OpsFlow evaluates certified technician skills, live geolocation proximity, shift workload, part reservations, and SLA breach deadlines to recommend the optimal technician assignment in real time.

---

## 1. What Problem Does OpsFlow Solve?

In field service operations, the challenge is rarely storing a service ticket; it is deciding **who should handle the job, when they can reach the site, whether they hold mandatory certifications, whether required replacement parts are in stock, and whether contract SLAs will be breached**.

### The 10-Step Operational Flow
1. **Request Intake**: Customer or dispatcher logs a service request with location, equipment details, and symptoms.
2. **Triage & Classification**: System classifies priority (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) and determines required skills.
3. **SLA Window Computation**: System calculates exact first-response and full-resolution SLA deadlines.
4. **Hard Constraint Filtering**: Disqualifies technicians without matching certifications or with schedule conflicts.
5. **Multi-Factor Dispatch Scoring**: Ranks eligible technicians using weighted scoring (skills, distance, workload, SLA urgency).
6. **Dispatcher Confirmation**: Dispatcher reviews score explanations and confirms assignment.
7. **Transactional Inventory Locking**: Required replacement parts are locked and reserved atomically.
8. **Technician Execution**: Technician accepts assignment, updates live state (`ACCEPTED` → `IN_PROGRESS`), and navigates to site.
9. **Resolution & Proof**: Technician completes work, attaches proof-of-work notes, and resolves the job.
10. **SLA Verification & Audit**: SLA compliance is recorded and an append-only audit event is committed.

---

## 2. Core Business Logic & Constraints

- **Mandatory Skill Match**: A technician without 100% of required certifications cannot be assigned.
- **Overlap Prevention**: Two overlapping jobs cannot be assigned to the same technician during an estimated duration window.
- **Dispatch Scoring Formula**:
  $$\text{Score} = (0.35 \times \text{Skill}) + (0.25 \times \text{Distance}) + (0.20 \times \text{Workload}) + (0.20 \times \text{SLA Urgency})$$
- **Pessimistic Inventory Locking**: A job cannot move to `ASSIGNED` if parts are unavailable; reservations are transactional with rollback guarantees on cancellation.
- **SLA Risk Escalation**: Background workers poll active jobs every 60 seconds; jobs exceeding 70%–85% of their SLA window trigger real-time warning alerts via WebSocket.

---

## 3. System Architecture

```
                                +---------------------------+
                                |  React 18 + Vite Frontend |
                                |  (Tailwind + Leaflet Map) |
                                +-------------+-------------+
                                              |
                          REST (JSON) / JWT   |  WebSocket (STOMP)
                                              v
                                +---------------------------+
                                | Spring Boot 3 Backend API |
                                | (Java 21, Spring Security)|
                                +------+--------------+-----+
                                       |              |
                      Hibernate / JPA  |              | Redis Lettuce Client
                                       v              v
                        +--------------+---+   +------+---------------+
                        |  PostgreSQL 16   |   |   Redis 7 Cache      |
                        | (Flyway Schema)  |   | (Locks & STOMP Bus)  |
                        +------------------+   +----------------------+
```

---

## 4. Repository Structure

```
opsflow/
├── .github/
│   └── ISSUE_TEMPLATE/        # Standardized bug report & feature request templates
├── docs/
│   ├── problem-statement.md   # Exhaustive operational problem & persona analysis
│   ├── mvp-scope.md           # Functional boundaries, state machines & formulas
│   └── architecture.md        # System design, data flow diagrams & security specs
├── backend/                   # Spring Boot 3 + Java 21 REST API
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/opsflow/
│       │   │   └── OpsFlowApplication.java
│       │   └── resources/
│       │       └── application.yml
│       └── test/
├── frontend/                  # React 18 + TypeScript + Vite + Tailwind UI
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
├── docker-compose.yml         # Local infrastructure (Postgres 16 + Redis 7)
├── CONTRIBUTING.md            # Git flow, conventional commits, and coding standards
├── .gitignore                 # Root ignore rules
└── README.md
```

---

## 5. 14-Day Build Roadmap

| Day | Milestone | Status |
| :--- | :--- | :---: |
| **Day 1** | **Product & Repository Foundation, Monorepo Scaffolding & Architecture** | ✅ **Done** |
| **Day 2** | **Domain Modeling, PostgreSQL Schema, Flyway Migrations & Demo Seeding** | ✅ **Done** |
| **Day 3** | **Spring Boot Layered Foundation, Exception Handling & OpenAPI/Swagger** | ✅ **Done** |
| **Day 4** | **Spring Security 6, JWT Authentication & Role-Based Access Control (RBAC)** | ✅ **Done** |
| **Day 5** | Core Service Request Workflow, SLA Calculation & Audit Trail Engine | ⏳ Planned |
| **Day 6** | Multi-Factor Dispatch Engine & Candidate Scoring Algorithm | ⏳ Planned |
| **Day 7** | Transactional Inventory Reservation & Stock Guarding Rules | ⏳ Planned |
| **Day 8** | Background SLA Escalation Engine, Polling Scheduler & Notifications | ⏳ Planned |
| **Day 9** | React 18 + TypeScript + Tailwind Frontend Foundation & Auth Routing | ⏳ Planned |
| **Day 10** | Operations Dispatch Board, Leaflet Maps & Candidate Recommendation Cards | ⏳ Planned |
| **Day 11** | Real-Time WebSocket/STOMP Updates & Operations KPI Dashboard | ⏳ Planned |
| **Day 12** | Testcontainers Integration Tests, React Testing Library & Dockerization | ⏳ Planned |
| **Day 13** | Cloud Deployment (Render/Railway + Vercel) & Production Polish | ⏳ Planned |
| **Day 14** | Documentation Finalization, Demo Video/GIF & Resume Interview Readiness | ⏳ Planned |

---

## 6. Local Quickstart

### Prerequisites
- [Java 21 OpenJDK / Temurin](https://adoptium.net/)
- [Node.js 20+](https://nodejs.org/)
- [Docker & Docker Compose](https://www.docker.com/)

### 1. Boot Local Infrastructure
```bash
docker compose up -d
```
This spins up:
- **PostgreSQL 16** on `localhost:5432` (`opsflow` / `opsflow_dev_password`)
- **Redis 7** on `localhost:6379`

### 2. Run Backend
```bash
cd backend
./mvnw spring-boot:run
# Swagger UI available at: http://localhost:8080/api/v1/docs/swagger-ui.html
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
# Web application available at: http://localhost:5173
```

---

## 7. Engineering Decisions for Technical Interviews

- **Concurrency Control**: Pessimistic write locking on inventory entities prevents overselling or phantom reservations across parallel dispatch sessions.
- **Virtual Threads**: Java 21 virtual threads handle high-concurrency I/O operations without thread pool exhaustion.
- **SLA Escalation Engine**: Decoupled background polling with Redis idempotency keys ensures notification deduplication even under horizontal scale.
- **Decoupled Architecture**: Strict REST API and WebSocket interfaces allow multi-client support (web dispatch board, technician mobile views).

---

## 8. License

This project is licensed under the [MIT License](LICENSE).
