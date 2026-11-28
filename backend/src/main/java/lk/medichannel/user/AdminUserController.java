package lk.medichannel.user;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import lk.medichannel.audit.AuditLogRepository;
import lk.medichannel.audit.AuditService;
import lk.medichannel.auth.AuthDtos;
import lk.medichannel.auth.AuthService;
import lk.medichannel.crypto.CryptoService;
import lk.medichannel.security.CurrentUser;
import lk.medichannel.audit.AuditLog;

import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

 private final UserRepository users;
 private final CryptoService crypto;
 private final PasswordEncoder passwords;
 private final AuditService audit;
 private final AuthService auth;
 private final AuditLogRepository auditLogs;

 public AdminUserController(
         UserRepository users,
         CryptoService crypto,
         PasswordEncoder passwords,
         AuditService audit,
         AuthService auth,
         AuditLogRepository auditLogs
 ) {
  this.users = users;
  this.crypto = crypto;
  this.passwords = passwords;
  this.audit = audit;
  this.auth = auth;
  this.auditLogs = auditLogs;
 }

 public record CreateStaffRequest(

         @NotBlank
         @Size(max = 150)
         String fullName,

         @NotBlank
         @Email
         String email,

         @NotBlank
         @Size(min = 8, max = 72)
         @Pattern(
                 regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$"
         )
         String temporaryPassword,

         @NotNull
         UserRole role

 ) {
 }

 public record ResetPasswordRequest(

         @NotBlank
         @Size(min = 8, max = 72)
         @Pattern(
                 regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$"
         )
         String temporaryPassword

 ) {
 }

 @PostMapping("/users")
 @Transactional
 @ResponseStatus(HttpStatus.CREATED)
 public AuthDtos.UserResponse create(
         @AuthenticationPrincipal CurrentUser actor,
         @Valid @RequestBody CreateStaffRequest request,
         HttpServletRequest http
 ) {

  if (request.role() != UserRole.DOCTOR
          && request.role() != UserRole.MANAGER) {

   throw new IllegalArgumentException(
           "Only DOCTOR or MANAGER accounts can be created"
   );
  }

  String email = request.email()
          .trim()
          .toLowerCase();

  String emailHash = crypto.hmac(email);

  if (users.findByEmailLookupHash(emailHash).isPresent()) {
   throw new IllegalArgumentException(
           "An account already exists for that email"
   );
  }

  User user = new User();

  user.setFullNameEncrypted(
          crypto.encrypt(request.fullName().trim())
  );

  user.setEmailCiphertext(
          crypto.encrypt(email)
  );

  user.setEmailLookupHash(emailHash);

  user.setPasswordHash(
          passwords.encode(request.temporaryPassword())
  );

  user.setRole(request.role());
  user.setActive(true);
  user.setPasswordChangeRequired(true);
  user.setFailedLoginAttempts(0);

  users.saveAndFlush(user);

  audit.log(
          actor.id(),
          "STAFF_ACCOUNT_CREATED",
          "USER",
          user.getId(),
          http
  );

  return auth.toResponse(user);
 }

 @GetMapping("/users")
 public Page<AuthDtos.UserResponse> list(
         @RequestParam(defaultValue = "0")
         @Min(0) int page,

         @RequestParam(defaultValue = "25")
         @Min(1) @Max(100) int size,

         @RequestParam(required = false)
         UserRole role
 ) {

  Pageable pageable = PageRequest.of(
          page,
          size,
          Sort.by("createdAt").descending()
  );

  Page<User> result = role == null
          ? users.findAll(pageable)
          : users.findAllByRole(role, pageable);

  return result.map(auth::toResponse);
 }

 @PatchMapping("/users/{id}/active")
 @Transactional
 public AuthDtos.UserResponse active(
         @AuthenticationPrincipal CurrentUser actor,
         @PathVariable Long id,
         @RequestParam boolean value,
         HttpServletRequest http
 ) {

  if (actor.id().equals(id) && !value) {
   throw new IllegalArgumentException(
           "You cannot deactivate your own account"
   );
  }

  User user = users.findById(id)
          .orElseThrow(() ->
                  new IllegalArgumentException("Account not found")
          );

  user.setActive(value);

  audit.log(
          actor.id(),
          value ? "ACCOUNT_ACTIVATED" : "ACCOUNT_DEACTIVATED",
          "USER",
          id,
          http
  );

  return auth.toResponse(user);
 }

 @PostMapping("/users/{id}/reset-password")
 @Transactional
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void resetPassword(
         @AuthenticationPrincipal CurrentUser actor,
         @PathVariable Long id,
         @Valid @RequestBody ResetPasswordRequest request,
         HttpServletRequest http
 ) {

  User user = users.findById(id)
          .orElseThrow(() ->
                  new IllegalArgumentException("Account not found")
          );

  if (user.getRole() == UserRole.ADMIN) {
   throw new IllegalArgumentException(
           "Staff password reset endpoint cannot reset ADMIN accounts"
   );
  }

  user.setPasswordHash(
          passwords.encode(request.temporaryPassword())
  );

  user.setPasswordChangeRequired(true);
  user.setFailedLoginAttempts(0);
  user.setLockedUntil(null);

  audit.log(
          actor.id(),
          "PASSWORD_RESET",
          "USER",
          id,
          http
  );
 }

 @GetMapping("/audit-logs")
 public Page<AuditLog> audit(
         @RequestParam(defaultValue = "0")
         @Min(0) int page,

         @RequestParam(defaultValue = "50")
         @Min(1) @Max(100) int size
 ) {

  return auditLogs.findAll(
          PageRequest.of(
                  page,
                  size,
                  Sort.by("createdAt").descending()
          )
  );
 }
}