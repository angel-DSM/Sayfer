package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.CicloProduccionDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class CicloProduccionValidator {

    public static void validate(CicloProduccionDTO dto) {

        if (dto.getNombre_ciclo() == null || dto.getNombre_ciclo().isBlank()) {
            throw new ValidateException("El nombre del ciclo es obligatorio");
        }

        if (dto.getFecha_inicio() == null) {
            throw new ValidateException("La fecha de inicio es obligatoria");
        }

        if (dto.getId_galpon() == null || dto.getId_galpon().getId_galpon() == null) {
            throw new ValidateException("Debe asociar un galpón al ciclo");
        }

        // Si tiene fecha_fin, debe ser posterior a fecha_inicio
        if (dto.getFecha_fin() != null && !dto.getFecha_fin().isAfter(dto.getFecha_inicio())) {
            throw new ValidateException("La fecha de fin debe ser posterior a la fecha de inicio");
        }
    }
}