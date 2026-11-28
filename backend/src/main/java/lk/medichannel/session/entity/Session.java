
package lk.medichannel.session.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "sessions")
public class Session {

    public enum SessionType {
        PHYSICAL,
        ONLINE
    }

    public enum SessionStatus {
        SCHEDULED,
        OPEN,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Doctor ID is required")
    @Positive(message = "Doctor ID must be positive")
    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column(name = "room_id")
    private Long roomId;

    @NotNull(message = "Session date is required")
    @Column(name = "session_date", nullable = false)
    private LocalDate sessionDate;

    @NotNull(message = "Start time is required")
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @NotNull(message = "Session type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "session_type", nullable = false, length = 10)
    private SessionType sessionType;

    @NotNull(message = "Maximum patients is required")
    @Min(value = 1, message = "Minimum patients must be 1")
    @Max(value = 60, message = "Maximum patients cannot exceed 60")
    @Column(name = "max_patients", nullable = false)
    private Integer maxPatients;

    @NotNull(message = "Minutes per patient is required")
    @Min(value = 5, message = "Minimum consultation time is 5 minutes")
    @Max(value = 30, message = "Maximum consultation time is 30 minutes")
    @Column(name = "minutes_per_patient", nullable = false)
    private Integer minutesPerPatient;

    @Min(value = 0, message = "Delay cannot be negative")
    @Column(name = "delay_minutes", nullable = false)
    private Integer delayMinutes = 0;

    @NotNull(message = "Consultation fee is required")
    @DecimalMin(value = "0.00", message = "Consultation fee cannot be negative")
    @Column(name = "consultation_fee", nullable = false,
            precision = 12, scale = 2)
    private BigDecimal consultationFee;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private SessionStatus status = SessionStatus.SCHEDULED;

    @Column(name = "next_appointment_number", nullable = false)
    private Integer nextAppointmentNumber = 1;

    @Column(name = "now_serving_number", nullable = false)
    private Integer nowServingNumber = 0;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private Instant updatedAt;

    public Session() {
    }

    public Long getId() {
        return id;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public LocalDate getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(LocalDate sessionDate) {
        this.sessionDate = sessionDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public SessionType getSessionType() {
        return sessionType;
    }

    public void setSessionType(SessionType sessionType) {
        this.sessionType = sessionType;
    }

    public Integer getMaxPatients() {
        return maxPatients;
    }

    public void setMaxPatients(Integer maxPatients) {
        this.maxPatients = maxPatients;
    }

    public Integer getMinutesPerPatient() {
        return minutesPerPatient;
    }

    public void setMinutesPerPatient(Integer minutesPerPatient) {
        this.minutesPerPatient = minutesPerPatient;
    }

    public Integer getDelayMinutes() {
        return delayMinutes;
    }

    public void setDelayMinutes(Integer delayMinutes) {
        this.delayMinutes = delayMinutes;
    }

    public BigDecimal getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public Integer getNextAppointmentNumber() {
        return nextAppointmentNumber;
    }

    public void setNextAppointmentNumber(Integer nextAppointmentNumber) {
        this.nextAppointmentNumber = nextAppointmentNumber;
    }

    public Integer getNowServingNumber() {
        return nowServingNumber;
    }

    public void setNowServingNumber(Integer nowServingNumber) {
        this.nowServingNumber = nowServingNumber;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
