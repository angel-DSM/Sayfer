package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.GalponDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class GalponValidator {
    public static void validate(GalponDTO register){

        if(register.getCapacidad() == null){
            throw new ValidateException("se requiere la capacidad");
        }
        if(register.getNombre() == null){
            throw new ValidateException("se requiere un nombre");
        }
    }
}
