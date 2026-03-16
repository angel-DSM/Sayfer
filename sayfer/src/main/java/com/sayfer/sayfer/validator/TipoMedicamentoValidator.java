package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.TipoMedicamentoDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class TipoMedicamentoValidator {
    public static void validate(TipoMedicamentoDTO register){

        if(register.getDescripcion_medi() == null){
            throw new ValidateException("se requiere una descripcion");
        }
        if(register.getNombre() == null){
            throw new ValidateException("se requiere un nombre");
        }
    }
}