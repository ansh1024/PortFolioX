package com.portfolioX.PortFolioX.exception;

import com.portfolioX.PortFolioX.repository.UserRepo;
import org.springframework.web.bind.annotation.ExceptionHandler;

public class DuplicateEmailException extends RuntimeException {
        public DuplicateEmailException(String message){
            super(message);
        }
}
