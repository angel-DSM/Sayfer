package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.TipoMedicamentoDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class TipoMedicamentoValidator {
    public static void validate(TipoMedicamentoDTO register){

        if(register.getNombre() == null || register.getNombre().isBlank()){
            throw new ValidateException("se requiere un nombre");
        }
    }
}