package com.portfolioX.PortFolioX.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name="ipo_metrics")
public class IpoMetrics {
    @Id
    @Column(name = "ipo_id")
    private Long ipoId;

    @Column(name = "fundamental_score", nullable = false)
    private int fundamentalScore;

    @Column(name = "sector_score", nullable = false)
    private int sectorScore;

    @Column(name = "historical_score", nullable = false)
    private int historicalScore;

    @Column(name = "data_source", nullable = false)
    private String dataSource;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public Long getIpoId() {
        return ipoId;
    }

    public void setIpoId(Long ipoId) {
        this.ipoId = ipoId;
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

    public String getDataSource() {
        return dataSource;
    }

    public void setDataSource(String dataSource) {
        this.dataSource = dataSource;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
