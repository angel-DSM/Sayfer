package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.IngAlimentoDTO;
import com.sayfer.sayfer.exeption.ValidateException;
import java.math.BigDecimal;

public class IngAlimentoValidator {

    public static void validate(IngAlimentoDTO registro) {

        if (registro.getCantidad() == null || registro.getCantidad().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidateException("La cantidad debe ser mayor a cero");
        }

        if (registro.getFecha_ingreso() == null) {
            throw new ValidateException("La fecha de ingreso es obligatoria");
        }

        if (registro.getValor_total() != null && registro.getValor_total().compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidateException("El valor total no puede ser negativo");
        }
    }
}