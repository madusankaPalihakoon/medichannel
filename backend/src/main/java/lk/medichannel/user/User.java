
package lk.medichannel.user;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name_ciphertext",
            nullable = false,
            columnDefinition = "TEXT")
    private String fullNameEncrypted;

    @Column(name = "email_ciphertext",
            nullable = false,
            columnDefinition = "TEXT")
    private String emailCiphertext;

    @Column(name = "email_lookup_hash",
            nullable = false,
            unique = true,
            length = 64)
    private String emailLookupHash;

    @Column(name = "password_hash",
            nullable = false,
            length = 100)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Column(name = "failed_login_attempts", nullable = false)
    private int failedLoginAttempts = 0;

    @Column(name = "locked_until")
    private Instant lockedUntil;

    @Column(name = "password_change_required", nullable = false)
    private boolean passwordChangeRequired = false;

    @Column(name = "created_at",
            nullable = false,
            updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getFullNameEncrypted() {
        return fullNameEncrypted;
    }

    public void setFullNameEncrypted(String value) {
        this.fullNameEncrypted = value;
    }

    public String getEmailCiphertext() {
        return emailCiphertext;
    }

    public void setEmailCiphertext(String value) {
        this.emailCiphertext = value;
    }

    public String getEmailLookupHash() {
        return emailLookupHash;
    }

    public void setEmailLookupHash(String value) {
        this.emailLookupHash = value;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String value) {
        this.passwordHash = value;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole value) {
        this.role = value;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean value) {
        this.active = value;
    }

    public int getFailedLoginAttempts() {
        return failedLoginAttempts;
    }

    public void setFailedLoginAttempts(int value) {
        this.failedLoginAttempts = value;
    }

    public Instant getLockedUntil() {
        return lockedUntil;
    }

    public void setLockedUntil(Instant value) {
        this.lockedUntil = value;
    }

    public boolean isPasswordChangeRequired() {
        return passwordChangeRequired;
    }

    public void setPasswordChangeRequired(boolean value) {
        this.passwordChangeRequired = value;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
