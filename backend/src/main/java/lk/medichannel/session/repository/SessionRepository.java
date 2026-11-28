
package lk.medichannel.session.repository;

import lk.medichannel.session.entity.Session;
import lk.medichannel.session.entity.Session.SessionStatus;
import lk.medichannel.session.entity.Session.SessionType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    // Retrieve all sessions belonging to a doctor
    List<Session> findByDoctorId(Long doctorId);

    // Retrieve sessions by date
    List<Session> findBySessionDate(LocalDate sessionDate);

    // Retrieve sessions by status
    List<Session> findByStatus(SessionStatus status);

    // Retrieve sessions by session type
    List<Session> findBySessionType(SessionType sessionType);

    // Retrieve sessions belonging to a doctor on a specific date
    List<Session> findByDoctorIdAndSessionDate(
            Long doctorId,
            LocalDate sessionDate
    );

    // Retrieve sessions belonging to a room on a specific date
    List<Session> findByRoomIdAndSessionDate(
            Long roomId,
            LocalDate sessionDate
    );

    // Retrieve sessions by doctor and status
    List<Session> findByDoctorIdAndStatus(
            Long doctorId,
            SessionStatus status
    );

    // Check doctor session overlap
    @Query("""
        SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END
        FROM Session s
        WHERE s.doctorId = :doctorId
        AND s.sessionDate = :sessionDate
        AND s.status <> :cancelledStatus
        AND (:excludeSessionId IS NULL OR s.id <> :excludeSessionId)
        AND s.startTime < :endTime
        AND s.endTime > :startTime
    """)
    boolean existsDoctorOverlappingSession(
            @Param("doctorId") Long doctorId,
            @Param("sessionDate") LocalDate sessionDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("cancelledStatus") SessionStatus cancelledStatus,
            @Param("excludeSessionId") Long excludeSessionId
    );

    // Check room session overlap
    @Query("""
        SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END
        FROM Session s
        WHERE s.roomId = :roomId
        AND s.sessionDate = :sessionDate
        AND s.status <> :cancelledStatus
        AND (:excludeSessionId IS NULL OR s.id <> :excludeSessionId)
        AND s.startTime < :endTime
        AND s.endTime > :startTime
    """)
    boolean existsRoomOverlappingSession(
            @Param("roomId") Long roomId,
            @Param("sessionDate") LocalDate sessionDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("cancelledStatus") SessionStatus cancelledStatus,
            @Param("excludeSessionId") Long excludeSessionId
    );

    // Retrieve available sessions for a doctor on a given date
    @Query("""
        SELECT s FROM Session s
        WHERE s.doctorId = :doctorId
        AND s.sessionDate = :sessionDate
        AND s.status IN :statuses
        ORDER BY s.startTime ASC
    """)
    List<Session> findAvailableSessionsByDoctor(
            @Param("doctorId") Long doctorId,
            @Param("sessionDate") LocalDate sessionDate,
            @Param("statuses") List<SessionStatus> statuses
    );

    // Search sessions by date range
    List<Session> findBySessionDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );

    // Retrieve a session by ID


    // Check whether a doctor has any active sessions
    boolean existsByDoctorIdAndStatusNot(
            Long doctorId,
            SessionStatus status
    );

    // Check whether a room has any active sessions
    boolean existsByRoomIdAndStatusNot(
            Long roomId,
            SessionStatus status
    );
}
