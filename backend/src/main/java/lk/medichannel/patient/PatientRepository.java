package lk.medichannel.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PatientRepository
        extends JpaRepository<Patient, Long> {

    boolean existsByNicLookupHash(String nicLookupHash);

    Optional<Patient> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}