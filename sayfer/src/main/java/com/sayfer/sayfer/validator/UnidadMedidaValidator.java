package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.UnidadMedidaDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class UnidadMedidaValidator {
    public static void validate(UnidadMedidaDTO register){

        if(register.getNombre() == null){
            throw new ValidateException("se requiere un nombre");
        }
    }
}
