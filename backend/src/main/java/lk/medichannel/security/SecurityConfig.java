
package lk.medichannel.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

 @Bean
 public PasswordEncoder passwordEncoder() {
  return new BCryptPasswordEncoder(12);
 }

 @Bean
 public SecurityFilterChain chain(
         HttpSecurity http,
         JwtAuthenticationFilter jwt
 ) throws Exception {

  return http
          .csrf(csrf -> csrf.disable())
          .cors(cors -> {})
          .sessionManagement(session ->
                  session.sessionCreationPolicy(
                          SessionCreationPolicy.STATELESS
                  )
          )
          .authorizeHttpRequests(auth -> auth
                  .requestMatchers(
                          "/",
                          "/error",
                          "/actuator/health",
                          "/api/auth/register",
                          "/api/auth/login",
                          "/api/auth/logout"
                  ).permitAll()
                  .requestMatchers(
                          HttpMethod.OPTIONS,
                          "/**"
                  ).permitAll()
                  .anyRequest().authenticated()
          )
          .addFilterBefore(
                  jwt,
                  UsernamePasswordAuthenticationFilter.class
          )
          .build();
 }

 @Bean
 public CorsConfigurationSource cors(
         @Value("${app.frontend-url:http://localhost:3000}")
         String frontend
 ) {

  CorsConfiguration config = new CorsConfiguration();

  config.setAllowedOrigins(List.of(frontend));

  config.setAllowedMethods(List.of(
          "GET",
          "POST",
          "PUT",
          "PATCH",
          "DELETE",
          "OPTIONS"
  ));

  config.setAllowedHeaders(List.of(
          "Authorization",
          "Content-Type",
          "X-Requested-With"
  ));

  config.setAllowCredentials(true);

  UrlBasedCorsConfigurationSource source =
          new UrlBasedCorsConfigurationSource();

  source.registerCorsConfiguration("/**", config);

  return source;
 }
}
