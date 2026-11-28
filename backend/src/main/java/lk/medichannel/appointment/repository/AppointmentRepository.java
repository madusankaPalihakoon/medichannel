
package lk.medichannel.appointment.repository;

import lk.medichannel.appointment.entity.Appointment;
import lk.medichannel.appointment.entity.Appointment.AppointmentStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    // Retrieve appointments belonging to a patient
    List<Appointment> findByPatientId(Long patientId);

    // Retrieve appointments belonging to a session
    List<Appointment> findBySessionId(Long sessionId);

    // Retrieve appointments by status
    List<Appointment> findByAppointmentStatus(
            AppointmentStatus appointmentStatus
    );

    // Retrieve patient appointment history
    List<Appointment> findByPatientIdOrderByBookedAtDesc(
            Long patientId
    );

    // Retrieve appointments in a session by status
    List<Appointment> findBySessionIdAndAppointmentStatus(
            Long sessionId,
            AppointmentStatus appointmentStatus
    );

    // Check duplicate active appointments
    boolean existsBySessionIdAndPatientIdAndAppointmentStatusIn(
            Long sessionId,
            Long patientId,
            List<AppointmentStatus> statuses
    );

    // Count appointments in a session
    long countBySessionIdAndAppointmentStatusIn(
            Long sessionId,
            List<AppointmentStatus> statuses
    );
}
