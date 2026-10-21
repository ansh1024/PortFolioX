package com.portfolioX.PortFolioX.dto;

import com.portfolioX.PortFolioX.entity.Verdict;

import java.time.LocalDateTime;

public class ScoreLogResponseDTO {
    private String scoreLogId;
    private long ipoId;
    private String companyName;

    private int gmpScore;
    private int subscriptionScore;
    private int fundamentalScore;
    private int sectorScore;
    private int historicalScore;

    private int totalScore;
    private Verdict verdict;
    private LocalDateTime calculatedAt;

    public String getScoreLogId() {
        return scoreLogId;
    }

    public void setScoreLogId(String scoreLogId) {
        this.scoreLogId = scoreLogId;
    }

    public long getIpoId() {
        return ipoId;
    }

    public void setIpoId(long ipoId) {
        this.ipoId = ipoId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
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
