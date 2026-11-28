package lk.medichannel.config;

import lk.medichannel.crypto.CryptoService;
import lk.medichannel.user.User;
import lk.medichannel.user.UserRepository;
import lk.medichannel.user.UserRole;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class InitialAdminBootstrap implements ApplicationRunner {

 private final UserRepository users;
 private final CryptoService crypto;
 private final PasswordEncoder passwords;

 private final String email;
 private final String password;
 private final String name;

 public InitialAdminBootstrap(
         UserRepository users,
         CryptoService crypto,
         PasswordEncoder passwords,
         @Value("${app.initial-admin.email:}") String email,
         @Value("${app.initial-admin.password:}") String password,
         @Value("${app.initial-admin.name:System Administrator}") String name
 ) {
  this.users = users;
  this.crypto = crypto;
  this.passwords = passwords;
  this.email = email;
  this.password = password;
  this.name = name;
 }

 @Override
 public void run(ApplicationArguments args) {

  if (email == null || email.isBlank()
          || password == null || password.isBlank()) {
   return;
  }

  String normalizedEmail = email.trim().toLowerCase();
  String emailHash = crypto.hmac(normalizedEmail);

  if (users.findByEmailLookupHash(emailHash).isPresent()) {
   return;
  }

  User admin = new User();

  admin.setFullNameEncrypted(
          crypto.encrypt(name.trim())
  );

  admin.setEmailCiphertext(
          crypto.encrypt(normalizedEmail)
  );

  admin.setEmailLookupHash(emailHash);

  admin.setPasswordHash(
          passwords.encode(password)
  );

  admin.setRole(UserRole.ADMIN);
  admin.setActive(true);
  admin.setPasswordChangeRequired(true);
  admin.setFailedLoginAttempts(0);

  users.save(admin);
 }
}