package com.northstar.customerservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CustomerServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CustomerServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner seedCustomers(CustomerRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new Customer(null, "Alice Johnson", "alice.johnson@northstar.bank", "+1-555-0101", "123 Wall Street, New York, NY"));
                repo.save(new Customer(null, "Asha Sharma", "asha.sharma@northstar.bank", "+91-9876543210", "45 Nariman Point, Mumbai, India"));
                repo.save(new Customer(null, "Carlos Rodriguez", "carlos.r@northstar.bank", "+34-600-112233", "Gran Via 28, Madrid, Spain"));
            }
        };
    }
}
