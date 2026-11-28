erDiagram
USERS {
bigint id PK
text full_name_ciphertext
text email_ciphertext
varchar email_lookup_hash UK
varchar password_hash
varchar role
boolean active
integer failed_login_attempts
timestamptz locked_until
boolean password_change_required
timestamptz created_at
timestamptz updated_at
}
PATIENTS {
bigint id PK
bigint user_id FK, UK
text nic_ciphertext
varchar nic_lookup_hash UK
text date_of_birth_ciphertext
varchar gender
text phone_ciphertext
text address_ciphertext
timestamptz created_at
}
SPECIALISATIONS {
bigint id PK
varchar name UK
text description
boolean is_active
}
DOCTORS {
bigint id PK
bigint user_id FK, UK
bigint specialisation_id FK
varchar slmc_number UK
text qualifications
integer experience_years
numeric consultation_fee
text bio
boolean is_active
}
ROOMS {
bigint id PK
varchar room_name UK
varchar location
boolean is_active
}
SESSIONS {
bigint id PK
bigint doctor_id FK
bigint room_id FK
date session_date
time start_time
time end_time
varchar session_type
integer max_patients
integer minutes_per_patient
integer delay_minutes
numeric consultation_fee
varchar status
integer next_appointment_number
integer now_serving_number
}
APPOINTMENTS {
bigint id PK
bigint session_id FK
bigint patient_id FK
integer appointment_number
text reason_for_visit_ciphertext
varchar appointment_status
varchar payment_status
varchar payment_method
timestamptz booked_at
timestamptz arrived_at
timestamptz cancelled_at
timestamptz estimated_at
}
PAYMENTS {
bigint id PK
bigint appointment_id FK, UK
numeric amount
varchar payment_method
varchar payment_status
timestamptz paid_at
bigint recorded_by FK
timestamptz created_at
}
CONSULTATIONS {
bigint id PK
bigint appointment_id FK, UK
text diagnosis_summary_encrypted
text advice_encrypted
text prescription_encrypted
text consultation_notes_encrypted
timestamptz started_at
timestamptz completed_at
}
CHAT_MESSAGES {
bigint id PK
bigint consultation_id FK
bigint sender_user_id FK
text message_encrypted
smallint message_length
timestamptz sent_at
}
NOTIFICATIONS {
bigint id PK
bigint user_id FK
varchar notification_type
varchar title
text message
boolean is_read
timestamptz created_at
}
FEEDBACK {
bigint id PK
bigint appointment_id FK
bigint patient_id FK
integer rating
text comment
boolean is_approved
boolean is_hidden
timestamptz created_at
}
NOTICES {
bigint id PK
varchar title
text content
bigint created_by FK
timestamptz published_at
timestamptz expires_at
boolean is_active
}
AUDIT_LOGS {
bigint id PK
bigint actor_user_id FK
varchar action
varchar entity_type
varchar entity_id
varchar ip_address
timestamptz created_at
}

    USERS ||--o| PATIENTS : "has patient profile"
    USERS ||--o| DOCTORS : "has doctor profile"
    SPECIALISATIONS ||--o{ DOCTORS : "categorises"
    DOCTORS ||--o{ SESSIONS : "conducts"
    ROOMS o|--o{ SESSIONS : "hosts physical sessions"
    SESSIONS ||--o{ APPOINTMENTS : "contains"
    PATIENTS ||--o{ APPOINTMENTS : "books"
    APPOINTMENTS ||--o| PAYMENTS : "has payment"
    USERS o|--o{ PAYMENTS : "records"
    APPOINTMENTS ||--o| CONSULTATIONS : "has"
    CONSULTATIONS ||--o{ CHAT_MESSAGES : "contains"
    USERS ||--o{ CHAT_MESSAGES : "sends"
    USERS ||--o{ NOTIFICATIONS : "receives"
    APPOINTMENTS ||--o| FEEDBACK : "receives"
    PATIENTS ||--o{ FEEDBACK : "submits"
    USERS ||--o{ NOTICES : "creates"
    USERS o|--o{ AUDIT_LOGS : "performs"
