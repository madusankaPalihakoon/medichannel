
package lk.medichannel.appointment.dto;

import jakarta.validation.constraints.NotNull;
import lk.medichannel.appointment.entity.Appointment;

public class AppointmentStatusUpdateRequest {

    @NotNull(message = "Appointment status is required")
    private Appointment.AppointmentStatus appointmentStatus;

    public AppointmentStatusUpdateRequest() {
    }

    public AppointmentStatusUpdateRequest(
            Appointment.AppointmentStatus appointmentStatus) {
        this.appointmentStatus = appointmentStatus;
    }

    public Appointment.AppointmentStatus getAppointmentStatus() {
        return appointmentStatus;
    }

    public void setAppointmentStatus(
            Appointment.AppointmentStatus appointmentStatus) {
        this.appointmentStatus = appointmentStatus;
    }
}

