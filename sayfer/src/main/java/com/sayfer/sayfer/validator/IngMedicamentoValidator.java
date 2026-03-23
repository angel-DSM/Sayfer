package com.sayfer.sayfer.validator;
import com.sayfer.sayfer.dto.IngMedicamentoDTO;
import com.sayfer.sayfer.exeption.ValidateException;
import java.math.BigDecimal;

public class IngMedicamentoValidator {
    public static void validate(IngMedicamentoDTO r) {
        if (r.getCantidad() == null || r.getCantidad() <= 0){
            throw new ValidateException("La cantidad debe ser mayor a cero");
        }
        if (r.getFecha_ingreso() == null){
            throw new ValidateException("La fecha de ingreso es obligatoria");
    }
        if (r.getValor_total() == null || r.getValor_total().compareTo(BigDecimal.ZERO) <= 0){
            throw new ValidateException("El valor total debe ser mayor a cero");
    }
        if (r.getId_tipo_medicamento() == null) {
            throw new ValidateException("El tipo de medicamento es obligatorio");
        }
        }
}