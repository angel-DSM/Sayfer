package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.CicloProduccionDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class CicloProduccionValidator {
    public static void validate(CicloProduccionDTO register){

        if(register.getNombreCiclo() == null){
            throw new ValidateException("se requiere el nombre");
        }

    }
}
