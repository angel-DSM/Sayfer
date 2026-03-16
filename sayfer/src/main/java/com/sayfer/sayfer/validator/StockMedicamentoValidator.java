package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.StockAlimentoDTO;
import com.sayfer.sayfer.dto.StockMedicamentoDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class StockMedicamentoValidator {
    public static void validate(StockMedicamentoDTO register){

        if(register.getId_unidad() == null){
            throw new ValidateException("se requiere una unidad de peso");
        }
        if(register.getCantidad_actual() == null){
            throw new ValidateException("se requiere una cantidad");
        }
        if(register.getId_tipo_medicamento() == null){
            throw new ValidateException("se requiere un medicamento");
        }
    }
}