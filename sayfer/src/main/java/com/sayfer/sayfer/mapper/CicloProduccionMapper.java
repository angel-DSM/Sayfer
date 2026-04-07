package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.CicloProduccionDTO;
import com.sayfer.sayfer.entity.CicloProduccion;
import org.springframework.stereotype.Component;

@Component
public class CicloProduccionMapper extends GenericMapper<CicloProduccion, CicloProduccionDTO> {

    @Override
    public CicloProduccionDTO toDTO(CicloProduccion entity) {
        if (entity == null) return null;
        return CicloProduccionDTO.builder()
                .id_ciclo(entity.getId())
                .nombre_ciclo(entity.getNombre_ciclo())
                .fecha_inicio(entity.getFecha_inicio())
                .fecha_fin(entity.getFecha_fin())
                .duracion(entity.getDuracion())
                .cantidad_pollos(entity.getCantidad_pollos())
                .valor_pollo(entity.getValor_pollo())
                .build();
    }

    @Override
    public CicloProduccion toEntity(CicloProduccionDTO dto) {
        if (dto == null) return null;
        return CicloProduccion.builder()
                .id(dto.getId_ciclo())
                .nombre_ciclo(dto.getNombre_ciclo())
                .fecha_inicio(dto.getFecha_inicio())
                .fecha_fin(dto.getFecha_fin())
                .duracion(dto.getDuracion())
                .cantidad_pollos(dto.getCantidad_pollos())
                .valor_pollo(dto.getValor_pollo())
                .build();
    }
}