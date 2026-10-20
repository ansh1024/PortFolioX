package com.portfolioX.PortFolioX.dto;

import com.portfolioX.PortFolioX.entity.AllotmentStatus;
import com.portfolioX.PortFolioX.entity.ApplicationStatus;

public class IpoApplicationResponseDTO {
    private String applicationId;
    private long ipoId;
    private String companyName;
    private long userId;
    private int lotsApplied;
    private int lotsAllotted;
    private ApplicationStatus applicationStatus;
    private AllotmentStatus allotmentStatus;

    public String getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
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

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public int getLotsApplied() {
        return lotsApplied;
    }

    public void setLotsApplied(int lotsApplied) {
        this.lotsApplied = lotsApplied;
    }

    public int getLotsAllotted() {
        return lotsAllotted;
    }

    public void setLotsAllotted(int lotsAllotted) {
        this.lotsAllotted = lotsAllotted;
    }

    public ApplicationStatus getApplicationStatus() {
        return applicationStatus;
    }

    public void setApplicationStatus(ApplicationStatus applicationStatus) {
        this.applicationStatus = applicationStatus;
    }

    public AllotmentStatus getAllotmentStatus() {
        return allotmentStatus;
    }

    public void setAllotmentStatus(AllotmentStatus allotmentStatus) {
        this.allotmentStatus = allotmentStatus;
    }
}
