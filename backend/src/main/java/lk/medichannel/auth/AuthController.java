package lk.medichannel.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import lk.medichannel.security.CurrentUser;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

 private final AuthService service;

 public AuthController(AuthService service) {
  this.service = service;
 }

 @PostMapping("/register")
 @ResponseStatus(HttpStatus.CREATED)
 public AuthDtos.LoginResponse register(
         @Valid @RequestBody AuthDtos.RegisterRequest request,
         HttpServletRequest http,
         HttpServletResponse response
 ) {
  return service.register(request, http, response);
 }

 @PostMapping("/login")
 public AuthDtos.LoginResponse login(
         @Valid @RequestBody AuthDtos.LoginRequest request,
         HttpServletRequest http,
         HttpServletResponse response
 ) {
  return service.login(request, http, response);
 }

 @PostMapping("/logout")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void logout(HttpServletResponse response) {
  service.logout(response);
 }

 @GetMapping("/me")
 public AuthDtos.UserResponse me(
         @AuthenticationPrincipal CurrentUser user
 ) {
  return service.me(user);
 }

 @PostMapping("/change-password")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void change(
         @AuthenticationPrincipal CurrentUser user,
         @Valid @RequestBody AuthDtos.ChangePasswordRequest request,
         HttpServletRequest http
 ) {
  service.changePassword(user, request, http);
 }
}