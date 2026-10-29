package com.northstar.accountservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class TransactionRequestDTO {
    @NotNull(message = "Transaction amount is required")
    @DecimalMin(value = "0.01", inclusive = true, message = "Transaction amount must be at least 0.01")
    private BigDecimal amount;

    public TransactionRequestDTO() {}

    public TransactionRequestDTO(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
