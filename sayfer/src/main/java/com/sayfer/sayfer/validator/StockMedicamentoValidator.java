package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.StockMedicamentoDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class StockMedicamentoValidator {
    public static void validate(StockMedicamentoDTO register){

        if(register.getCantidadActual() == null){
            throw new ValidateException("se requiere una cantidad");
        }
        if(register.getId_tipo_medicamento() == null){
            throw new ValidateException("se requiere un medicamento");
        }
    }
}