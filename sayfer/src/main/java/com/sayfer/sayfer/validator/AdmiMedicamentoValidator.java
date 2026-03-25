package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.AdmiAlimentoDTO;
import com.sayfer.sayfer.dto.AdmiMedicamentoDTO;
import com.sayfer.sayfer.exeption.ValidateException;

import java.math.BigDecimal;

public class AdmiMedicamentoValidator {

    public static void validate(AdmiMedicamentoDTO register) {

        if (register.getCantidad_utilizada() == null || register.getCantidad_utilizada().compareTo(BigDecimal.ZERO)<=0) {
            throw new ValidateException("La cantidad debe ser mayor a cero");
        }

        if (register.getFecha_medicacion() == null) {
            throw new ValidateException("La fecha es requerida");
        }
    }
}
