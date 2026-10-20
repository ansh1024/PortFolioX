package com.portfolioX.PortFolioX.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = IpoDateValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidIpoDates {

    String message() default
            "Closing date must be after or equal to opening date";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}