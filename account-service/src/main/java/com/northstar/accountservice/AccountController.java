package com.northstar.accountservice;

import com.northstar.accountservice.dto.AccountRequestDTO;
import com.northstar.accountservice.dto.AccountResponseDTO;
import com.northstar.accountservice.dto.ErrorResponse;
import com.northstar.accountservice.dto.TransactionRequestDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api/accounts")
@Tag(name = "Accounts", description = "Bank Account Management and Transaction Operations")
public class AccountController {
    private final AccountRepository repo;

    public AccountController(AccountRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    @Operation(summary = "Get paginated list of accounts, optionally filtered by customer ID")
    public Page<AccountResponseDTO> all(
            @RequestParam(required = false) Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);

        Page<Account> accountPage;
        if (customerId != null) {
            accountPage = repo.findByCustomerId(customerId, pageable);
        } else {
            accountPage = repo.findAll(pageable);
        }

        return accountPage.map(this::toDTO);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get account details by ID")
    public ResponseEntity<AccountResponseDTO> one(@PathVariable Long id) {
        return repo.findById(id)
                .map(this::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new bank account")
    public AccountResponseDTO create(@Valid @RequestBody AccountRequestDTO dto) {
        Account a = new Account();
        a.setCustomerId(dto.getCustomerId());
        a.setType((dto.getType() == null || dto.getType().isBlank()) ? "SAVINGS" : dto.getType().toUpperCase().trim());
        a.setBalance(dto.getBalance() != null ? dto.getBalance() : BigDecimal.ZERO);

        if (dto.getAccountNumber() == null || dto.getAccountNumber().isBlank()) {
            a.setAccountNumber("NS" + String.format("%010d", ThreadLocalRandom.current().nextLong(10_000_000_000L)));
        } else {
            a.setAccountNumber(dto.getAccountNumber().trim());
        }

        Account saved = repo.save(a);
        return toDTO(saved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update account details")
    public ResponseEntity<AccountResponseDTO> update(@PathVariable Long id, @Valid @RequestBody AccountRequestDTO dto) {
        return repo.findById(id).map(existing -> {
            if (dto.getCustomerId() != null) existing.setCustomerId(dto.getCustomerId());
            if (dto.getType() != null && !dto.getType().isBlank()) existing.setType(dto.getType().toUpperCase().trim());
            if (dto.getBalance() != null) existing.setBalance(dto.getBalance());
            if (dto.getAccountNumber() != null && !dto.getAccountNumber().isBlank()) {
                existing.setAccountNumber(dto.getAccountNumber().trim());
            }
            return ResponseEntity.ok(toDTO(repo.save(existing)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/deposit")
    @Operation(summary = "Deposit funds into an account")
    public ResponseEntity<?> deposit(@PathVariable Long id, @Valid @RequestBody TransactionRequestDTO body) {
        if (body.getAmount() == null || body.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body(new ErrorResponse(400, "Bad Request", "Deposit amount must be greater than zero"));
        }

        return repo.findById(id).<ResponseEntity<?>>map(a -> {
            a.setBalance(a.getBalance().add(body.getAmount()));
            Account saved = repo.save(a);
            return ResponseEntity.ok(toDTO(saved));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(404, "Not Found", "Account not found with ID: " + id)));
    }

    @PostMapping("/{id}/withdraw")
    @Operation(summary = "Withdraw funds from an account")
    public ResponseEntity<?> withdraw(@PathVariable Long id, @Valid @RequestBody TransactionRequestDTO body) {
        if (body.getAmount() == null || body.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body(new ErrorResponse(400, "Bad Request", "Withdrawal amount must be greater than zero"));
        }

        return repo.findById(id).<ResponseEntity<?>>map(a -> {
            if (a.getBalance().compareTo(body.getAmount()) < 0) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse(400, "Insufficient Funds", "Account balance of $" + a.getBalance() + " is insufficient for withdrawal of $" + body.getAmount()));
            }
            a.setBalance(a.getBalance().subtract(body.getAmount()));
            Account saved = repo.save(a);
            return ResponseEntity.ok(toDTO(saved));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(404, "Not Found", "Account not found with ID: " + id)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Close and delete an account by ID")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private AccountResponseDTO toDTO(Account a) {
        return new AccountResponseDTO(a.getId(), a.getCustomerId(), a.getAccountNumber(), a.getType(), a.getBalance());
    }
}
