package com.sayfer.sayfer.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NO_CONTENT)
public class NoDataFoundException extends RuntimeException{
    public NoDataFoundException() {
    }

    public NoDataFoundException(String message) {
        super(message);
    }
}