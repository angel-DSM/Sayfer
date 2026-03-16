package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.MortalidadDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class MortalidadValidator {
    public static void validate(MortalidadDTO register){

        if(register.getCantidad_muertos() == null){
            throw new ValidateException("se requiere un nombre");
        }
        if(register.getCausa() == null){
            throw new ValidateException("se requiere un nombre");
        }
        if(register.getId_ciclo() == null){
            throw new ValidateException("se requiere un nombre");
        }
        if(register.getId_tipo_muerte() == null){
            throw new ValidateException("se requiere un nombre");
        }
        if(register.getFecha_de_muerte() == null){
            throw new ValidateException("se requiere un nombre");
        }
        if(register.getId_galpon() == null){
            throw new ValidateException("se requiere un nombre");
        }
    }
}