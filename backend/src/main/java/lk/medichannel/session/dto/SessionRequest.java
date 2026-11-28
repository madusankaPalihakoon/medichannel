
package lk.medichannel.session.dto;

import lk.medichannel.session.entity.Session;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class SessionRequest {

    @NotNull(message = "Doctor ID is required")
    @Positive(message = "Doctor ID must be positive")
    private Long doctorId;

    private Long roomId;

    @NotNull(message = "Session date is required")
    private LocalDate sessionDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotNull(message = "Session type is required")
    private Session.SessionType sessionType;

    @NotNull(message = "Maximum patients is required")
    @Min(value = 1, message = "Minimum patients must be 1")
    @Max(value = 60, message = "Maximum patients cannot exceed 60")
    private Integer maxPatients;

    @NotNull(message = "Minutes per patient is required")
    @Min(value = 5, message = "Minimum consultation time is 5 minutes")
    @Max(value = 30, message = "Maximum consultation time is 30 minutes")
    private Integer minutesPerPatient;

    @NotNull(message = "Consultation fee is required")
    @DecimalMin(value = "0.00", message = "Consultation fee cannot be negative")
    private BigDecimal consultationFee;

    public SessionRequest() {
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

    public Session.SessionType getSessionType() {
        return sessionType;
    }

    public void setSessionType(Session.SessionType sessionType) {
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

    public BigDecimal getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }
}

