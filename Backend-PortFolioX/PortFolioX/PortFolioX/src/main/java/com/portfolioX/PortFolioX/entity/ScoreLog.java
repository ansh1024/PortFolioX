package com.portfolioX.PortFolioX.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="score_log")
public class ScoreLog {
    @Id
    @Column(name="score_log_id")
    private String scoreLogId;

    @JoinColumn(name="ipo_id")
    @ManyToOne
    IpoMaster ipoMaster;

    @Column(name="gmp_score")
    private int gmpScore;

    @Column(name="subscription_score")
    private int subscriptionScore;

    @Column(name="fundamental_score")
    private int fundamentalScore;

    @Column(name="sector_score")
    private int sectorScore;

    @Column(name="historical_score")
    private int historicalScore;

    @Column(name="total_score")
    private int totalScore;

    @Column(name="verdict")
            @Enumerated(EnumType.STRING)
    Verdict verdict;

    @Column(name="calculated_at")
    private LocalDateTime calculatedAt;

    public String getScoreLogId() {
        return scoreLogId;
    }

    public void setScoreLogId(String scoreLogId) {
        this.scoreLogId = scoreLogId;
    }

    public IpoMaster getIpoMaster() {
        return ipoMaster;
    }

    public void setIpoMaster(IpoMaster ipoMaster) {
        this.ipoMaster = ipoMaster;
    }

    public int getGmpScore() {
        return gmpScore;
    }

    public void setGmpScore(int gmpScore) {
        this.gmpScore = gmpScore;
    }

    public int getSubscriptionScore() {
        return subscriptionScore;
    }

    public void setSubscriptionScore(int subscriptionScore) {
        this.subscriptionScore = subscriptionScore;
    }

    public int getFundamentalScore() {
        return fundamentalScore;
    }

    public void setFundamentalScore(int fundamentalScore) {
        this.fundamentalScore = fundamentalScore;
    }

    public int getSectorScore() {
        return sectorScore;
    }

    public void setSectorScore(int sectorScore) {
        this.sectorScore = sectorScore;
    }

    public int getHistoricalScore() {
        return historicalScore;
    }

    public void setHistoricalScore(int historicalScore) {
        this.historicalScore = historicalScore;
    }

    public int getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(int totalScore) {
        this.totalScore = totalScore;
    }

    public Verdict getVerdict() {
        return verdict;
    }

    public void setVerdict(Verdict verdict) {
        this.verdict = verdict;
    }

    public LocalDateTime getCalculatedAt() {
        return calculatedAt;
    }

    public void setCalculatedAt(LocalDateTime calculatedAt) {
        this.calculatedAt = calculatedAt;
    }
}
