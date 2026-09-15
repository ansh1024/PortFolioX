package com.portfolioX.PortFolioX.entity;

import jakarta.persistence.*;

import java.time.LocalDate;


@Entity
@Table(name="ipo_masters")
public class IpoMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ipo_id")
    private long ipoId;

    @Column(name="company_name",nullable = false)
    private String companyName;

    @Column(name="opening_date")
    private LocalDate openingDate;

    @Column(name="closing_date")
    private LocalDate closingDate;

    @Column(name="allotment_date")
    private LocalDate allotmentDate;

    @Column(name="price")
    private float price;

    @Column(name="gmp")
    private int gmp;

    @Column(name="sector")
    private String sector;

    @Column(name="subscription_qib")
    private float subscriptionQib;

    @Column(name="subscription_shni")
    private float subscriptionShni;

    @Column(name="subscription_bhni")
    private float subscriptionBhni;

    @Column(name="subscription_retail")
    private float subscriptionRetail;

    @Column(name="subscription_employee")
    private float subscriptionEmployee;

    @Column(name="ipo_status")
    @Enumerated(EnumType.STRING)
    private IpoStatus ipoStatus;

    public float getGmp() {
        return gmp;
    }

    public void setGmp(int gmp) {
        this.gmp = gmp;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public LocalDate getAllotmentDate() {
        return allotmentDate;
    }

    public void setAllotmentDate(LocalDate allotmentDate) {
        this.allotmentDate = allotmentDate;
    }

    public LocalDate getOpeningDate() {
        return openingDate;
    }

    public void setOpeningDate(LocalDate openingDate) {
        this.openingDate = openingDate;
    }

    public LocalDate getClosingDate() {
        return closingDate;
    }

    public void setClosingDate(LocalDate closingDate) {
        this.closingDate = closingDate;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public long getIpoId() {
        return ipoId;
    }

    public void setIpoId(long ipoId) {
        this.ipoId = ipoId;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public float getSubscriptionQib() {
        return subscriptionQib;
    }

    public void setSubscriptionQib(float subscriptionQib) {
        this.subscriptionQib = subscriptionQib;
    }

    public float getSubscriptionShni() {
        return subscriptionShni;
    }

    public void setSubscriptionShni(float subscriptionShni) {
        this.subscriptionShni = subscriptionShni;
    }

    public float getSubscriptionRetail() {
        return subscriptionRetail;
    }

    public void setSubscriptionRetail(float subscriptionRetail) {
        this.subscriptionRetail = subscriptionRetail;
    }

    public float getSubscriptionBhni() {
        return subscriptionBhni;
    }

    public void setSubscriptionBhni(float subscriptionBhni) {
        this.subscriptionBhni = subscriptionBhni;
    }

    public float getSubscriptionEmployee() {
        return subscriptionEmployee;
    }

    public void setSubscriptionEmployee(float subscriptionEmployee) {
        this.subscriptionEmployee = subscriptionEmployee;
    }

    public IpoStatus getIpoStatus() {
        return ipoStatus;
    }

    public void setIpoStatus(IpoStatus ipoStatus) {
        this.ipoStatus = ipoStatus;
    }
}
