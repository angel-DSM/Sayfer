package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.MortalidadDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class MortalidadValidator {
    public static void validate(MortalidadDTO register){

        if(register.getMuertos() == null){
            throw new ValidateException("se requiere la cantidad de muertos");
        }
        if(register.getCausa() == null){
            throw new ValidateException("se requiere la causa");
        }
        if(register.getId_ciclo() == null){
            throw new ValidateException("se requiere el ciclo");
        }
        if(register.getId_tipo_muerte() == null){
            throw new ValidateException("se requiere el tipo de muerte");
        }
        if(register.getFecha_de_muerte() == null){
            throw new ValidateException("se requiere la fecha de muerte");
        }
        if(register.getId_galpon() == null){
            throw new ValidateException("se requiere un galpon");
        }
    }
}