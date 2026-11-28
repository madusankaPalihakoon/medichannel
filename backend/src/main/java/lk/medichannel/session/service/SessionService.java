
package lk.medichannel.session.service;

import lk.medichannel.doctor.entity.Doctor;
import lk.medichannel.doctor.repository.DoctorRepository;
import lk.medichannel.room.entity.Room;
import lk.medichannel.room.repository.RoomRepository;
import lk.medichannel.session.dto.SessionRequest;
import lk.medichannel.session.dto.SessionResponse;
import lk.medichannel.session.entity.Session;
import lk.medichannel.session.repository.SessionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class SessionService {

    private final SessionRepository sessionRepository;
    private final DoctorRepository doctorRepository;
    private final RoomRepository roomRepository;

    public SessionService(
            SessionRepository sessionRepository,
            DoctorRepository doctorRepository,
            RoomRepository roomRepository) {

        this.sessionRepository = sessionRepository;
        this.doctorRepository = doctorRepository;
        this.roomRepository = roomRepository;
    }

    // Convert Session Entity into SessionResponse DTO
    private SessionResponse convertToResponse(Session session) {

        SessionResponse response = new SessionResponse();

        response.setId(session.getId());
        response.setDoctorId(session.getDoctorId());
        response.setRoomId(session.getRoomId());
        response.setSessionDate(session.getSessionDate());
        response.setStartTime(session.getStartTime());
        response.setEndTime(session.getEndTime());
        response.setSessionType(session.getSessionType());
        response.setMaxPatients(session.getMaxPatients());
        response.setMinutesPerPatient(session.getMinutesPerPatient());
        response.setDelayMinutes(session.getDelayMinutes());
        response.setConsultationFee(session.getConsultationFee());
        response.setStatus(session.getStatus());
        response.setNextAppointmentNumber(
                session.getNextAppointmentNumber());
        response.setNowServingNumber(session.getNowServingNumber());
        response.setCreatedAt(session.getCreatedAt());
        response.setUpdatedAt(session.getUpdatedAt());

        return response;
    }

    // Convert SessionRequest DTO into Session Entity
    private Session convertToEntity(SessionRequest request) {

        Session session = new Session();

        session.setDoctorId(request.getDoctorId());
        session.setRoomId(request.getRoomId());
        session.setSessionDate(request.getSessionDate());
        session.setStartTime(request.getStartTime());
        session.setEndTime(request.getEndTime());
        session.setSessionType(request.getSessionType());
        session.setMaxPatients(request.getMaxPatients());
        session.setMinutesPerPatient(request.getMinutesPerPatient());
        session.setConsultationFee(request.getConsultationFee());

        return session;
    }

    // 1. Retrieve all sessions
    @Transactional(readOnly = true)
    public List<SessionResponse> getAllSessions() {

        return sessionRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // 2. Retrieve session by ID
    @Transactional(readOnly = true)
    public SessionResponse getSessionById(Long id) {

        Session session = sessionRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Session not found with ID: " + id));

        return convertToResponse(session);
    }

    // 3. Create session
    public SessionResponse createSession(SessionRequest request) {

        validateSessionDetails(request);

        validateDoctor(request.getDoctorId());

        validateRoom(
                request.getSessionType(),
                request.getRoomId());

        checkDoctorAvailability(
                request.getDoctorId(),
                request.getSessionDate(),
                request.getStartTime(),
                request.getEndTime(),
                null);

        checkRoomAvailability(
                request.getSessionType(),
                request.getRoomId(),
                request.getSessionDate(),
                request.getStartTime(),
                request.getEndTime(),
                null);

        Session session = convertToEntity(request);

        session.setStatus(Session.SessionStatus.SCHEDULED);
        session.setDelayMinutes(0);
        session.setNextAppointmentNumber(1);
        session.setNowServingNumber(0);

        Session savedSession = sessionRepository.save(session);

        return convertToResponse(savedSession);
    }

    // 4. Update session
    public SessionResponse updateSession(
            Long id,
            SessionRequest request) {

        Session existingSession = sessionRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Session not found with ID: " + id));

        if (existingSession.getStatus()
                != Session.SessionStatus.SCHEDULED) {

            throw new IllegalStateException(
                    "Only scheduled sessions can be updated.");
        }

        validateSessionDetails(request);

        validateDoctor(request.getDoctorId());

        validateRoom(
                request.getSessionType(),
                request.getRoomId());

        checkDoctorAvailability(
                request.getDoctorId(),
                request.getSessionDate(),
                request.getStartTime(),
                request.getEndTime(),
                id);

        checkRoomAvailability(
                request.getSessionType(),
                request.getRoomId(),
                request.getSessionDate(),
                request.getStartTime(),
                request.getEndTime(),
                id);

        existingSession.setDoctorId(request.getDoctorId());
        existingSession.setRoomId(request.getRoomId());
        existingSession.setSessionDate(request.getSessionDate());
        existingSession.setStartTime(request.getStartTime());
        existingSession.setEndTime(request.getEndTime());
        existingSession.setSessionType(request.getSessionType());
        existingSession.setMaxPatients(request.getMaxPatients());
        existingSession.setMinutesPerPatient(
                request.getMinutesPerPatient());
        existingSession.setConsultationFee(
                request.getConsultationFee());

        Session savedSession =
                sessionRepository.save(existingSession);

        return convertToResponse(savedSession);
    }

    // 5. Open session
    public SessionResponse openSession(Long id) {

        Session session = getSessionEntity(id);

        if (session.getStatus() != Session.SessionStatus.SCHEDULED) {
            throw new IllegalStateException(
                    "Only scheduled sessions can be opened.");
        }

        session.setStatus(Session.SessionStatus.OPEN);

        return convertToResponse(sessionRepository.save(session));
    }

    // 6. Close session
    public SessionResponse closeSession(Long id) {

        Session session = getSessionEntity(id);

        if (session.getStatus() != Session.SessionStatus.OPEN &&
                session.getStatus() != Session.SessionStatus.IN_PROGRESS) {

            throw new IllegalStateException(
                    "Only open or in-progress sessions can be closed.");
        }

        session.setStatus(Session.SessionStatus.COMPLETED);

        return convertToResponse(sessionRepository.save(session));
    }

    // 7. Delay session
    public SessionResponse delaySession(
            Long id,
            Integer additionalDelayMinutes) {

        Session session = getSessionEntity(id);

        if (additionalDelayMinutes == null ||
                additionalDelayMinutes <= 0) {

            throw new IllegalArgumentException(
                    "Delay minutes must be greater than zero.");
        }

        if (session.getStatus() == Session.SessionStatus.CANCELLED ||
                session.getStatus() == Session.SessionStatus.COMPLETED) {

            throw new IllegalStateException(
                    "Completed or cancelled sessions cannot be delayed.");
        }

        int currentDelay = session.getDelayMinutes() == null
                ? 0 : session.getDelayMinutes();

        session.setDelayMinutes(
                Math.addExact(currentDelay, additionalDelayMinutes));

        return convertToResponse(sessionRepository.save(session));
    }

    // 8. Cancel session
    public SessionResponse cancelSession(Long id) {

        Session session = getSessionEntity(id);

        if (session.getStatus() == Session.SessionStatus.COMPLETED) {
            throw new IllegalStateException(
                    "Completed sessions cannot be cancelled.");
        }

        if (session.getStatus() == Session.SessionStatus.CANCELLED) {
            throw new IllegalStateException(
                    "Session is already cancelled.");
        }

        session.setStatus(Session.SessionStatus.CANCELLED);

        return convertToResponse(sessionRepository.save(session));
    }

    // 9. Check doctor availability
    private void checkDoctorAvailability(
            Long doctorId,
            LocalDate sessionDate,
            LocalTime startTime,
            LocalTime endTime,
            Long excludeSessionId) {

        boolean overlapping =
                sessionRepository.existsDoctorOverlappingSession(
                        doctorId,
                        sessionDate,
                        startTime,
                        endTime,
                        Session.SessionStatus.CANCELLED,
                        excludeSessionId);

        if (overlapping) {
            throw new IllegalStateException(
                    "Doctor already has another session during this time.");
        }
    }

    // 10. Check room availability
    private void checkRoomAvailability(
            Session.SessionType sessionType,
            Long roomId,
            LocalDate sessionDate,
            LocalTime startTime,
            LocalTime endTime,
            Long excludeSessionId) {

        if (sessionType == Session.SessionType.ONLINE) {
            return;
        }

        boolean overlapping =
                sessionRepository.existsRoomOverlappingSession(
                        roomId,
                        sessionDate,
                        startTime,
                        endTime,
                        Session.SessionStatus.CANCELLED,
                        excludeSessionId);

        if (overlapping) {
            throw new IllegalStateException(
                    "Room is already booked during this time.");
        }
    }

    // 11. Public availability check
    @Transactional(readOnly = true)
    public Map<String, Boolean> checkAvailability(
            Long doctorId,
            Long roomId,
            LocalDate sessionDate,
            LocalTime startTime,
            LocalTime endTime,
            Session.SessionType sessionType) {

        validateTime(startTime, endTime);

        if (sessionDate == null ||
                sessionDate.isBefore(LocalDate.now())) {

            throw new IllegalArgumentException(
                    "Session date must be today or a future date.");
        }

        validateDoctor(doctorId);
        validateRoom(sessionType, roomId);

        boolean doctorAvailable =
                !sessionRepository.existsDoctorOverlappingSession(
                        doctorId,
                        sessionDate,
                        startTime,
                        endTime,
                        Session.SessionStatus.CANCELLED,
                        null);

        boolean roomAvailable = true;

        if (sessionType == Session.SessionType.PHYSICAL) {

            roomAvailable =
                    !sessionRepository.existsRoomOverlappingSession(
                            roomId,
                            sessionDate,
                            startTime,
                            endTime,
                            Session.SessionStatus.CANCELLED,
                            null);
        }

        Map<String, Boolean> result = new HashMap<>();

        result.put("doctorAvailable", doctorAvailable);
        result.put("roomAvailable", roomAvailable);
        result.put("available", doctorAvailable && roomAvailable);

        return result;
    }

    // Find session entity by ID
    private Session getSessionEntity(Long id) {

        return sessionRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Session not found with ID: " + id));
    }

    // Validate doctor
    private void validateDoctor(Long doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Doctor not found with ID: " + doctorId));

        if (!doctor.isActive()) {
            throw new IllegalStateException(
                    "Cannot create a session for an inactive doctor.");
        }
    }

    // Validate room
    private void validateRoom(
            Session.SessionType sessionType,
            Long roomId) {

        if (sessionType == null) {
            throw new IllegalArgumentException(
                    "Session type is required.");
        }

        if (sessionType == Session.SessionType.PHYSICAL) {

            if (roomId == null) {
                throw new IllegalArgumentException(
                        "Room ID is required for physical sessions.");
            }

            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Room not found with ID: " + roomId));

            if (!room.isActive()) {
                throw new IllegalStateException(
                        "Selected room is not active.");
            }

        } else if (sessionType == Session.SessionType.ONLINE) {

            if (roomId != null) {
                throw new IllegalArgumentException(
                        "Online sessions must not have a room ID.");
            }
        }
    }

    // Validate session details
    private void validateSessionDetails(SessionRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Session details are required.");
        }

        if (request.getDoctorId() == null ||
                request.getDoctorId() <= 0) {

            throw new IllegalArgumentException(
                    "Valid doctor ID is required.");
        }

        if (request.getSessionDate() == null ||
                request.getSessionDate().isBefore(LocalDate.now())) {

            throw new IllegalArgumentException(
                    "Session date must be today or a future date.");
        }

        validateTime(
                request.getStartTime(),
                request.getEndTime());

        if (request.getMaxPatients() == null ||
                request.getMaxPatients() < 1 ||
                request.getMaxPatients() > 60) {

            throw new IllegalArgumentException(
                    "Maximum patients must be between 1 and 60.");
        }

        if (request.getMinutesPerPatient() == null ||
                request.getMinutesPerPatient() < 5 ||
                request.getMinutesPerPatient() > 30) {

            throw new IllegalArgumentException(
                    "Minutes per patient must be between 5 and 30.");
        }

        if (request.getConsultationFee() == null ||
                request.getConsultationFee().signum() < 0) {

            throw new IllegalArgumentException(
                    "Consultation fee cannot be negative.");
        }
    }

    // Validate session time
    private void validateTime(
            LocalTime startTime,
            LocalTime endTime) {

        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException(
                    "Start time and end time are required.");
        }

        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException(
                    "End time must be after start time.");
        }
    }
}
