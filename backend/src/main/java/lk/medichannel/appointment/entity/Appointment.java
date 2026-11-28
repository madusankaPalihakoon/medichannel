
package lk.medichannel.appointment.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.Instant;

@Entity
@Table(
        name = "appointments",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_appointment_session_number",
                        columnNames = {"session_id", "appointment_number"}
                )
        }
)
public class Appointment {

    public enum AppointmentStatus {
        BOOKED,
        ARRIVED,
        IN_CONSULTATION,
        COMPLETED,
        CANCELLED,
        NO_SHOW
    }

    public enum PaymentStatus {
        PENDING,
        PAID
    }

    public enum PaymentMethod {
        CASH,
        CARD
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Session ID is required")
    @Positive(message = "Session ID must be positive")
    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    @NotNull(message = "Patient ID is required")
    @Positive(message = "Patient ID must be positive")
    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @NotNull(message = "Appointment number is required")
    @Positive(message = "Appointment number must be positive")
    @Column(name = "appointment_number", nullable = false)
    private Integer appointmentNumber;

    @NotNull(message = "Visit reason is required")
    @Column(
            name = "reason_for_visit_ciphertext",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String reasonForVisitCiphertext;

    @Enumerated(EnumType.STRING)
    @Column(name = "appointment_status", nullable = false, length = 25)
    private AppointmentStatus appointmentStatus =
            AppointmentStatus.BOOKED;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 10)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 10)
    private PaymentMethod paymentMethod;

    @Column(name = "booked_at", insertable = false, updatable = false)
    private Instant bookedAt;

    @Column(name = "arrived_at")
    private Instant arrivedAt;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    @Column(name = "estimated_at")
    private Instant estimatedAt;

    public Appointment() {
    }

    public Long getId() {
        return id;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Integer getAppointmentNumber() {
        return appointmentNumber;
    }

    public void setAppointmentNumber(Integer appointmentNumber) {
        this.appointmentNumber = appointmentNumber;
    }

    public String getReasonForVisitCiphertext() {
        return reasonForVisitCiphertext;
    }

    public void setReasonForVisitCiphertext(String reason) {
        this.reasonForVisitCiphertext = reason;
    }

    public AppointmentStatus getAppointmentStatus() {
        return appointmentStatus;
    }

    public void setAppointmentStatus(AppointmentStatus status) {
        this.appointmentStatus = status;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus status) {
        this.paymentStatus = status;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod method) {
        this.paymentMethod = method;
    }

    public Instant getBookedAt() {
        return bookedAt;
    }

    public Instant getArrivedAt() {
        return arrivedAt;
    }

    public void setArrivedAt(Instant arrivedAt) {
        this.arrivedAt = arrivedAt;
    }

    public Instant getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(Instant cancelledAt) {
        this.cancelledAt = cancelledAt;
    }

    public Instant getEstimatedAt() {
        return estimatedAt;
    }

    public void setEstimatedAt(Instant estimatedAt) {
        this.estimatedAt = estimatedAt;
    }
}
