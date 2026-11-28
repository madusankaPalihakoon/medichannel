
package lk.medichannel.doctor.service;

import lk.medichannel.doctor.entity.Doctor;
import lk.medichannel.doctor.repository.DoctorRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // Get all doctors
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // Get doctor by ID
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Doctor not found with ID: " + id));
    }

    // Create doctor
    public Doctor createDoctor(Doctor doctor) {

        if (doctorRepository.existsByUserId(doctor.getUserId())) {
            throw new IllegalArgumentException(
                    "This user is already registered as a doctor");
        }

        if (doctorRepository.existsBySlmcNumber(doctor.getSlmcNumber())) {
            throw new IllegalArgumentException(
                    "SLMC number already exists");
        }

        doctor.setActive(true);

        return doctorRepository.save(doctor);
    }

    // Update doctor
    @Transactional
    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {

        Doctor existingDoctor = getDoctorById(id);

        if (!Objects.equals(existingDoctor.getUserId(),
                updatedDoctor.getUserId())
                && doctorRepository.existsByUserId(updatedDoctor.getUserId())) {
            throw new IllegalArgumentException(
                    "This user is already registered as a doctor");
        }

        if (!Objects.equals(existingDoctor.getSlmcNumber(),
                updatedDoctor.getSlmcNumber())
                && doctorRepository.existsBySlmcNumber(
                updatedDoctor.getSlmcNumber())) {
            throw new IllegalArgumentException(
                    "SLMC number already exists");
        }

        existingDoctor.setUserId(updatedDoctor.getUserId());
        existingDoctor.setSpecialisationId(
                updatedDoctor.getSpecialisationId());
        existingDoctor.setSlmcNumber(updatedDoctor.getSlmcNumber());
        existingDoctor.setQualifications(
                updatedDoctor.getQualifications());
        existingDoctor.setExperienceYears(
                updatedDoctor.getExperienceYears());
        existingDoctor.setConsultationFee(
                updatedDoctor.getConsultationFee());
        existingDoctor.setBio(updatedDoctor.getBio());

        return doctorRepository.save(existingDoctor);
    }

    // Get doctors by specialisation
    public List<Doctor> getDoctorsBySpecialisation(Long specialisationId) {
        return doctorRepository.findBySpecialisationId(specialisationId);
    }

    // Get active doctors
    public List<Doctor> getActiveDoctors() {
        return doctorRepository.findByActiveTrue();
    }

    // Deactivate doctor
    @Transactional
    public Doctor deactivateDoctor(Long id) {

        Doctor doctor = getDoctorById(id);
        doctor.setActive(false);

        return doctorRepository.save(doctor);
    }

    // Search doctors by SLMC number or qualifications
    public List<Doctor> searchDoctors(String keyword) {

        if (keyword == null || keyword.isBlank()) {
            throw new IllegalArgumentException(
                    "Search keyword cannot be empty");
        }

        String searchKeyword = keyword.trim();

        List<Doctor> doctors =
                doctorRepository.findBySlmcNumberContainingIgnoreCase(
                        searchKeyword);

        doctors.addAll(
                doctorRepository.findByQualificationsContainingIgnoreCase(
                        searchKeyword));

        return doctors.stream().distinct().toList();
    }

    // Get consultation fee
    public BigDecimal getDoctorFee(Long id) {
        return getDoctorById(id).getConsultationFee();
    }

    // Update consultation fee
    @Transactional
    public Doctor updateDoctorFee(Long id, BigDecimal fee) {

        if (fee == null || fee.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "Consultation fee cannot be negative or empty");
        }

        Doctor doctor = getDoctorById(id);
        doctor.setConsultationFee(fee);

        return doctorRepository.save(doctor);
    }

    // Get qualifications
    public String getDoctorQualifications(Long id) {
        return getDoctorById(id).getQualifications();
    }

    // Update qualifications
    @Transactional
    public Doctor updateDoctorQualifications(
            Long id, String qualifications) {

        if (qualifications == null || qualifications.isBlank()) {
            throw new IllegalArgumentException(
                    "Qualifications cannot be empty");
        }

        Doctor doctor = getDoctorById(id);
        doctor.setQualifications(qualifications.trim());

        return doctorRepository.save(doctor);
    }

    // Delete doctor
    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        doctorRepository.delete(doctor);
    }
}
