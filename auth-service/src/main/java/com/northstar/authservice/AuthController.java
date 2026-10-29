package com.northstar.authservice;

import com.northstar.authservice.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for User Registration, Login, and Current Profile")
public class AuthController {
    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AuthController(UserRepository repo, PasswordEncoder encoder, JwtUtil jwt) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (repo.findByUsername(req.getUsername().trim()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(HttpStatus.CONFLICT.value(), "Conflict", "Username already exists"));
        }

        String role = (req.getRole() != null && !req.getRole().isBlank())
                ? req.getRole().toUpperCase().trim()
                : "USER";
        if (!role.equals("USER") && !role.equals("ADMIN")) {
            role = "USER";
        }

        User saved = repo.save(new User(null, req.getUsername().trim(), encoder.encode(req.getPassword()), role));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "User registered successfully",
                "id", saved.getId(),
                "username", saved.getUsername(),
                "role", saved.getRole()
        ));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT token")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return repo.findByUsername(req.getUsername().trim())
                .filter(u -> encoder.matches(req.getPassword(), u.getPassword()))
                .<ResponseEntity<?>>map(u -> {
                    String token = jwt.generate(u.getUsername(), u.getRole());
                    return ResponseEntity.ok(new AuthResponse(token, u.getUsername(), u.getRole(), u.getId()));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Unauthorized", "Invalid username or password")));
    }

    @GetMapping("/me")
    @Operation(summary = "Get currently authenticated user details")
    public ResponseEntity<?> me(
            @RequestHeader(value = "X-User", required = false) String xUser,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String username = xUser;
        if ((username == null || username.isBlank()) && authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                username = jwt.extractUsername(authHeader.substring(7).trim());
            } catch (Exception ignored) {}
        }

        if (username == null || username.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Unauthorized", "Authentication required"));
        }

        return repo.findByUsername(username)
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(new UserProfileResponse(u.getId(), u.getUsername(), u.getRole())))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse(HttpStatus.NOT_FOUND.value(), "Not Found", "User profile not found")));
    }
}
