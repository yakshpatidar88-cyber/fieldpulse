# FieldPulse API Reference 📚

FieldPulse provides a secure, OpenAPI 3 compliant REST API and a real-time WebSocket STOMP messaging bus.

- **Base Context Path**: `/api/v1`
- **Swagger UI Interactive Explorer**: `http://localhost:8080/api/v1/docs/swagger-ui.html`
- **OpenAPI 3 JSON Specification**: `http://localhost:8080/api/v1/docs/api-docs`
- **WebSocket STOMP Handshake**: `http://localhost:8080/api/v1/ws`

---

## 1. Standard API Envelope

All HTTP responses are returned wrapped in a uniform JSON envelope:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-09-19T10:40:00.000Z"
}
```

Error responses follow the RFC 7807 problem detail format:

```json
{
  "success": false,
  "message": "Validation failed on fields",
  "errors": [
    { "field": "email", "message": "Email must be a well-formed address" }
  ],
  "timestamp": "2026-09-19T10:40:00.000Z"
}
```

---

## 2. Authentication & Authorization

All secure endpoints require an HTTP Bearer JWT token in the `Authorization` header:

```http
Authorization: Bearer <accessToken>
```

### `POST /auth/login`
Authenticate user session and obtain access & refresh tokens.

- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "dispatcher.sarah@fieldpulse.io",
    "password": "password123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
      "tokenType": "Bearer",
      "expiresIn": 86400000,
      "userId": 2,
      "email": "dispatcher.sarah@fieldpulse.io",
      "fullName": "Sarah Jenkins",
      "role": "ROLE_DISPATCHER"
    }
  }
  ```

### `POST /auth/refresh`
Exchange a valid refresh token for a fresh access token.

- **Access**: Public

---

## 3. Service Requests & Triage

### `POST /requests`
Submit customer field service ticket.

- **Access**: Public (Customer intake)
- **Request Body**:
  ```json
  {
    "customerName": "Apex Hospital Group",
    "customerEmail": "facilities@apexhospital.org",
    "customerPhone": "+1-214-555-0199",
    "address": "1000 Main St, Dallas, TX 75202",
    "latitude": 32.7767,
    "longitude": -96.7970,
    "description": "Main chill water cooling tower pump bearing failure.",
    "priority": "CRITICAL"
  }
  ```

---

## 4. Multi-Factor Dispatch Engine

### `GET /dispatch/recommendations?jobId={jobId}&maxDistanceKm={maxDistanceKm}`
Calculate ranked technician recommendations based on multi-factor scoring formula:
$$\text{Score} = (0.35 \times \text{Skill}) + (0.25 \times \text{Distance}) + (0.20 \times \text{Workload}) + (0.20 \times \text{SLA Urgency})$$

- **Access**: `ROLE_DISPATCHER`, `ROLE_ADMIN`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "jobId": 1,
      "jobNumber": "JOB-2026-0001",
      "priority": "CRITICAL",
      "status": "TRIAGED",
      "latitude": 32.7767,
      "longitude": -96.7970,
      "totalCandidatesEvaluated": 8,
      "eligibleCandidatesCount": 3,
      "recommendations": [
        {
          "technicianId": 1,
          "employeeCode": "TECH-001",
          "fullName": "Alex Rivera",
          "distanceKm": 4.2,
          "eligible": true,
          "matchedSkills": ["HVAC_COMMERCIAL", "ELECTRICAL_3PHASE"],
          "missingSkills": [],
          "totalScore": 91.8,
          "scoreBreakdown": {
            "skillScore": 100.0,
            "distanceScore": 95.8,
            "workloadScore": 80.0,
            "slaScore": 85.0
          }
        }
      ]
    }
  }
  ```

### `POST /dispatch/assign`
Confirm technician assignment and lock inventory stock atomically.

- **Access**: `ROLE_DISPATCHER`, `ROLE_ADMIN`
- **Request Body**:
  ```json
  {
    "jobId": 1,
    "technicianId": 1,
    "notes": "Fastest response route selected."
  }
  ```

---

## 5. Job Lifecycle & State Transitions

### `GET /jobs`
Filter jobs queue by status (`CREATED`, `TRIAGED`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`) and priority.

### `PATCH /jobs/{id}/status`
Execute validated state machine status transition with audit trail log.

- **Valid Transitions**:
  - `CREATED` → `TRIAGED`
  - `TRIAGED` → `ASSIGNED`
  - `ASSIGNED` → `ACCEPTED` | `CANCELLED`
  - `ACCEPTED` → `IN_PROGRESS`
  - `IN_PROGRESS` → `COMPLETED` | `CANCELLED`

---

## 6. Real-Time SLA & Escalations

### `GET /sla/dashboard`
Aggregated SLA compliance KPIs.

- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "totalActiveJobs": 24,
      "healthyCount": 21,
      "warningCount": 2,
      "breachedCount": 1,
      "complianceRatePercent": 95.83
    }
  }
  ```

### `POST /sla/monitor/run`
Trigger on-demand background SLA watchdog evaluation and broadcast real-time alerts.

---

## 7. Real-Time WebSocket STOMP Topics

Connect using any STOMP over WebSocket or SockJS client at `/ws`.

| Destination | Direction | Description |
| :--- | :---: | :--- |
| `/topic/alerts` | Server → Client | Real-time SLA breach & warning alerts (`NotificationDto`) |
| `/topic/jobs` | Server → Client | Real-time job status transition broadcasts |
| `/topic/technicians` | Server → Client | Live technician GPS telemetry and shift status updates |
