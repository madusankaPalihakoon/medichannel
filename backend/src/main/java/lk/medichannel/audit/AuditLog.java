
package lk.medichannel.audit;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actor_user_id")
    private Long actorUserId;

    @Column(name = "action", nullable = false, length = 100)
    private String action;

    @Column(name = "entity_type", length = 100)
    private String entityType;

    // PostgreSQL: entity_id VARCHAR(100)
    @Column(name = "entity_id", length = 100)
    private String entityId;

    // PostgreSQL: ip_address VARCHAR(45)
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public Long getId() {
        return id;
    }

    public Long getActorUserId() {
        return actorUserId;
    }

    public String getAction() {
        return action;
    }

    public String getEntityType() {
        return entityType;
    }

    public String getEntityId() {
        return entityId;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public static AuditLog of(
            Long actor,
            String action,
            String type,
            String entityId,
            String ip
    ) {
        AuditLog log = new AuditLog();

        log.actorUserId = actor;
        log.action = action;
        log.entityType = type;
        log.entityId = entityId;
        log.ipAddress = ip;

        return log;
    }
}
