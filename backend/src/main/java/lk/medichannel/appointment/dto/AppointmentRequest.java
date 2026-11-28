
package lk.medichannel.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class AppointmentRequest {

    @NotNull(message = "Session ID is required")
    @Positive(message = "Session ID must be positive")
    private Long sessionId;

    @NotNull(message = "Patient ID is required")
    @Positive(message = "Patient ID must be positive")
    private Long patientId;

    @NotBlank(message = "Reason for visit is required")
    @Size(max = 2000, message = "Reason for visit cannot exceed 2000 characters")
    private String reasonForVisit;

    public AppointmentRequest() {
    }

    public AppointmentRequest(Long sessionId, Long patientId,
                              String reasonForVisit) {
        this.sessionId = sessionId;
        this.patientId = patientId;
        this.reasonForVisit = reasonForVisit;
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

    public String getReasonForVisit() {
        return reasonForVisit;
    }

    public void setReasonForVisit(String reasonForVisit) {
        this.reasonForVisit = reasonForVisit;
    }
}
