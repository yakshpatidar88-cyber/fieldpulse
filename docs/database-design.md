# OpsFlow: Database Design & Entity Relationship Specification

## 1. Executive Summary

The OpsFlow database schema is designed for high-concurrency field operations, multi-criteria dispatch optimization, transactional inventory tracking, and immutable audit logging. It enforces relational integrity through foreign keys, check constraints, and indexed lookup paths.

---

## 2. Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned_to
    USERS ||--o| TECHNICIANS : profiles
    TECHNICIANS ||--o{ TECHNICIAN_SKILLS : possesses
    SKILLS ||--o{ TECHNICIAN_SKILLS : required_by
    SKILLS ||--o{ JOB_REQUIRED_SKILLS : required_for
    JOBS ||--o{ JOB_REQUIRED_SKILLS : demands

    SERVICE_REQUESTS ||--o| JOBS : converts_to
    TECHNICIANS ||--o{ JOBS : executes
    JOBS ||--|| SLAS : bounded_by
    JOBS ||--o{ ASSIGNMENTS : dispatched_via
    TECHNICIANS ||--o{ ASSIGNMENTS : offered_to

    JOBS ||--o{ JOB_PARTS : requires
    INVENTORY_ITEMS ||--o{ JOB_PARTS : reserved_from

    USERS ||--o{ AUDIT_EVENTS : triggers

    USERS {
        bigint id PK
        varchar email UK
        varchar password_hash
        varchar first_name
        varchar last_name
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    ROLES {
        bigint id PK
        varchar name UK
    }

    TECHNICIANS {
        bigint id PK
        bigint user_id FK
        varchar employee_code UK
        varchar phone
        numeric base_latitude
        numeric base_longitude
        numeric current_latitude
        numeric current_longitude
        varchar status
        int max_concurrent_jobs
        int active_jobs_count
        numeric rating
        timestamp created_at
        timestamp updated_at
    }

    SKILLS {
        bigint id PK
        varchar code UK
        varchar name
        varchar category
        varchar certification_level
    }

    SERVICE_REQUESTS {
        bigint id PK
        varchar customer_name
        varchar customer_email
        varchar customer_phone
        text address
        numeric latitude
        numeric longitude
        text description
        varchar priority
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    JOBS {
        bigint id PK
        varchar job_number UK
        bigint service_request_id FK
        bigint assigned_technician_id FK
        varchar priority
        varchar status
        text address
        numeric latitude
        numeric longitude
        int estimated_duration_minutes
        timestamp scheduled_start_time
        timestamp actual_start_time
        timestamp completed_at
        text completion_notes
        timestamp created_at
        timestamp updated_at
    }

    SLAS {
        bigint id PK
        bigint job_id FK,UK
        timestamp response_deadline
        timestamp resolution_deadline
        timestamp responded_at
        timestamp resolved_at
        varchar risk_level
        text breach_reason
        timestamp created_at
        timestamp updated_at
    }

    ASSIGNMENTS {
        bigint id PK
        bigint job_id FK
        bigint technician_id FK
        bigint assigned_by FK
        numeric dispatch_score
        text score_explanation
        varchar status
        timestamp offered_at
        timestamp responded_at
        text rejection_reason
    }

    INVENTORY_ITEMS {
        bigint id PK
        varchar sku UK
        varchar name
        text description
        varchar category
        numeric unit_price
        int quantity_available
        int quantity_reserved
        int minimum_threshold
        varchar warehouse_location
        bigint version
        timestamp created_at
        timestamp updated_at
    }

    JOB_PARTS {
        bigint id PK
        bigint job_id FK
        bigint inventory_item_id FK
        int quantity_required
        varchar status
        timestamp reserved_at
        timestamp consumed_at
    }

    AUDIT_EVENTS {
        bigint id PK
        varchar entity_name
        bigint entity_id
        varchar action
        bigint performed_by FK
        jsonb previous_state
        jsonb new_state
        jsonb metadata
        timestamp created_at
    }
```

---

## 3. Indexing & Query Optimization Strategy

| Index Name | Table | Columns | Purpose |
| :--- | :--- | :--- | :--- |
| `idx_jobs_status_priority` | `jobs` | `(status, priority)` | Fast polling by dispatch engine & dashboard filtering |
| `idx_jobs_coords` | `jobs` | `(latitude, longitude)` | Geospatial bounding box proximity searches |
| `idx_technicians_status_coords` | `technicians` | `(status, current_latitude, current_longitude)` | Instant candidate filtering for available technicians |
| `idx_slas_risk_deadline` | `slas` | `(risk_level, resolution_deadline)` | 60-second scheduled background SLA breach worker |
| `idx_inventory_sku` | `inventory_items` | `(sku)` | Unique part identification and quick lookups |
| `idx_audit_entity` | `audit_events` | `(entity_name, entity_id)` | Fast chronological retrieval of entity history |

---

## 4. Concurrency & Integrity Invariants

1. **Inventory Stock Guarding**:
   - `quantity_available >= 0` check constraint.
   - `quantity_reserved >= 0` check constraint.
   - Optimistic locking via `version` column on `inventory_items` to prevent lost updates under parallel dispatch.
2. **Technician Capacity**:
   - `active_jobs_count <= max_concurrent_jobs`.
   - Prevent overlapping schedule windows for the same technician.
3. **Immutability of Audit Trail**:
   - `audit_events` is an insert-only table; no updates or deletes permitted.
