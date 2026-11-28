
package lk.medichannel.session.dto;

import lk.medichannel.session.entity.Session;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

public class SessionResponse {

    private Long id;
    private Long doctorId;
    private Long roomId;

    private LocalDate sessionDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private Session.SessionType sessionType;
    private Integer maxPatients;
    private Integer minutesPerPatient;

    private Integer delayMinutes;
    private BigDecimal consultationFee;

    private Session.SessionStatus status;

    private Integer nextAppointmentNumber;
    private Integer nowServingNumber;

    private Instant createdAt;
    private Instant updatedAt;

    public SessionResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Session.SessionStatus getStatus() {
        return status;
    }

    public void setStatus(Session.SessionStatus status) {
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

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
