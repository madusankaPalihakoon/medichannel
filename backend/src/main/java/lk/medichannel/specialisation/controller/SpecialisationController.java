
package lk.medichannel.specialisation.controller;

import lk.medichannel.specialisation.entity.Specialisation;
import lk.medichannel.specialisation.service.SpecialisationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specialisations")
@CrossOrigin(origins = "*")
public class SpecialisationController {

    private final SpecialisationService specialisationService;

    // Constructor Injection
    public SpecialisationController(
            SpecialisationService specialisationService) {
        this.specialisationService = specialisationService;
    }

    // 1. Create Specialisation
    @PostMapping
    public ResponseEntity<Specialisation> createSpecialisation(
            @RequestBody Specialisation specialisation) {

        Specialisation createdSpecialisation =
                specialisationService.createSpecialisation(specialisation);

        return new ResponseEntity<>(
                createdSpecialisation,
                HttpStatus.CREATED
        );
    }

    // 2. Update Specialisation
    @PutMapping("/{id}")
    public ResponseEntity<Specialisation> updateSpecialisation(
            @PathVariable Long id,
            @RequestBody Specialisation specialisation) {

        Specialisation updatedSpecialisation =
                specialisationService.updateSpecialisation(id, specialisation);

        return ResponseEntity.ok(updatedSpecialisation);
    }

    // 3. Retrieve All Specialisations
    @GetMapping
    public ResponseEntity<List<Specialisation>> getAllSpecialisations() {

        List<Specialisation> specialisations =
                specialisationService.getAllSpecialisations();

        return ResponseEntity.ok(specialisations);
    }

    // 4. Retrieve Specialisation by ID
    @GetMapping("/{id}")
    public ResponseEntity<Specialisation> getSpecialisationById(
            @PathVariable Long id) {

        Specialisation specialisation =
                specialisationService.getSpecialisationById(id);

        return ResponseEntity.ok(specialisation);
    }

    // 5. Search Specialisations by Name
    @GetMapping("/search")
    public ResponseEntity<List<Specialisation>> searchSpecialisations(
            @RequestParam String name) {

        List<Specialisation> specialisations =
                specialisationService.searchSpecialisations(name);

        return ResponseEntity.ok(specialisations);
    }
}
