
package lk.medichannel.doctor.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @NotNull(message = "Specialisation ID is required")
    @Positive(message = "Specialisation ID must be positive")
    @Column(name = "specialisation_id", nullable = false)
    private Long specialisationId;

    @NotBlank(message = "SLMC number is required")
    @Size(max = 30)
    @Column(name = "slmc_number", nullable = false, unique = true, length = 30)
    private String slmcNumber;

    @NotBlank(message = "Qualifications are required")
    @Column(name = "qualifications", nullable = false, columnDefinition = "TEXT")
    private String qualifications;

    @NotNull(message = "Experience years is required")
    @Min(value = 0, message = "Experience cannot be negative")
    @Column(name = "experience_years", nullable = false)
    private Integer experienceYears = 0;

    @NotNull(message = "Consultation fee is required")
    @DecimalMin(value = "0.00", message = "Fee cannot be negative")
    @Column(name = "consultation_fee", nullable = false, precision = 12, scale = 2)
    private BigDecimal consultationFee;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false,
            insertable = false, updatable = false)
    private Instant createdAt;

    public Doctor() {
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getSpecialisationId() {
        return specialisationId;
    }

    public void setSpecialisationId(Long specialisationId) {
        this.specialisationId = specialisationId;
    }

    public String getSlmcNumber() {
        return slmcNumber;
    }

    public void setSlmcNumber(String slmcNumber) {
        this.slmcNumber = slmcNumber;
    }

    public String getQualifications() {
        return qualifications;
    }

    public void setQualifications(String qualifications) {
        this.qualifications = qualifications;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public BigDecimal getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}

