package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.MortalidadDTO;
import com.sayfer.sayfer.dto.StockAlimentoDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class StockAlimentoValidator {
    public static void validate(StockAlimentoDTO register){

        if(register.getCantidad() == 0){
            throw new ValidateException("se requiere una cantidad");
        }
        if(register.getId_unidad() == null){
            throw new ValidateException("se requiere una unidad");
        }
        if(register.getId_tipo_alimento() == null){
            throw new ValidateException("se requiere un alimento");
        }
    }
}

