-- ==============================================================================
-- OpsFlow Database Migration V2: Seed Realistic Demo Data
-- ==============================================================================

-- 1. Seed Roles
INSERT INTO roles (id, name) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_DISPATCHER'),
(3, 'ROLE_TECHNICIAN'),
(4, 'ROLE_CUSTOMER');

-- 2. Seed Users (Default BCrypt hash for 'Password123!': $2a$10$7EqJtq98hPqEX7fNZaFWoO.8kEZFq1hLgVvV3h9fGqP7Jc8j1H1dG)
INSERT INTO users (id, email, password_hash, first_name, last_name, active) VALUES
(1, 'admin@opsflow.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8kEZFq1hLgVvV3h9fGqP7Jc8j1H1dG', 'Alex', 'Sterling', TRUE),
(2, 'dispatcher.sarah@opsflow.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8kEZFq1hLgVvV3h9fGqP7Jc8j1H1dG', 'Sarah', 'Jenkins', TRUE),
(3, 'tech.marcus@opsflow.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8kEZFq1hLgVvV3h9fGqP7Jc8j1H1dG', 'Marcus', 'Vance', TRUE),
(4, 'tech.elena@opsflow.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8kEZFq1hLgVvV3h9fGqP7Jc8j1H1dG', 'Elena', 'Rostova', TRUE),
(5, 'tech.david@opsflow.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8kEZFq1hLgVvV3h9fGqP7Jc8j1H1dG', 'David', 'Kim', TRUE),
(6, 'customer.metro@facility.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8kEZFq1hLgVvV3h9fGqP7Jc8j1H1dG', 'Robert', 'Miller', TRUE);

-- Map User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Admin
(2, 2), -- Dispatcher Sarah
(3, 3), -- Tech Marcus
(4, 3), -- Tech Elena
(5, 3), -- Tech David
(6, 4); -- Customer Robert

-- 3. Seed Skills
INSERT INTO skills (id, code, name, category, certification_level, description) VALUES
(1, 'HVAC_EPA_UNIVERSAL', 'EPA 608 Universal Certification', 'HVAC', 'EXPERT', 'Certified for servicing all refrigeration equipment without restriction.'),
(2, 'COMMERCIAL_CHILLER', 'Commercial Centrifugal Chiller Specialist', 'HVAC', 'SENIOR', 'Diagnosis and overhaul of large-scale commercial chillers and cooling towers.'),
(3, 'HIGH_VOLTAGE_ELEC', 'Industrial High Voltage 480V/3-Phase', 'ELECTRICAL', 'EXPERT', 'Installation and maintenance of 480V three-phase motors and switchgear.'),
(4, 'RESIDENTIAL_HEAT_PUMP', 'Residential Heat Pump & Inverter Systems', 'HVAC', 'STANDARD', 'Troubleshooting modern variable-speed residential heat pumps and compressors.'),
(5, 'SMART_EMS_CONTROLS', 'Building Energy Management & DDC Controls', 'CONTROLS', 'SENIOR', 'Programming and wiring BACnet/Modbus environmental control boards.'),
(6, 'GAS_FURNACE_REPAIR', 'Commercial & Residential Gas Furnace Specialist', 'HVAC', 'STANDARD', 'Gas valve calibration, ignition control, and heat exchanger crack detection.');

-- 4. Seed Technicians (Centred around Chicago Metro area coordinates: ~41.8781, -87.6298)
INSERT INTO technicians (id, user_id, employee_code, phone, base_latitude, base_longitude, current_latitude, current_longitude, status, max_concurrent_jobs, active_jobs_count, rating) VALUES
(1, 3, 'TECH-001', '+1-312-555-0141', 41.881832, -87.623177, 41.884500, -87.632000, 'AVAILABLE', 2, 0, 4.95),
(2, 4, 'TECH-002', '+1-312-555-0192', 41.850033, -87.650055, 41.855000, -87.658000, 'ON_JOB', 1, 1, 4.88),
(3, 5, 'TECH-003', '+1-312-555-0188', 41.920000, -87.680000, 41.915000, -87.675000, 'AVAILABLE', 2, 0, 4.75);

-- Map Technician Skills
INSERT INTO technician_skills (technician_id, skill_id) VALUES
(1, 1), (1, 2), (1, 3), -- Marcus: EPA Universal, Commercial Chiller, High Voltage
(2, 1), (2, 4), (2, 5), -- Elena: EPA Universal, Heat Pump, Smart Controls
(3, 3), (3, 4), (3, 6); -- David: High Voltage, Heat Pump, Gas Furnace

-- 5. Seed Inventory Items
INSERT INTO inventory_items (id, sku, name, description, category, unit_price, quantity_available, quantity_reserved, minimum_threshold, warehouse_location, version) VALUES
(1, 'CAP-45-5-RD', 'Dual Run Capacitor 45/5 uF 440V Round', 'Motor run capacitor for compressor and fan motor.', 'ELECTRICAL', 24.50, 45, 2, 10, 'BIN-A12-04', 0),
(2, 'CON-2P-30A', 'Definite Purpose Contactor 2-Pole 30A 24V', 'Heavy duty contactor for condensing units.', 'ELECTRICAL', 32.00, 30, 1, 8, 'BIN-A12-09', 0),
(3, 'TXV-R410A-3T', 'Thermostatic Expansion Valve R-410A 3-Ton', 'Precision refrigerant flow metering valve.', 'HVAC_PARTS', 88.75, 12, 1, 5, 'BIN-B04-02', 0),
(4, 'REF-R410A-25LB', 'R-410A Refrigerant Virgin Cylinder 25 lb', 'Eco-friendly HFC refrigerant cylinder.', 'REFRIGERANT', 215.00, 18, 0, 4, 'BAY-GAS-01', 0),
(5, 'MOT-ECM-1-3HP', 'Variable Speed ECM Blower Motor 1/3 HP', 'High efficiency brushless DC blower motor.', 'MOTORS', 245.00, 8, 0, 3, 'BIN-C08-11', 0),
(6, 'CTL-BACNET-VAV', 'BACnet MS/TP VAV Zone Controller Board', 'Programmable direct digital controller for terminal units.', 'CONTROLS', 310.00, 6, 1, 2, 'BIN-E01-03', 0);

-- 6. Seed Service Requests
INSERT INTO service_requests (id, customer_name, customer_email, customer_phone, address, latitude, longitude, description, priority, status) VALUES
(1, 'Apex Medical Center', 'facilities@apexmed.org', '+1-312-555-9011', '710 S Paulina St, Chicago, IL 60612', 41.872500, -87.669500, 'Main ICU ventilation chiller pressure drop alert. Ambient temperature rising.', 'CRITICAL', 'CONVERTED_TO_JOB'),
(2, 'Loop Financial Tower', 'building@looptower.com', '+1-312-555-8822', '111 W Monroe St, Chicago, IL 60603', 41.880800, -87.631800, 'Floor 18 server room auxiliary AC intermittent tripping on high voltage relay.', 'HIGH', 'CONVERTED_TO_JOB'),
(3, 'River North Bistro', 'chef@rivernorthbistro.com', '+1-312-555-7733', '350 N Clark St, Chicago, IL 60654', 41.889200, -87.631200, 'Walk-in freezer temperature at 28F instead of 0F. Possible TXV valve blockage.', 'HIGH', 'CONVERTED_TO_JOB'),
(4, 'Lincoln Park Condos', 'manager@lpcondos.com', '+1-312-555-6644', '2100 N Lincoln Park W, Chicago, IL 60614', 41.921100, -87.636800, 'Annual seasonal heat pump checkup and filter change.', 'LOW', 'RECEIVED');

-- 7. Seed Jobs
INSERT INTO jobs (id, job_number, service_request_id, assigned_technician_id, priority, status, address, latitude, longitude, estimated_duration_minutes, scheduled_start_time, actual_start_time, completed_at, completion_notes) VALUES
(1, 'JOB-2026-0001', 1, 1, 'CRITICAL', 'ASSIGNED', '710 S Paulina St, Chicago, IL 60612', 41.872500, -87.669500, 120, CURRENT_TIMESTAMP + INTERVAL '10 minutes', NULL, NULL, NULL),
(2, 'JOB-2026-0002', 2, 2, 'HIGH', 'IN_PROGRESS', '111 W Monroe St, Chicago, IL 60603', 41.880800, -87.631800, 90, CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP - INTERVAL '25 minutes', NULL, NULL),
(3, 'JOB-2026-0003', 3, NULL, 'HIGH', 'TRIAGED', '350 N Clark St, Chicago, IL 60654', 41.889200, -87.631200, 60, NULL, NULL, NULL, NULL);

-- Map Job Required Skills
INSERT INTO job_required_skills (job_id, skill_id) VALUES
(1, 1), (1, 2), -- Job 1 requires EPA Universal & Commercial Chiller
(2, 3), (2, 5), -- Job 2 requires High Voltage & Smart Controls
(3, 1), (3, 4); -- Job 3 requires EPA Universal & Heat Pump

-- 8. Seed SLAs
INSERT INTO slas (id, job_id, response_deadline, resolution_deadline, responded_at, resolved_at, risk_level, breach_reason) VALUES
(1, 1, CURRENT_TIMESTAMP + INTERVAL '20 minutes', CURRENT_TIMESTAMP + INTERVAL '110 minutes', CURRENT_TIMESTAMP - INTERVAL '5 minutes', NULL, 'HEALTHY', NULL),
(2, 2, CURRENT_TIMESTAMP - INTERVAL '20 minutes', CURRENT_TIMESTAMP + INTERVAL '35 minutes', CURRENT_TIMESTAMP - INTERVAL '25 minutes', NULL, 'WARNING', NULL),
(3, 3, CURRENT_TIMESTAMP + INTERVAL '45 minutes', CURRENT_TIMESTAMP + INTERVAL '210 minutes', NULL, NULL, 'HEALTHY', NULL);

-- 9. Seed Job Parts Reservations
INSERT INTO job_parts (id, job_id, inventory_item_id, quantity_required, status, reserved_at) VALUES
(1, 1, 2, 1, 'RESERVED', CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(2, 1, 1, 2, 'RESERVED', CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(3, 2, 6, 1, 'RESERVED', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(4, 3, 3, 1, 'REQUESTED', NULL);

-- 10. Seed Assignments
INSERT INTO assignments (id, job_id, technician_id, assigned_by, dispatch_score, score_explanation, status, offered_at, responded_at) VALUES
(1, 1, 1, 2, 94.50, 'Matched 2/2 skills (EPA Universal, Chiller). Proximity: 2.1 km. Workload: 0 active jobs. Urgent critical SLA bonus.', 'OFFERED', CURRENT_TIMESTAMP - INTERVAL '10 minutes', NULL),
(2, 2, 2, 2, 91.20, 'Matched 2/2 skills (High Voltage, Controls). Proximity: 1.4 km. Active jobs: 0 at assignment.', 'ACCEPTED', CURRENT_TIMESTAMP - INTERVAL '35 minutes', CURRENT_TIMESTAMP - INTERVAL '30 minutes');

-- 11. Seed Audit Events
INSERT INTO audit_events (id, entity_name, entity_id, action, performed_by, previous_state, new_state, metadata, created_at) VALUES
(1, 'Job', 1, 'JOB_CREATED', 2, NULL, '{"status": "CREATED", "priority": "CRITICAL"}'::jsonb, '{"source": "ServiceRequest #1"}'::jsonb, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
(2, 'Job', 1, 'JOB_TRIAGED', 2, '{"status": "CREATED"}'::jsonb, '{"status": "TRIAGED", "requiredSkills": [1, 2]}'::jsonb, '{"triageDurationSec": 45}'::jsonb, CURRENT_TIMESTAMP - INTERVAL '18 minutes'),
(3, 'Job', 1, 'JOB_ASSIGNED', 2, '{"status": "TRIAGED"}'::jsonb, '{"status": "ASSIGNED", "technicianId": 1}'::jsonb, '{"dispatchScore": 94.50}'::jsonb, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(4, 'Job', 2, 'JOB_STARTED', 4, '{"status": "ACCEPTED"}'::jsonb, '{"status": "IN_PROGRESS"}'::jsonb, '{"lat": 41.8808, "lng": -87.6318}'::jsonb, CURRENT_TIMESTAMP - INTERVAL '25 minutes');

-- Reset Auto-Increment Sequences
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('skills_id_seq', (SELECT MAX(id) FROM skills));
SELECT setval('technicians_id_seq', (SELECT MAX(id) FROM technicians));
SELECT setval('service_requests_id_seq', (SELECT MAX(id) FROM service_requests));
SELECT setval('jobs_id_seq', (SELECT MAX(id) FROM jobs));
SELECT setval('slas_id_seq', (SELECT MAX(id) FROM slas));
SELECT setval('assignments_id_seq', (SELECT MAX(id) FROM assignments));
SELECT setval('inventory_items_id_seq', (SELECT MAX(id) FROM inventory_items));
SELECT setval('job_parts_id_seq', (SELECT MAX(id) FROM job_parts));
SELECT setval('audit_events_id_seq', (SELECT MAX(id) FROM audit_events));
