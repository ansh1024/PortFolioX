package com.portfolioX.PortFolioX.dto;

import com.portfolioX.PortFolioX.entity.Frequency;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SipHoldingRequestDTO {
    private String mutualFundId;
    private BigDecimal units;
    private BigDecimal investedAmount;
    private LocalDate startDate;
    private int sipAmount;
    private Frequency frequency;

    public String getMutualFundId() {
        return mutualFundId;
    }

    public void setMutualFundId(String mutualFundId) {
        this.mutualFundId = mutualFundId;
    }

    public BigDecimal getUnits() {
        return units;
    }

    public void setUnits(BigDecimal units) {
        this.units = units;
    }

    public BigDecimal getInvestedAmount() {
        return investedAmount;
    }

    public void setInvestedAmount(BigDecimal investedAmount) {
        this.investedAmount = investedAmount;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public int getSipAmount() {
        return sipAmount;
    }

    public void setSipAmount(int sipAmount) {
        this.sipAmount = sipAmount;
    }

    public Frequency getFrequency() {
        return frequency;
    }

    public void setFrequency(Frequency frequency) {
        this.frequency = frequency;
    }
}
