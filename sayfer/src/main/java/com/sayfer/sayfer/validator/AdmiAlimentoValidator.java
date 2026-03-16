package com.sayfer.sayfer.validator;
import com.sayfer.sayfer.dto.AdmiAlimentoDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class AdmiAlimentoValidator {

    public static void validate(AdmiAlimentoDTO register) {

        if (register.getCantidad_utilizada() == 0 || register.getCantidad_utilizada() <= 0) {
            throw new ValidateException("La cantidad debe ser mayor a cero");
        }
        if (register.getFecha_alimentacion() == null){
            throw  new ValidateException("la fecha es requerida");
        }
    }
}