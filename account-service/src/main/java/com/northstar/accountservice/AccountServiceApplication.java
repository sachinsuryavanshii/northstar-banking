package com.northstar.accountservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;

@SpringBootApplication
public class AccountServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AccountServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner seedAccounts(AccountRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new Account(null, 1L, "NS1000000001", "SAVINGS", new BigDecimal("15450.00")));
                repo.save(new Account(null, 1L, "NS1000000002", "CURRENT", new BigDecimal("3200.75")));
                repo.save(new Account(null, 2L, "NS1000000003", "SAVINGS", new BigDecimal("89000.50")));
            }
        };
    }
}
