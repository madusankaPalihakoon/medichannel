
package lk.medichannel.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lk.medichannel.user.User;
import lk.medichannel.user.UserRepository;

import io.jsonwebtoken.JwtException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwt;
    private final UserRepository users;
    private final String cookieName;

    public JwtAuthenticationFilter(
            JwtService jwt,
            UserRepository users,
            @Value("${app.auth.cookie-name:medichannel_token}")
            String cookieName
    ) {
        this.jwt = jwt;
        this.users = users;
        this.cookieName = cookieName;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain
    ) throws ServletException, IOException {

        String token = Arrays.stream(
                        Optional.ofNullable(req.getCookies())
                                .orElse(new Cookie[0])
                )
                .filter(cookie ->
                        cookieName.equals(cookie.getName())
                )
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        if (token != null && !token.isBlank()) {

            try {
                JwtService.JwtPayload payload = jwt.parse(token);

                Optional<User> optionalUser =
                        users.findById(payload.userId())
                                .filter(User::isActive);

                if (optionalUser.isPresent()) {

                    User user = optionalUser.get();

                    // Check that JWT role matches the database role.
                    if (user.getRole() == payload.role()) {

                        CurrentUser principal =
                                new CurrentUser(
                                        user.getId(),
                                        user.getRole()
                                );

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        principal,
                                        null,
                                        List.of(
                                                new SimpleGrantedAuthority(
                                                        "ROLE_" +
                                                                user.getRole().name()
                                                )
                                        )
                                );

                        SecurityContextHolder.getContext()
                                .setAuthentication(authentication);

                    } else {
                        SecurityContextHolder.clearContext();
                    }

                } else {
                    SecurityContextHolder.clearContext();
                }

            } catch (JwtException | IllegalArgumentException ex) {
                SecurityContextHolder.clearContext();
            }
        }

        chain.doFilter(req, res);
    }
}
