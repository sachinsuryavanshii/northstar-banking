package com.northstar.customerservice;

import com.northstar.customerservice.dto.CustomerRequestDTO;
import com.northstar.customerservice.dto.CustomerResponseDTO;
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

@RestController
@RequestMapping("/api/customers")
@Tag(name = "Customers", description = "Customer Management and Profile Operations")
public class CustomerController {
    private final CustomerRepository repo;

    public CustomerController(CustomerRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    @Operation(summary = "Get paginated list of customers, with optional search query")
    public Page<CustomerResponseDTO> all(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String search) {

        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);

        Page<Customer> customerPage;
        if (search != null && !search.trim().isEmpty()) {
            customerPage = repo.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search.trim(), search.trim(), pageable);
        } else {
            customerPage = repo.findAll(pageable);
        }

        return customerPage.map(this::toDTO);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer details by ID")
    public ResponseEntity<CustomerResponseDTO> one(@PathVariable Long id) {
        return repo.findById(id)
                .map(this::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new customer profile")
    public CustomerResponseDTO create(@Valid @RequestBody CustomerRequestDTO dto) {
        Customer c = new Customer(null, dto.getName().trim(), dto.getEmail().trim(), dto.getPhone(), dto.getAddress());
        Customer saved = repo.save(c);
        return toDTO(saved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing customer profile")
    public ResponseEntity<CustomerResponseDTO> update(@PathVariable Long id, @Valid @RequestBody CustomerRequestDTO dto) {
        return repo.findById(id).map(existing -> {
            existing.setName(dto.getName().trim());
            existing.setEmail(dto.getEmail().trim());
            existing.setPhone(dto.getPhone());
            existing.setAddress(dto.getAddress());
            return ResponseEntity.ok(toDTO(repo.save(existing)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete customer profile by ID")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private CustomerResponseDTO toDTO(Customer c) {
        return new CustomerResponseDTO(c.getId(), c.getName(), c.getEmail(), c.getPhone(), c.getAddress());
    }
}
