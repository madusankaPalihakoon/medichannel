
package lk.medichannel.audit;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository repository;

    public AuditService(AuditLogRepository repository) {
        this.repository = repository;
    }

    public void log(
            Long actorId,
            String action,
            String entityType,
            Object entityId,
            HttpServletRequest request
    ) {

        String id = entityId == null
                ? null
                : entityId.toString();

        String ip = request == null
                ? null
                : request.getRemoteAddr();

        repository.save(
                AuditLog.of(
                        actorId,
                        action,
                        entityType,
                        id,
                        ip
                )
        );
    }
}
