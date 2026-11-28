package lk.medichannel.appointment.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;

import lk.medichannel.appointment.dto.AppointmentRequest;
import lk.medichannel.appointment.dto.AppointmentResponse;
import lk.medichannel.appointment.dto.AppointmentStatusUpdateRequest;
import lk.medichannel.appointment.entity.Appointment;
import lk.medichannel.appointment.repository.AppointmentRepository;

import lk.medichannel.crypto.CryptoService;
import lk.medichannel.patient.PatientRepository;
import lk.medichannel.session.entity.Session;
import lk.medichannel.session.entity.Session.SessionStatus;
import lk.medichannel.session.repository.SessionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class AppointmentService {

    private static final ZoneId SRI_LANKA_ZONE =
            ZoneId.of("Asia/Colombo");

    private static final List<Appointment.AppointmentStatus> ACTIVE_STATUSES =
            List.of(
                    Appointment.AppointmentStatus.BOOKED,
                    Appointment.AppointmentStatus.ARRIVED,
                    Appointment.AppointmentStatus.IN_CONSULTATION
            );

    private final AppointmentRepository appointmentRepository;
    private final SessionRepository sessionRepository;
    private final PatientRepository patientRepository;
    private final CryptoService cryptoService;

    @PersistenceContext
    private EntityManager entityManager;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            SessionRepository sessionRepository,
            PatientRepository patientRepository,
            CryptoService cryptoService
    ) {
        this.appointmentRepository = appointmentRepository;
        this.sessionRepository = sessionRepository;
        this.patientRepository = patientRepository;
        this.cryptoService = cryptoService;
    }

    // ---------------------------------------------------------
    // 1. CREATE APPOINTMENT
    // ---------------------------------------------------------

    @Transactional
    public AppointmentResponse createAppointment(AppointmentRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Appointment request cannot be empty"
            );
        }

        // Validate patient
        if (!patientRepository.existsById(request.getPatientId())) {
            throw new IllegalArgumentException(
                    "Patient not found with ID: " + request.getPatientId()
            );
        }

        // Lock the session row to prevent concurrent number allocation.
        Session session = entityManager.find(
                Session.class,
                request.getSessionId(),
                LockModeType.PESSIMISTIC_WRITE
        );

        if (session == null) {
            throw new IllegalArgumentException(
                    "Session not found with ID: " + request.getSessionId()
            );
        }

        // Only OPEN sessions accept bookings.
        if (session.getStatus() != SessionStatus.OPEN) {
            throw new IllegalStateException(
                    "Appointments can only be booked for OPEN sessions"
            );
        }

        // Prevent duplicate active appointments.
        boolean alreadyBooked =
                appointmentRepository
                        .existsBySessionIdAndPatientIdAndAppointmentStatusIn(
                                session.getId(),
                                request.getPatientId(),
                                ACTIVE_STATUSES
                        );

        if (alreadyBooked) {
            throw new IllegalStateException(
                    "This patient already has an active appointment "
                            + "for this session"
            );
        }

        // Allocate the next appointment number.
        int appointmentNumber = session.getNextAppointmentNumber();

        if (appointmentNumber > session.getMaxPatients()) {
            throw new IllegalStateException(
                    "This session is fully booked"
            );
        }

        // Calculate estimated consultation time.
        Instant estimatedAt = calculateEstimatedTime(
                session,
                appointmentNumber
        );

        // Encrypt the visit reason before saving.
        String encryptedReason =
                cryptoService.encrypt(request.getReasonForVisit().trim());

        // Create appointment entity.
        Appointment appointment = new Appointment();

        appointment.setSessionId(session.getId());
        appointment.setPatientId(request.getPatientId());
        appointment.setAppointmentNumber(appointmentNumber);
        appointment.setReasonForVisitCiphertext(encryptedReason);

        appointment.setAppointmentStatus(
                Appointment.AppointmentStatus.BOOKED
        );

        appointment.setPaymentStatus(
                Appointment.PaymentStatus.PENDING
        );

        appointment.setPaymentMethod(null);
        appointment.setEstimatedAt(estimatedAt);

        // Increment the session counter.
        // This is done in the same transaction as the appointment insert.
        session.setNextAppointmentNumber(appointmentNumber + 1);

        sessionRepository.save(session);

        Appointment savedAppointment =
                appointmentRepository.saveAndFlush(appointment);

        // Refresh database-generated values such as booked_at.
        entityManager.refresh(savedAppointment);

        return convertToResponse(savedAppointment);
    }

    // ---------------------------------------------------------
    // 2. CALCULATE ESTIMATED CONSULTATION TIME
    // ---------------------------------------------------------

    private Instant calculateEstimatedTime(
            Session session,
            int appointmentNumber
    ) {

        LocalDateTime sessionStart = session.getSessionDate()
                .atTime(session.getStartTime());

        int waitingMinutes =
                session.getDelayMinutes()
                        + ((appointmentNumber - 1)
                        * session.getMinutesPerPatient());

        LocalDateTime estimatedDateTime =
                sessionStart.plusMinutes(waitingMinutes);

        return estimatedDateTime
                .atZone(SRI_LANKA_ZONE)
                .toInstant();
    }

    // ---------------------------------------------------------
    // 3. GET APPOINTMENT BY ID
    // ---------------------------------------------------------

    @Transactional(readOnly = true)
    public AppointmentResponse getAppointmentById(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Appointment not found with ID: " + id
                ));

        return convertToResponse(appointment);
    }

    // ---------------------------------------------------------
    // 4. GET ALL APPOINTMENTS
    // ---------------------------------------------------------

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAllAppointments() {

        return appointmentRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ---------------------------------------------------------
    // 5. GET APPOINTMENTS BY SESSION
    // ---------------------------------------------------------

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsBySession(
            Long sessionId
    ) {

        if (!sessionRepository.existsById(sessionId)) {
            throw new IllegalArgumentException(
                    "Session not found with ID: " + sessionId
            );
        }

        return appointmentRepository.findBySessionId(sessionId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ---------------------------------------------------------
    // 6. GET PATIENT APPOINTMENT HISTORY
    // ---------------------------------------------------------

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getPatientAppointmentHistory(
            Long patientId
    ) {

        if (!patientRepository.existsById(patientId)) {
            throw new IllegalArgumentException(
                    "Patient not found with ID: " + patientId
            );
        }

        return appointmentRepository
                .findByPatientIdOrderByBookedAtDesc(patientId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ---------------------------------------------------------
    // 7. CANCEL APPOINTMENT
    // ---------------------------------------------------------

    @Transactional
    public AppointmentResponse cancelAppointment(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Appointment not found with ID: " + id
                ));

        if (appointment.getAppointmentStatus()
                != Appointment.AppointmentStatus.BOOKED) {

            throw new IllegalStateException(
                    "Only BOOKED appointments can be cancelled"
            );
        }

        appointment.setAppointmentStatus(
                Appointment.AppointmentStatus.CANCELLED
        );

        appointment.setCancelledAt(Instant.now());

        Appointment updatedAppointment =
                appointmentRepository.saveAndFlush(appointment);

        return convertToResponse(updatedAppointment);
    }

    // ---------------------------------------------------------
    // 8. UPDATE APPOINTMENT STATUS
    // ---------------------------------------------------------

    @Transactional
    public AppointmentResponse updateAppointmentStatus(
            Long id,
            AppointmentStatusUpdateRequest request
    ) {

        if (request == null || request.getAppointmentStatus() == null) {
            throw new IllegalArgumentException(
                    "Appointment status is required"
            );
        }

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Appointment not found with ID: " + id
                ));

        Appointment.AppointmentStatus currentStatus =
                appointment.getAppointmentStatus();

        Appointment.AppointmentStatus newStatus =
                request.getAppointmentStatus();

        if (!isValidStatusTransition(currentStatus, newStatus)) {
            throw new IllegalStateException(
                    "Invalid appointment status transition: "
                            + currentStatus + " -> " + newStatus
            );
        }

        appointment.setAppointmentStatus(newStatus);

        if (newStatus == Appointment.AppointmentStatus.ARRIVED) {
            appointment.setArrivedAt(Instant.now());
        }

        Appointment updatedAppointment =
                appointmentRepository.saveAndFlush(appointment);

        return convertToResponse(updatedAppointment);
    }

    // ---------------------------------------------------------
    // 9. VALIDATE STATUS TRANSITIONS
    // ---------------------------------------------------------

    private boolean isValidStatusTransition(
            Appointment.AppointmentStatus currentStatus,
            Appointment.AppointmentStatus newStatus
    ) {

        if (currentStatus == newStatus) {
            return false;
        }

        return switch (currentStatus) {

            case BOOKED ->
                    newStatus == Appointment.AppointmentStatus.ARRIVED
                            || newStatus == Appointment.AppointmentStatus.NO_SHOW;

            case ARRIVED ->
                    newStatus == Appointment.AppointmentStatus.IN_CONSULTATION
                            || newStatus == Appointment.AppointmentStatus.NO_SHOW;

            case IN_CONSULTATION ->
                    newStatus == Appointment.AppointmentStatus.COMPLETED;

            case COMPLETED, CANCELLED, NO_SHOW -> false;
        };
    }

    // ---------------------------------------------------------
    // 10. CONVERT ENTITY TO RESPONSE DTO
    // ---------------------------------------------------------

    private AppointmentResponse convertToResponse(
            Appointment appointment
    ) {

        return new AppointmentResponse(
                appointment.getId(),
                appointment.getSessionId(),
                appointment.getPatientId(),
                appointment.getAppointmentNumber(),
                appointment.getAppointmentStatus(),
                appointment.getPaymentStatus(),
                appointment.getPaymentMethod(),
                appointment.getBookedAt(),
                appointment.getArrivedAt(),
                appointment.getCancelledAt(),
                appointment.getEstimatedAt()
        );
    }
}