
package lk.medichannel.session.controller;

import lk.medichannel.session.dto.SessionRequest;
import lk.medichannel.session.dto.SessionResponse;
import lk.medichannel.session.entity.Session;
import lk.medichannel.session.service.SessionService;

import jakarta.validation.Valid;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    // 1. Create a new session
    @PostMapping
    public ResponseEntity<SessionResponse> createSession(
            @Valid @RequestBody SessionRequest request) {

        SessionResponse response =
                sessionService.createSession(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 2. Retrieve all sessions
    @GetMapping
    public ResponseEntity<List<SessionResponse>> getAllSessions() {

        return ResponseEntity.ok(
                sessionService.getAllSessions()
        );
    }

    // 3. Retrieve session by ID
    @GetMapping("/{id}")
    public ResponseEntity<SessionResponse> getSessionById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                sessionService.getSessionById(id)
        );
    }

    // 4. Update an existing session
    @PutMapping("/{id}")
    public ResponseEntity<SessionResponse> updateSession(
            @PathVariable Long id,
            @Valid @RequestBody SessionRequest request) {

        return ResponseEntity.ok(
                sessionService.updateSession(id, request)
        );
    }

    // 5. Open session
    @PatchMapping("/{id}/open")
    public ResponseEntity<SessionResponse> openSession(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                sessionService.openSession(id)
        );
    }

    // 6. Close session
    @PatchMapping("/{id}/close")
    public ResponseEntity<SessionResponse> closeSession(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                sessionService.closeSession(id)
        );
    }

    // 7. Delay session
    @PatchMapping("/{id}/delay")
    public ResponseEntity<SessionResponse> delaySession(
            @PathVariable Long id,
            @RequestParam Integer additionalDelayMinutes) {

        return ResponseEntity.ok(
                sessionService.delaySession(
                        id,
                        additionalDelayMinutes
                )
        );
    }

    // 8. Cancel session
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<SessionResponse> cancelSession(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                sessionService.cancelSession(id)
        );
    }

    // 9. Check doctor and room availability
    @GetMapping("/availability")
    public ResponseEntity<Map<String, Boolean>> checkAvailability(

            @RequestParam Long doctorId,

            @RequestParam(required = false) Long roomId,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate sessionDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
            LocalTime startTime,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
            LocalTime endTime,

            @RequestParam Session.SessionType sessionType) {

        return ResponseEntity.ok(
                sessionService.checkAvailability(
                        doctorId,
                        roomId,
                        sessionDate,
                        startTime,
                        endTime,
                        sessionType
                )
        );
    }
}

