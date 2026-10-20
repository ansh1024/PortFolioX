package com.portfolioX.PortFolioX.dto;


import com.portfolioX.PortFolioX.entity.Category;

import java.math.BigDecimal;

public class MutualFundRequestDTO {
    private String fundId;
    private String fundName;
    private String amc;
    private Category category;
    private BigDecimal nav;
    private long aum;
    private BigDecimal return1Day;
    private BigDecimal return1Month;
    private BigDecimal return6Month;
    private BigDecimal return1Year;
    private BigDecimal return3Year;
    private BigDecimal return5Year;

    public String getFundId() {
        return fundId;
    }

    public void setFundId(String fundId) {
        this.fundId = fundId;
    }

    public String getFundName() {
        return fundName;
    }

    public void setFundName(String fundName) {
        this.fundName = fundName;
    }

    public String getAmc() {
        return amc;
    }

    public void setAmc(String amc) {
        this.amc = amc;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public BigDecimal getNav() {
        return nav;
    }

    public void setNav(BigDecimal nav) {
        this.nav = nav;
    }

    public long getAum() {
        return aum;
    }

    public void setAum(long aum) {
        this.aum = aum;
    }

    public BigDecimal getReturn1Day() {
        return return1Day;
    }

    public void setReturn1Day(BigDecimal return1Day) {
        this.return1Day = return1Day;
    }

    public BigDecimal getReturn1Month() {
        return return1Month;
    }

    public void setReturn1Month(BigDecimal return1Month) {
        this.return1Month = return1Month;
    }

    public BigDecimal getReturn6Month() {
        return return6Month;
    }

    public void setReturn6Month(BigDecimal return6Month) {
        this.return6Month = return6Month;
    }

    public BigDecimal getReturn1Year() {
        return return1Year;
    }

    public void setReturn1Year(BigDecimal return1Year) {
        this.return1Year = return1Year;
    }

    public BigDecimal getReturn3Year() {
        return return3Year;
    }

    public void setReturn3Year(BigDecimal return3Year) {
        this.return3Year = return3Year;
    }

    public BigDecimal getReturn5Year() {
        return return5Year;
    }

    public void setReturn5Year(BigDecimal return5Year) {
        this.return5Year = return5Year;
    }
}
