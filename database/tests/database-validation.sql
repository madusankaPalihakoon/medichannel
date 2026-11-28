-- Run these read-only checks after schema.sql and seed/seed.sql.
SET TIME ZONE 'Asia/Colombo';

-- 1. Required tables and approximate row counts.
SELECT table_name FROM information_schema.tables
WHERE table_schema='public' AND table_type='BASE TABLE'
ORDER BY table_name;

-- 2. All four roles must be represented by the fictional seed set.
SELECT role, COUNT(*) AS users FROM users GROUP BY role ORDER BY role;

-- 3. All appointment statuses required by BR-08 and BR-03 demo coverage.
SELECT appointment_status, COUNT(*) AS total
FROM appointments GROUP BY appointment_status ORDER BY appointment_status;

-- 4. Physical sessions must have a room; online sessions must not.
SELECT id, session_type, room_id FROM sessions
WHERE (session_type='PHYSICAL' AND room_id IS NULL)
   OR (session_type='ONLINE' AND room_id IS NOT NULL);
-- Expected: zero rows.

-- 5. Detect duplicate appointment numbers (expected zero rows; unique constraint also enforces this).
SELECT session_id, appointment_number, COUNT(*)
FROM appointments GROUP BY session_id, appointment_number HAVING COUNT(*) > 1;

-- 6. Detect multiple active appointments for one patient in one session (expected zero rows).
SELECT session_id, patient_id, COUNT(*)
FROM appointments WHERE appointment_status IN ('BOOKED','ARRIVED','IN_CONSULTATION')
GROUP BY session_id, patient_id HAVING COUNT(*) > 1;

-- 7. Check session capacity counters.
SELECT s.id, s.max_patients, s.next_appointment_number,
       COUNT(a.id) AS appointments_created
FROM sessions s LEFT JOIN appointments a ON a.session_id=s.id
GROUP BY s.id HAVING s.next_appointment_number > s.max_patients + 1
                  OR COUNT(a.id) > s.max_patients;
-- Expected: zero rows.

-- 8. Verify indexes and exclusion constraints exist.
SELECT indexname, indexdef FROM pg_indexes
WHERE schemaname='public' ORDER BY tablename,indexname;

-- 9. Verify encryption columns store opaque values (seed placeholders are clearly marked demo values).
SELECT id, full_name_ciphertext, email_ciphertext FROM users ORDER BY id;
SELECT id, nic_ciphertext, date_of_birth_ciphertext, phone_ciphertext FROM patients ORDER BY id;

-- 10. Audit log rows must exist; update/delete is blocked by database trigger.
SELECT id, actor_user_id, action, entity_type, entity_id, ip_address, created_at
FROM audit_logs ORDER BY created_at DESC;
