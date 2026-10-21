package com.portfolioX.PortFolioX.dto;

import java.time.LocalDateTime;

public class DecisionJournalResponseDTO {
    private String journalId;
    private long ipoId;
    private String companyName;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getJournalId() {
        return journalId;
    }

    public void setJournalId(String journalId) {
        this.journalId = journalId;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
