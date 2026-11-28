
package lk.medichannel.appointment.dto;

import lk.medichannel.appointment.entity.Appointment;

import java.time.Instant;

public class AppointmentResponse {

    private Long id;
    private Long sessionId;
    private Long patientId;
    private Integer appointmentNumber;

    private Appointment.AppointmentStatus appointmentStatus;
    private Appointment.PaymentStatus paymentStatus;
    private Appointment.PaymentMethod paymentMethod;

    private Instant bookedAt;
    private Instant arrivedAt;
    private Instant cancelledAt;
    private Instant estimatedAt;

    public AppointmentResponse() {
    }

    public AppointmentResponse(
            Long id,
            Long sessionId,
            Long patientId,
            Integer appointmentNumber,
            Appointment.AppointmentStatus appointmentStatus,
            Appointment.PaymentStatus paymentStatus,
            Appointment.PaymentMethod paymentMethod,
            Instant bookedAt,
            Instant arrivedAt,
            Instant cancelledAt,
            Instant estimatedAt
    ) {
        this.id = id;
        this.sessionId = sessionId;
        this.patientId = patientId;
        this.appointmentNumber = appointmentNumber;
        this.appointmentStatus = appointmentStatus;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
        this.bookedAt = bookedAt;
        this.arrivedAt = arrivedAt;
        this.cancelledAt = cancelledAt;
        this.estimatedAt = estimatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Appointment.AppointmentStatus getAppointmentStatus() {
        return appointmentStatus;
    }

    public void setAppointmentStatus(
            Appointment.AppointmentStatus appointmentStatus) {
        this.appointmentStatus = appointmentStatus;
    }

    public Appointment.PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(
            Appointment.PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Appointment.PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(
            Appointment.PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Instant getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(Instant bookedAt) {
        this.bookedAt = bookedAt;
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
