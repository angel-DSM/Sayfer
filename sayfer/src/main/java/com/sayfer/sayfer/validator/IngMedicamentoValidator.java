package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.IngMedicamentoDTO;
import com.sayfer.sayfer.exeption.ValidateException;

import java.math.BigDecimal;

public class IngMedicamentoValidator {

    public static void validate(IngMedicamentoDTO registro) {

        if (registro.getCantidad() == 0 || registro.getCantidad() <= 0) {
            throw new ValidateException("La cantidad debe ser mayor a cero");
        }

        if (registro.getFecha_ingreso() == null) {
            throw new ValidateException("La fecha de ingreso es obligatoria");
        }

        if (registro.getValor_unitario() == null || registro.getValor_unitario().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidateException("El valor unitario debe ser mayor a cero");
        }

        if (registro.getValor_total() == null || registro.getValor_total().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidateException("El valor total debe ser mayor a cero");
        }

        if (registro.getId_unidad() == null) {
            throw new ValidateException("La unidad de medida es obligatoria");
        }

        if (registro.getId_tipo_medicamento() == null) {
            throw new ValidateException("El tipo de alimento es obligatorio");
        }
    }
}