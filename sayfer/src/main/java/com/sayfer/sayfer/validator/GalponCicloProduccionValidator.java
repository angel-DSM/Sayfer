package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.GalponCicloProduccionDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class GalponCicloProduccionValidator {
    public static void validate(GalponCicloProduccionDTO register){

        if(register.getFecha_inicio() == null){
            throw new ValidateException("se requiere fecha de inicio");
        }
        if(register.getFecha_fin() == null){
            throw new ValidateException("se requiere fecha de fin");
        }
    }
}
