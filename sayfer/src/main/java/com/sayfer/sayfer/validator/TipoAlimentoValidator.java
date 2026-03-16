package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.TipoAlimentoDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class TipoAlimentoValidator {
    public static void validate(TipoAlimentoDTO register){

        if(register.getNombre_alimento() == null){
            throw new ValidateException("se requiere un nombre");
        }
    }
}
