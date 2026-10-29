package com.northstar.accountservice.dto;

import java.math.BigDecimal;

public class AccountResponseDTO {
    private Long id;
    private Long customerId;
    private String accountNumber;
    private String type;
    private BigDecimal balance;

    public AccountResponseDTO() {}

    public AccountResponseDTO(Long id, Long customerId, String accountNumber, String type, BigDecimal balance) {
        this.id = id;
        this.customerId = customerId;
        this.accountNumber = accountNumber;
        this.type = type;
        this.balance = balance;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}
