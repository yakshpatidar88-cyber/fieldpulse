# OpsFlow: MVP Scope & Business Logic Specification

## 1. Product Scope & Functional Boundaries

The Minimum Viable Product (MVP) of OpsFlow concentrates on the high-value core of field operations: translating incoming service requests into SLA-compliant, constraint-validated technician dispatches with inventory locking and real-time observability.

### In-Scope for MVP (14-Day Roadmap)
1. **Customer Service Request Management**: Ingestion, triage, geocoding coordinates, priority classification (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), and skill requirement assignment.
2. **Technician Profile & Skill Registry**: Technician registry with geolocated base hubs, certified skill matrices, shift working hours, and live status (`AVAILABLE`, `ON_JOB`, `ON_BREAK`, `OFFLINE`).
3. **Multi-Factor Dispatch Recommendation Engine**:
   - Hard Filters: Mandatory skill matching, schedule non-overlap, shift availability.
   - Soft Scoring: Weighted ranking based on skill depth, travel distance, current shift workload, and SLA urgency score.
4. **Strict Job Lifecycle State Machine**:
   - Guaranteed atomic state transitions: `CREATED` -> `TRIAGED` -> `ASSIGNED` -> `ACCEPTED` -> `IN_PROGRESS` -> `COMPLETED` (or `CANCELLED`).
5. **Transactional Inventory Reservation**:
   - Stock tracking per SKU/warehouse.
   - Atomic reservation upon dispatching a job.
   - Rollback of reservation if a job is cancelled; permanent decrement upon job completion.
6. **SLA Calculation & Escalation Engine**:
   - Tiered SLA calculation based on job priority and contract level.
   - Background monitoring for jobs nearing 80% of their SLA deadline ("SLA Warning") and 100% ("SLA Breached").
   - Automated escalation notifications.
7. **Append-Only Audit Trail**: Immutable logging of every status transition, assignment recommendation, dispatcher override, and stock reservation.
8. **Operations Dispatch Board UI**: Interactive web interface for dispatchers featuring ranked technician cards, map markers, KPI metrics, and instant dispatch actions.

### Out-of-Scope for MVP (Post-MVP Enhancements)
- Multi-day multi-stop Travelling Salesperson Problem (TSP) continuous route optimization.
- Integration with external ERP/accounting billing systems (e.g., QuickBooks/SAP).
- Native iOS/Android mobile apps (mobile-responsive web app is provided for technicians).
- Customer payment processing gateways (Stripe/Square).

---

## 2. Job State Machine & Transition Invariants

```
   +------------------+
   |     CREATED      |
   +--------+---------+
            | (Dispatcher triages, assigns priority & required skills)
            v
   +------------------+
   |     TRIAGED      | <--------------------+
   +--------+---------+                      |
            | (Dispatched to technician &    | (Technician rejects / Dispatcher reassigns)
            |  parts reserved)               |
            v                                |
   +------------------+                      |
   |     ASSIGNED     +----------------------+
   +--------+---------+
            | (Technician accepts job)
            v
   +------------------+
   |     ACCEPTED     |
   +--------+---------+
            | (Technician starts travel / arrives on-site)
            v
   +------------------+
   |   IN_PROGRESS    |
   +--------+---------+
            | (Work finished, notes & parts verified)
            v
   +------------------+
   |    COMPLETED     |
   +------------------+

* Any state prior to COMPLETED can transition to CANCELLED (triggers inventory reservation release and audit event).
```

### Transition Validation Rules
1. A job **CANNOT** transition from `TRIAGED` to `ASSIGNED` without:
   - An assigned technician who holds 100% of required job skills.
   - Successful transactional reservation of all specified required parts.
2. A job **CANNOT** be assigned to a technician who has another overlapping active or scheduled job during the estimated duration window.
3. Once in `IN_PROGRESS`, the job cannot be cancelled without an explicit dispatcher override reason logged to the audit trail.
4. Transition to `COMPLETED` requires completion notes and mandatory proof confirmation.

---

## 3. Dispatch Ranking Scoring Formula

When evaluating an eligible technician $T$ for Job $J$:

$$\text{DispatchScore}(T, J) = W_{\text{skill}} \cdot S_{\text{skill}} + W_{\text{distance}} \cdot S_{\text{distance}} + W_{\text{workload}} \cdot S_{\text{workload}} + W_{\text{sla}} \cdot S_{\text{sla}}$$

Where default weights are calibrated for operational responsiveness:
- **Skill Proficiency Match ($W_{\text{skill}} = 0.35$)**: Full match with tenure/specialization bonus.
- **Proximity / Travel Distance ($W_{\text{distance}} = 0.25$)**: Calculated via Haversine geodesic formula between technician current/hub location and job site.
- **Workload Balance ($W_{\text{workload}} = 0.20$)**: Penalizes technicians with heavy job backlogs to prevent technician fatigue and delays.
- **SLA Urgency ($W_{\text{sla}} = 0.20$)**: Elevated weight for jobs nearing SLA threshold to prioritize critical incidents.

---

## 4. SLA Policies & Risk Tiers

| Priority | First Response Target | Full Resolution Target | Escalation Warning Threshold |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | 30 minutes | 2 hours | 70% elapsed (84 minutes) |
| **HIGH** | 1 hour | 4 hours | 75% elapsed (180 minutes) |
| **MEDIUM** | 2 hours | 8 hours | 80% elapsed (384 minutes) |
| **LOW** | 4 hours | 24 hours | 85% elapsed (20.4 hours) |

A scheduled background job checks all active jobs every 60 seconds, calculates percentage of SLA window remaining, updates `sla_risk_status` (`HEALTHY`, `WARNING`, `BREACHED`), and dispatches real-time WebSocket alerts.
