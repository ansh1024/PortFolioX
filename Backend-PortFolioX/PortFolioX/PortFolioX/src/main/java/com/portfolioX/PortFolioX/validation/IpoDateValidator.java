package com.portfolioX.PortFolioX.validation;

import com.portfolioX.PortFolioX.entity.IpoMaster;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class IpoDateValidator implements ConstraintValidator<ValidIpoDates, IpoMaster> {
    @Override
    public boolean isValid(
            IpoMaster ipo,
            ConstraintValidatorContext context){
        if(ipo==null
        || ipo.getOpeningDate()==null
        || ipo.getClosingDate()==null){
            return true;
        }
        return !ipo.getClosingDate().isBefore(ipo.getOpeningDate());
    }

}
