
package lk.medichannel.appointment.controller;

import jakarta.validation.Valid;

import lk.medichannel.appointment.dto.AppointmentRequest;
import lk.medichannel.appointment.dto.AppointmentResponse;
import lk.medichannel.appointment.dto.AppointmentStatusUpdateRequest;
import lk.medichannel.appointment.service.AppointmentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService
    ) {
        this.appointmentService = appointmentService;
    }

    // ---------------------------------------------------------
    // 1. CREATE APPOINTMENT
    // POST /api/appointments
    // ---------------------------------------------------------

    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(
            @Valid @RequestBody AppointmentRequest request
    ) {

        AppointmentResponse response =
                appointmentService.createAppointment(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ---------------------------------------------------------
    // 2. GET ALL APPOINTMENTS
    // GET /api/appointments
    // ---------------------------------------------------------

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {

        List<AppointmentResponse> appointments =
                appointmentService.getAllAppointments();

        return ResponseEntity.ok(appointments);
    }

    // ---------------------------------------------------------
    // 3. GET APPOINTMENT BY ID
    // GET /api/appointments/{id}
    // ---------------------------------------------------------

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getAppointmentById(
            @PathVariable Long id
    ) {

        AppointmentResponse response =
                appointmentService.getAppointmentById(id);

        return ResponseEntity.ok(response);
    }

    // ---------------------------------------------------------
    // 4. GET APPOINTMENTS BY SESSION
    // GET /api/appointments/session/{sessionId}
    // ---------------------------------------------------------

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsBySession(
            @PathVariable Long sessionId
    ) {

        List<AppointmentResponse> appointments =
                appointmentService.getAppointmentsBySession(sessionId);

        return ResponseEntity.ok(appointments);
    }

    // ---------------------------------------------------------
    // 5. GET PATIENT APPOINTMENT HISTORY
    // GET /api/appointments/patient/{patientId}
    // ---------------------------------------------------------

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponse>>
    getPatientAppointmentHistory(
            @PathVariable Long patientId
    ) {

        List<AppointmentResponse> appointments =
                appointmentService.getPatientAppointmentHistory(patientId);

        return ResponseEntity.ok(appointments);
    }

    // ---------------------------------------------------------
    // 6. CANCEL APPOINTMENT
    // PATCH /api/appointments/{id}/cancel
    // ---------------------------------------------------------

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponse> cancelAppointment(
            @PathVariable Long id
    ) {

        AppointmentResponse response =
                appointmentService.cancelAppointment(id);

        return ResponseEntity.ok(response);
    }

    // ---------------------------------------------------------
    // 7. UPDATE APPOINTMENT STATUS
    // PATCH /api/appointments/{id}/status
    // ---------------------------------------------------------

    @PatchMapping("/{id}/status")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentStatusUpdateRequest request
    ) {

        AppointmentResponse response =
                appointmentService.updateAppointmentStatus(id, request);

        return ResponseEntity.ok(response);
    }
}
