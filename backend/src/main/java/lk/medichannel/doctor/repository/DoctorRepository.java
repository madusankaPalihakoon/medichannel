
package lk.medichannel.doctor.repository;

import lk.medichannel.doctor.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    // Filter doctors by specialisation
    List<Doctor> findBySpecialisationId(Long specialisationId);

    // Retrieve active doctors
    List<Doctor> findByActiveTrue();

    // Retrieve doctors by active status
    List<Doctor> findByActive(boolean active);

    // Search doctors by SLMC number
    List<Doctor> findBySlmcNumberContainingIgnoreCase(String keyword);

    // Search doctors by qualifications
    List<Doctor> findByQualificationsContainingIgnoreCase(String keyword);

    // Find doctor by SLMC number
    Optional<Doctor> findBySlmcNumber(String slmcNumber);

    // Check duplicate SLMC number
    boolean existsBySlmcNumber(String slmcNumber);

    // Check whether user is already registered as a doctor
    boolean existsByUserId(Long userId);
}






