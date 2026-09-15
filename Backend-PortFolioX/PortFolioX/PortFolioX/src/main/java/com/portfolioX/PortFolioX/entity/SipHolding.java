package com.portfolioX.PortFolioX.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name="sip_holding",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "fund_id"})
        }
)
public class SipHolding {
    @Id
        @Column(name="holding_id")
        private String holdingId;

        @JoinColumn(name="user_id")
        @ManyToOne
        User user;

    @JoinColumn(name="fund_id")
    @ManyToOne
    MutualFund mutualFund;

    @Column(name="units")
    private BigDecimal units;

    @Column(name="invested_amount")
    private BigDecimal investedAmount;

    @Column(name="current_value")
    private BigDecimal currentValue;

    @Column(name="start_date")
    private LocalDate startDate;

    @Column(name="sip_amount")
    private int sipAmount;

    @Column(name="frequency")
    @Enumerated(EnumType.STRING)
    private Frequency frequency;

    @Column(name="XIRR")
    private BigDecimal xirr;

    public String getHoldingId() {
        return holdingId;
    }

    public void setHoldingId(String holdingId) {
        this.holdingId = holdingId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public MutualFund getMutualFund() {
        return mutualFund;
    }

    public void setMutualFund(MutualFund mutualFund) {
        this.mutualFund = mutualFund;
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
