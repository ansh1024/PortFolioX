package com.portfolioX.PortFolioX.dto;

import com.portfolioX.PortFolioX.entity.Frequency;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SipHoldingResponseDTO {
    private String holdingId;
    private String mutualFundId;
    private String mutualFundName;
    private BigDecimal units;
    private BigDecimal investedAmount;
    private BigDecimal currentValue;
    private LocalDate startDate;
    private int sipAmount;
    private Frequency frequency;
    private BigDecimal xirr;

    public String getHoldingId() {
        return holdingId;
    }

    public void setHoldingId(String holdingId) {
        this.holdingId = holdingId;
    }

    public String getMutualFundId() {
        return mutualFundId;
    }

    public void setMutualFundId(String mutualFundId) {
        this.mutualFundId = mutualFundId;
    }

    public String getMutualFundName() {
        return mutualFundName;
    }

    public void setMutualFundName(String mutualFundName) {
        this.mutualFundName = mutualFundName;
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

    public BigDecimal getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(BigDecimal currentValue) {
        this.currentValue = currentValue;
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

    public BigDecimal getXirr() {
        return xirr;
    }

    public void setXirr(BigDecimal xirr) {
        this.xirr = xirr;
    }
}
