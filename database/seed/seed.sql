-- =============================================================
-- Fictional demo seed data for MediChannel.
-- Run only after schema.sql. All *_ciphertext values below are
-- clearly marked demo placeholders and are NOT decryptable.
-- Replace them through the application's CryptoService before
-- using these rows for an authenticated demo.
-- Demo password for seeded rows: DemoOnly!2026 (BCrypt below).
-- =============================================================

BEGIN;
SET TIME ZONE 'Asia/Colombo';

INSERT INTO users (id, full_name_ciphertext, email_ciphertext, email_lookup_hash,
                   password_hash, role, active, password_change_required)
VALUES
    (1, 'DEMO_CIPHERTEXT_ADMIN_NAME', 'DEMO_CIPHERTEXT_ADMIN_EMAIL', repeat('1',64), '$2a$10$uNiIbW9XEAOY915nGW8Dt.VIua97xHfq/PIDc3cz0U739TIkojsu.', 'ADMIN', TRUE, TRUE),
    (2, 'DEMO_CIPHERTEXT_MANAGER_NAME', 'DEMO_CIPHERTEXT_MANAGER_EMAIL', repeat('2',64), '$2a$10$uNiIbW9XEAOY915nGW8Dt.VIua97xHfq/PIDc3cz0U739TIkojsu.', 'MANAGER', TRUE, TRUE),
    (3, 'DEMO_CIPHERTEXT_DOCTOR_ONE_NAME', 'DEMO_CIPHERTEXT_DOCTOR_ONE_EMAIL', repeat('3',64), '$2a$10$uNiIbW9XEAOY915nGW8Dt.VIua97xHfq/PIDc3cz0U739TIkojsu.', 'DOCTOR', TRUE, TRUE),
    (4, 'DEMO_CIPHERTEXT_DOCTOR_TWO_NAME', 'DEMO_CIPHERTEXT_DOCTOR_TWO_EMAIL', repeat('4',64), '$2a$10$uNiIbW9XEAOY915nGW8Dt.VIua97xHfq/PIDc3cz0U739TIkojsu.', 'DOCTOR', TRUE, TRUE),
    (5, 'DEMO_CIPHERTEXT_PATIENT_ONE_NAME', 'DEMO_CIPHERTEXT_PATIENT_ONE_EMAIL', repeat('5',64), '$2a$10$uNiIbW9XEAOY915nGW8Dt.VIua97xHfq/PIDc3cz0U739TIkojsu.', 'CUSTOMER', TRUE, FALSE),
    (6, 'DEMO_CIPHERTEXT_PATIENT_TWO_NAME', 'DEMO_CIPHERTEXT_PATIENT_TWO_EMAIL', repeat('6',64), '$2a$10$uNiIbW9XEAOY915nGW8Dt.VIua97xHfq/PIDc3cz0U739TIkojsu.', 'CUSTOMER', TRUE, FALSE),
    (7, 'DEMO_CIPHERTEXT_PATIENT_THREE_NAME', 'DEMO_CIPHERTEXT_PATIENT_THREE_EMAIL', repeat('7',64), '$2a$10$uNiIbW9XEAOY915nGW8Dt.VIua97xHfq/PIDc3cz0U739TIkojsu.', 'CUSTOMER', TRUE, FALSE),
    (8, 'DEMO_CIPHERTEXT_PATIENT_FOUR_NAME', 'DEMO_CIPHERTEXT_PATIENT_FOUR_EMAIL', repeat('8',64), '$2a$10$uNiIbW9XEAOY915nGW8Dt.VIua97xHfq/PIDc3cz0U739TIkojsu.', 'CUSTOMER', TRUE, FALSE);

INSERT INTO patients (id, user_id, nic_ciphertext, nic_lookup_hash, date_of_birth_ciphertext,
                      gender, phone_ciphertext, address_ciphertext)
VALUES
    (1,5,'DEMO_CIPHERTEXT_NIC_1',repeat('a',64),'DEMO_CIPHERTEXT_DOB_1','MALE','DEMO_CIPHERTEXT_PHONE_1','DEMO_CIPHERTEXT_ADDRESS_1'),
    (2,6,'DEMO_CIPHERTEXT_NIC_2',repeat('b',64),'DEMO_CIPHERTEXT_DOB_2','FEMALE','DEMO_CIPHERTEXT_PHONE_2','DEMO_CIPHERTEXT_ADDRESS_2'),
    (3,7,'DEMO_CIPHERTEXT_NIC_3',repeat('c',64),'DEMO_CIPHERTEXT_DOB_3','MALE','DEMO_CIPHERTEXT_PHONE_3','DEMO_CIPHERTEXT_ADDRESS_3'),
    (4,8,'DEMO_CIPHERTEXT_NIC_4',repeat('d',64),'DEMO_CIPHERTEXT_DOB_4','FEMALE','DEMO_CIPHERTEXT_PHONE_4','DEMO_CIPHERTEXT_ADDRESS_4');

INSERT INTO specialisations (id,name,description) VALUES
                                                      (1,'Cardiology','Heart and cardiovascular care'),
                                                      (2,'Dermatology','Skin and related conditions'),
                                                      (3,'Paediatrics','Medical care for children'),
                                                      (4,'Neurology','Nervous system and brain care');

INSERT INTO doctors (id,user_id,specialisation_id,slmc_number,qualifications,experience_years,consultation_fee,bio)
VALUES
    (1,3,1,'SLMC-DEMO-1001','MBBS, MD Cardiology',12,2500.00,'Fictional demonstration cardiologist'),
    (2,4,2,'SLMC-DEMO-1002','MBBS, MD Dermatology',8,3000.00,'Fictional demonstration dermatologist');

INSERT INTO rooms (id,room_name,location) VALUES
                                              (1,'Consultation Room 01','Ground Floor'),
                                              (2,'Consultation Room 02','First Floor');

-- A current-day physical session and a previous-day online session.
INSERT INTO sessions (id,doctor_id,room_id,session_date,start_time,end_time,session_type,
                      max_patients,minutes_per_patient,delay_minutes,consultation_fee,status,
                      next_appointment_number,now_serving_number)
VALUES
    (1,1,1,CURRENT_DATE,'08:00','17:00','PHYSICAL',20,15,0,2500.00,'IN_PROGRESS',5,2),
    (2,2,NULL,CURRENT_DATE - 1,'08:00','17:00','ONLINE',20,15,10,3000.00,'COMPLETED',3,2),
    (3,1,2,CURRENT_DATE + 2,'09:00','12:00','PHYSICAL',10,15,0,2500.00,'SCHEDULED',2,0);

-- Every appointment status required by the assignment is represented.
INSERT INTO appointments (id,session_id,patient_id,appointment_number,reason_for_visit_ciphertext,
                          appointment_status,payment_status,payment_method,booked_at,arrived_at,cancelled_at,estimated_at)
VALUES
    (1,1,1,1,'DEMO_CIPHERTEXT_REASON_1','BOOKED','PENDING',NULL,CURRENT_TIMESTAMP - INTERVAL '1 day',NULL,NULL,CURRENT_TIMESTAMP),
    (2,1,2,2,'DEMO_CIPHERTEXT_REASON_2','ARRIVED','PAID','CASH',CURRENT_TIMESTAMP - INTERVAL '1 day',CURRENT_TIMESTAMP - INTERVAL '20 minutes',NULL,CURRENT_TIMESTAMP),
    (3,1,3,3,'DEMO_CIPHERTEXT_REASON_3','IN_CONSULTATION','PAID','CARD',CURRENT_TIMESTAMP - INTERVAL '1 day',CURRENT_TIMESTAMP - INTERVAL '30 minutes',NULL,CURRENT_TIMESTAMP),
    (4,2,1,1,'DEMO_CIPHERTEXT_REASON_4','COMPLETED','PAID','CASH',CURRENT_TIMESTAMP - INTERVAL '2 days',CURRENT_TIMESTAMP - INTERVAL '1 day',NULL,CURRENT_TIMESTAMP - INTERVAL '1 day'),
    (5,2,2,2,'DEMO_CIPHERTEXT_REASON_5','NO_SHOW','PENDING',NULL,CURRENT_TIMESTAMP - INTERVAL '2 days',NULL,NULL,CURRENT_TIMESTAMP - INTERVAL '1 day'),
    (6,3,4,1,'DEMO_CIPHERTEXT_REASON_6','CANCELLED','PENDING',NULL,CURRENT_TIMESTAMP - INTERVAL '1 day',NULL,CURRENT_TIMESTAMP - INTERVAL '12 hours',CURRENT_TIMESTAMP + INTERVAL '2 days');

INSERT INTO payments (id,appointment_id,amount,payment_method,payment_status,paid_at,recorded_by)
VALUES
    (1,1,2500.00,NULL,'PENDING',NULL,2),
    (2,2,2500.00,'CASH','PAID',CURRENT_TIMESTAMP - INTERVAL '20 minutes',2),
    (3,3,2500.00,'CARD','PAID',CURRENT_TIMESTAMP - INTERVAL '30 minutes',2),
    (4,4,3000.00,'CASH','PAID',CURRENT_TIMESTAMP - INTERVAL '1 day',2),
    (5,5,3000.00,NULL,'PENDING',NULL,2),
    (6,6,2500.00,NULL,'PENDING',NULL,2);

INSERT INTO consultations (id,appointment_id,diagnosis_summary_encrypted,advice_encrypted,prescription_encrypted,
                           consultation_notes_encrypted,started_at,completed_at)
VALUES
    (1,3,'DEMO_CIPHERTEXT_DIAGNOSIS_1','DEMO_CIPHERTEXT_ADVICE_1','DEMO_CIPHERTEXT_PRESCRIPTION_1',
     'DEMO_CIPHERTEXT_NOTES_1',CURRENT_TIMESTAMP - INTERVAL '15 minutes',NULL),
    (2,4,'DEMO_CIPHERTEXT_DIAGNOSIS_2','DEMO_CIPHERTEXT_ADVICE_2','DEMO_CIPHERTEXT_PRESCRIPTION_2',
     'DEMO_CIPHERTEXT_NOTES_2',CURRENT_TIMESTAMP - INTERVAL '1 day 30 minutes',CURRENT_TIMESTAMP - INTERVAL '1 day');

INSERT INTO chat_messages (id,consultation_id,sender_user_id,message_encrypted,message_length)
VALUES
    (1,1,7,'DEMO_CIPHERTEXT_CHAT_1',22),
    (2,1,3,'DEMO_CIPHERTEXT_CHAT_2',28),
    (3,2,5,'DEMO_CIPHERTEXT_CHAT_3',18),
    (4,2,4,'DEMO_CIPHERTEXT_CHAT_4',24);

INSERT INTO notifications (id,user_id,notification_type,title,message,is_read)
VALUES
    (1,5,'APPOINTMENT_CONFIRMED','Appointment confirmation','Your demonstration appointment has been booked.',FALSE),
    (2,6,'PAYMENT_REMINDER','Payment reminder','Please check your demonstration appointment payment.',FALSE),
    (3,3,'NEW_APPOINTMENT','New appointment','A new demonstration appointment was created.',TRUE);

INSERT INTO feedback (id,appointment_id,patient_id,rating,comment,is_approved,is_hidden)
VALUES (1,4,1,5,'Fictional demonstration feedback.',TRUE,FALSE);

INSERT INTO notices (id,title,content,created_by,published_at,expires_at,is_active)
VALUES
    (1,'Hospital Notice','Welcome to MediChannel demonstration.',2,CURRENT_TIMESTAMP - INTERVAL '1 day',CURRENT_TIMESTAMP + INTERVAL '30 days',TRUE),
    (2,'Appointment Information','Please arrive before your physical appointment.',2,CURRENT_TIMESTAMP - INTERVAL '1 day',CURRENT_TIMESTAMP + INTERVAL '15 days',TRUE);

INSERT INTO audit_logs (id,actor_user_id,action,entity_type,entity_id,ip_address)
VALUES
    (1,1,'SYSTEM_INITIALIZED','SYSTEM',NULL,'127.0.0.1'),
    (2,2,'PAYMENT_RECORDED','PAYMENT','2','127.0.0.1'),
    (3,2,'NOTICE_CREATED','NOTICE','1','127.0.0.1');

-- Keep identity sequences above inserted IDs.
SELECT setval(pg_get_serial_sequence('users','id'), COALESCE((SELECT MAX(id) FROM users),1), TRUE);
SELECT setval(pg_get_serial_sequence('patients','id'), COALESCE((SELECT MAX(id) FROM patients),1), TRUE);
SELECT setval(pg_get_serial_sequence('specialisations','id'), COALESCE((SELECT MAX(id) FROM specialisations),1), TRUE);
SELECT setval(pg_get_serial_sequence('doctors','id'), COALESCE((SELECT MAX(id) FROM doctors),1), TRUE);
SELECT setval(pg_get_serial_sequence('rooms','id'), COALESCE((SELECT MAX(id) FROM rooms),1), TRUE);
SELECT setval(pg_get_serial_sequence('sessions','id'), COALESCE((SELECT MAX(id) FROM sessions),1), TRUE);
SELECT setval(pg_get_serial_sequence('appointments','id'), COALESCE((SELECT MAX(id) FROM appointments),1), TRUE);
SELECT setval(pg_get_serial_sequence('payments','id'), COALESCE((SELECT MAX(id) FROM payments),1), TRUE);
SELECT setval(pg_get_serial_sequence('consultations','id'), COALESCE((SELECT MAX(id) FROM consultations),1), TRUE);
SELECT setval(pg_get_serial_sequence('chat_messages','id'), COALESCE((SELECT MAX(id) FROM chat_messages),1), TRUE);
SELECT setval(pg_get_serial_sequence('notifications','id'), COALESCE((SELECT MAX(id) FROM notifications),1), TRUE);
SELECT setval(pg_get_serial_sequence('feedback','id'), COALESCE((SELECT MAX(id) FROM feedback),1), TRUE);
SELECT setval(pg_get_serial_sequence('notices','id'), COALESCE((SELECT MAX(id) FROM notices),1), TRUE);
SELECT setval(pg_get_serial_sequence('audit_logs','id'), COALESCE((SELECT MAX(id) FROM audit_logs),1), TRUE);

COMMIT;
