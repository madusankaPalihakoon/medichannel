
package lk.medichannel.patient;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "nic_ciphertext", nullable = false, columnDefinition = "TEXT")
    private String nicEncrypted;

    @Column(name = "nic_lookup_hash", nullable = false, unique = true, length = 64)
    private String nicLookupHash;

    @Column(name = "date_of_birth_ciphertext", nullable = false, columnDefinition = "TEXT")
    private String dateOfBirthEncrypted;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "phone_ciphertext", nullable = false, columnDefinition = "TEXT")
    private String phoneEncrypted;

    @Column(name = "address_ciphertext", nullable = false, columnDefinition = "TEXT")
    private String addressEncrypted;

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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long value) {
        this.userId = value;
    }

    public String getNicEncrypted() {
        return nicEncrypted;
    }

    public void setNicEncrypted(String value) {
        this.nicEncrypted = value;
    }

    public String getNicLookupHash() {
        return nicLookupHash;
    }

    public void setNicLookupHash(String value) {
        this.nicLookupHash = value;
    }

    public String getDateOfBirthEncrypted() {
        return dateOfBirthEncrypted;
    }

    public void setDateOfBirthEncrypted(String value) {
        this.dateOfBirthEncrypted = value;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String value) {
        this.gender = value;
    }

    public String getPhoneEncrypted() {
        return phoneEncrypted;
    }

    public void setPhoneEncrypted(String value) {
        this.phoneEncrypted = value;
    }

    public String getAddressEncrypted() {
        return addressEncrypted;
    }

    public void setAddressEncrypted(String value) {
        this.addressEncrypted = value;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
