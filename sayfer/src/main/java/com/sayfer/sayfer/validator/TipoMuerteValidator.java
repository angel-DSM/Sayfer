package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.TipoMuerteDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class TipoMuerteValidator {
    public static void validate(TipoMuerteDTO register){

        if(register.getDescripcion() == null){
            throw new ValidateException("se requiere una descriocion");
        }
        if(register.getNombre() == null){
            throw new ValidateException("se requiere un nombre");
        }
    }
}