
package lk.medichannel.auth;

import jakarta.validation.constraints.*;
import lk.medichannel.user.UserRole;

import java.time.Instant;
import java.time.LocalDate;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record RegisterRequest(

            @NotBlank
            @Size(max = 150)
            String fullName,

            @NotBlank
            @Pattern(
                    regexp = "^(?:[0-9]{9}[vVxX]|[0-9]{12})$",
                    message = "Enter a valid Sri Lankan NIC"
            )
            String nic,

            @NotNull
            @Past
            LocalDate dateOfBirth,

            @NotBlank
            @Pattern(
                    regexp = "^(Male|Female|Other)$",
                    message = "Gender must be Male, Female or Other"
            )
            String gender,

            @NotBlank
            @Pattern(
                    regexp = "^07[0-9]{8}$",
                    message = "Phone must be in 07XXXXXXXX format"
            )
            String phone,

            @NotBlank
            @Email
            @Size(max = 254)
            String email,

            @NotBlank
            @Size(max = 500)
            String address,

            @NotBlank
            @Size(min = 8, max = 72)
            @Pattern(
                    regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$",
                    message = "Password must contain a letter, number and symbol"
            )
            String password

    ) {
    }

    public record LoginRequest(

            @NotBlank
            @Email
            String email,

            @NotBlank
            String password

    ) {
    }

    public record ChangePasswordRequest(

            @NotBlank
            String currentPassword,

            @NotBlank
            @Size(min = 8, max = 72)
            @Pattern(
                    regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$",
                    message = "Password must contain a letter, number and symbol"
            )
            String newPassword

    ) {
    }

    public record UserResponse(
            Long id,
            String email,
            UserRole role,
            boolean active,
            boolean passwordChangeRequired,
            Instant createdAt
    ) {
    }

    public record LoginResponse(
            UserResponse user
    ) {
    }
}
