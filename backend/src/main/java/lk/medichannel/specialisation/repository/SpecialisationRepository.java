
package lk.medichannel.specialisation.repository;

import lk.medichannel.specialisation.entity.Specialisation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpecialisationRepository extends JpaRepository<Specialisation, Long> {

    // Search specialisations by name
    List<Specialisation> findByNameContainingIgnoreCase(String name);

    // Check whether a specialisation name already exists
    boolean existsByNameIgnoreCase(String name);

    // Check whether a name exists excluding a specific ID
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
