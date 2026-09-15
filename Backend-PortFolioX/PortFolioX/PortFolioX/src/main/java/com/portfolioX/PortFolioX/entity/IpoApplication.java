package com.portfolioX.PortFolioX.entity;

import jakarta.persistence.*;

@Entity
@Table(name="ipo_application")
public class IpoApplication {
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="application_id")
    private String applicationId;

    @JoinColumn(name="user_id")
    @ManyToOne
    //private User userId;
    User user;

    @JoinColumn(name="ipo_id")
    @ManyToOne
    IpoMaster ipoMaster;

    @Column(name="lots_applied")
    private int lotsApplied;

    @Column(name="lots_allotted")
    private int lotsAllotted;

    @Column(name="application_status")
    @Enumerated(EnumType.STRING)
    private ApplicationStatus applicationStatus;

    @Column(name="allotment_status")
    @Enumerated(EnumType.STRING)
    private AllotmentStatus allotmentStatus;

    public AllotmentStatus getAllotmentStatus() {
        return allotmentStatus;
    }

    public void setAllotmentStatus(AllotmentStatus allotmentStatus) {
        this.allotmentStatus = allotmentStatus;
    }

    public ApplicationStatus getApplicationStatus() {
        return applicationStatus;
    }

    public void setApplicationStatus(ApplicationStatus applicationStatus) {
        this.applicationStatus = applicationStatus;
    }

    public long getLotsAllotted() {
        return lotsAllotted;
    }

    public void setLotsAllotted(int lotsAllotted) {
        this.lotsAllotted = lotsAllotted;
    }

    public long getLotsApplied() {
        return lotsApplied;
    }

    public void setLotsApplied(int lotsApplied) {
        this.lotsApplied = lotsApplied;
    }

    public String getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }

    public IpoMaster getIpoMaster() {
        return ipoMaster;
    }

    public void setIpoMaster(IpoMaster ipoMaster) {
        this.ipoMaster = ipoMaster;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
