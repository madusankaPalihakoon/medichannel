
package lk.medichannel.specialisation.service;

import lk.medichannel.specialisation.entity.Specialisation;
import lk.medichannel.specialisation.repository.SpecialisationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpecialisationService {

    private final SpecialisationRepository specialisationRepository;

    // Constructor Injection
    public SpecialisationService(SpecialisationRepository specialisationRepository) {
        this.specialisationRepository = specialisationRepository;
    }

    // 1. Create Specialisation
    public Specialisation createSpecialisation(Specialisation specialisation) {

        if (specialisation.getName() == null ||
                specialisation.getName().isBlank()) {
            throw new RuntimeException("Specialisation name is required");
        }

        if (specialisationRepository.existsByNameIgnoreCase(
                specialisation.getName().trim())) {
            throw new RuntimeException("Specialisation already exists");
        }

        specialisation.setName(specialisation.getName().trim());

        return specialisationRepository.save(specialisation);
    }

    // 2. Update Specialisation
    public Specialisation updateSpecialisation(Long id,
                                               Specialisation updatedSpecialisation) {

        Specialisation existingSpecialisation =
                specialisationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Specialisation not found with ID: " + id));

        if (updatedSpecialisation.getName() == null ||
                updatedSpecialisation.getName().isBlank()) {
            throw new RuntimeException("Specialisation name is required");
        }

        String newName = updatedSpecialisation.getName().trim();

        if (specialisationRepository
                .existsByNameIgnoreCaseAndIdNot(newName, id)) {
            throw new RuntimeException("Specialisation name already exists");
        }

        existingSpecialisation.setName(newName);
        existingSpecialisation.setDescription(
                updatedSpecialisation.getDescription());
        existingSpecialisation.setActive(
                updatedSpecialisation.isActive());

        return specialisationRepository.save(existingSpecialisation);
    }

    // 3. Retrieve All Specialisations
    public List<Specialisation> getAllSpecialisations() {

        return specialisationRepository.findAll();
    }

    // 4. Retrieve Specialisation by ID
    public Specialisation getSpecialisationById(Long id) {

        return specialisationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Specialisation not found with ID: " + id));
    }

    // 5. Search Specialisations by Name
    public List<Specialisation> searchSpecialisations(String name) {

        if (name == null || name.isBlank()) {
            throw new RuntimeException("Search name is required");
        }

        return specialisationRepository
                .findByNameContainingIgnoreCase(name.trim());
    }
}
