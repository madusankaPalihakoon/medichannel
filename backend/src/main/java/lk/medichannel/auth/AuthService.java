
package lk.medichannel.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lk.medichannel.audit.AuditService;
import lk.medichannel.crypto.CryptoService;
import lk.medichannel.patient.Patient;
import lk.medichannel.patient.PatientRepository;
import lk.medichannel.security.CurrentUser;
import lk.medichannel.security.JwtService;
import lk.medichannel.user.User;
import lk.medichannel.user.UserRepository;
import lk.medichannel.user.UserRole;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Locale;

@Service
@Transactional
public class AuthService {

 private final UserRepository users;
 private final PatientRepository patients;
 private final CryptoService crypto;
 private final PasswordEncoder passwords;
 private final JwtService jwt;
 private final AuditService audit;

 private final String cookieName;
 private final boolean secure;
 private final int lockThreshold;
 private final int lockMinutes;

 public AuthService(
         UserRepository users,
         PatientRepository patients,
         CryptoService crypto,
         PasswordEncoder passwords,
         JwtService jwt,
         AuditService audit,
         @Value("${app.auth.cookie-name:medichannel_token}")
         String cookieName,
         @Value("${app.auth.secure-cookie:false}")
         boolean secure,
         @Value("${app.auth.lockout-threshold:5}")
         int lockThreshold,
         @Value("${app.auth.lockout-minutes:15}")
         int lockMinutes
 ) {
  this.users = users;
  this.patients = patients;
  this.crypto = crypto;
  this.passwords = passwords;
  this.jwt = jwt;
  this.audit = audit;
  this.cookieName = cookieName;
  this.secure = secure;
  this.lockThreshold = lockThreshold;
  this.lockMinutes = lockMinutes;
 }

 // ==========================================
 // PATIENT REGISTRATION
 // ==========================================

 public AuthDtos.LoginResponse register(
         AuthDtos.RegisterRequest request,
         HttpServletRequest http,
         HttpServletResponse response
 ) {

  String email = request.email()
          .trim()
          .toLowerCase(Locale.ROOT);

  String nic = request.nic()
          .trim()
          .toUpperCase(Locale.ROOT);

  String emailHash = crypto.hmac(email);
  String nicHash = crypto.hmac(nic);

  if (users.findByEmailLookupHash(emailHash).isPresent()) {
   throw new IllegalArgumentException(
           "An account already exists for that email"
   );
  }

  if (patients.existsByNicLookupHash(nicHash)) {
   throw new IllegalArgumentException(
           "An account already exists for that NIC"
   );
  }

  // Create user account.
  User user = new User();

  user.setFullNameEncrypted(
          crypto.encrypt(request.fullName().trim())
  );

  user.setEmailCiphertext(
          crypto.encrypt(email)
  );

  user.setEmailLookupHash(emailHash);

  user.setPasswordHash(
          passwords.encode(request.password())
  );

  // Public registration always creates CUSTOMER.
  user.setRole(UserRole.CUSTOMER);
  user.setActive(true);
  user.setFailedLoginAttempts(0);
  user.setPasswordChangeRequired(false);

  users.saveAndFlush(user);

  // Create patient profile.
  Patient patient = new Patient();

  patient.setUserId(user.getId());

  patient.setNicEncrypted(
          crypto.encrypt(nic)
  );

  patient.setNicLookupHash(nicHash);

  patient.setDateOfBirthEncrypted(
          crypto.encrypt(request.dateOfBirth().toString())
  );

  // Convert Male/Female/Other into MALE/FEMALE/OTHER.
  // These are the values accepted by PostgreSQL.
  patient.setGender(
          request.gender().trim().toUpperCase(Locale.ROOT)
  );

  patient.setPhoneEncrypted(
          crypto.encrypt(request.phone().trim())
  );

  patient.setAddressEncrypted(
          crypto.encrypt(request.address().trim())
  );

  patients.saveAndFlush(patient);

  // Record registration in audit log.
  audit.log(
          user.getId(),
          "ACCOUNT_REGISTERED",
          "USER",
          user.getId(),
          http
  );

  // Automatically log in after registration.
  setCookie(response, user);

  return new AuthDtos.LoginResponse(
          toResponse(user)
  );
 }

 // ==========================================
 // USER LOGIN
 // ==========================================

 @Transactional(
         noRollbackFor = AuthenticationFailureException.class
 )
 public AuthDtos.LoginResponse login(
         AuthDtos.LoginRequest request,
         HttpServletRequest http,
         HttpServletResponse response
 ) {

  String email = request.email()
          .trim()
          .toLowerCase(Locale.ROOT);

  User user = users.findByEmailLookupHash(
          crypto.hmac(email)
  ).orElse(null);

  if (user == null) {
   throw new AuthenticationFailureException();
  }

  if (!user.isActive()) {
   throw new AuthenticationFailureException();
  }

  if (user.getLockedUntil() != null
          && user.getLockedUntil().isAfter(Instant.now())) {
   throw new AuthenticationFailureException();
  }

  if (!passwords.matches(
          request.password(),
          user.getPasswordHash()
  )) {
   fail(user, http);
   throw new AuthenticationFailureException();
  }

  // Reset failed attempts after successful login.
  user.setFailedLoginAttempts(0);
  user.setLockedUntil(null);

  audit.log(
          user.getId(),
          "LOGIN_SUCCEEDED",
          "USER",
          user.getId(),
          http
  );

  setCookie(response, user);

  return new AuthDtos.LoginResponse(
          toResponse(user)
  );
 }

 // ==========================================
 // FAILED LOGIN / ACCOUNT LOCKOUT
 // ==========================================

 private void fail(
         User user,
         HttpServletRequest http
 ) {

  int failures = user.getFailedLoginAttempts() + 1;

  if (failures >= lockThreshold) {

   user.setFailedLoginAttempts(0);

   user.setLockedUntil(
           Instant.now().plus(
                   Duration.ofMinutes(lockMinutes)
           )
   );

   audit.log(
           user.getId(),
           "LOGIN_LOCKED",
           "USER",
           user.getId(),
           http
   );

  } else {

   user.setFailedLoginAttempts(failures);

   audit.log(
           user.getId(),
           "LOGIN_FAILED",
           "USER",
           user.getId(),
           http
   );
  }
 }

 // ==========================================
 // USER LOGOUT
 // ==========================================

 public void logout(HttpServletResponse response) {

  response.addHeader(
          "Set-Cookie",
          cookie("")
                  .maxAge(0)
                  .build()
                  .toString()
  );

  SecurityContextHolder.clearContext();
 }

 // ==========================================
 // CHANGE PASSWORD
 // ==========================================

 public void changePassword(
         CurrentUser actor,
         AuthDtos.ChangePasswordRequest request,
         HttpServletRequest http
 ) {

  User user = users.findById(actor.id())
          .orElseThrow(() ->
                  new IllegalArgumentException("Account not found")
          );

  if (!passwords.matches(
          request.currentPassword(),
          user.getPasswordHash()
  )) {
   throw new IllegalArgumentException(
           "Current password is incorrect"
   );
  }

  user.setPasswordHash(
          passwords.encode(request.newPassword())
  );

  user.setPasswordChangeRequired(false);

  audit.log(
          user.getId(),
          "PASSWORD_CHANGED",
          "USER",
          user.getId(),
          http
  );
 }

 // ==========================================
 // CURRENT USER
 // ==========================================

 public AuthDtos.UserResponse me(CurrentUser user) {

  return users.findById(user.id())
          .map(this::toResponse)
          .orElseThrow(() ->
                  new IllegalArgumentException("Account not found")
          );
 }

 // ==========================================
 // USER RESPONSE
 // ==========================================

 public AuthDtos.UserResponse toResponse(User user) {

  return new AuthDtos.UserResponse(
          user.getId(),
          crypto.decrypt(user.getEmailCiphertext()),
          user.getRole(),
          user.isActive(),
          user.isPasswordChangeRequired(),
          user.getCreatedAt()
  );
 }

 // ==========================================
 // JWT COOKIE
 // ==========================================

 private void setCookie(
         HttpServletResponse response,
         User user
 ) {

  response.addHeader(
          "Set-Cookie",
          cookie(jwt.create(user))
                  .maxAge(jwt.maxAge())
                  .build()
                  .toString()
  );
 }

 private ResponseCookie.ResponseCookieBuilder cookie(
         String value
 ) {

  return ResponseCookie.from(cookieName, value)
          .httpOnly(true)
          .secure(secure)
          .sameSite("Lax")
          .path("/");
 }
}
