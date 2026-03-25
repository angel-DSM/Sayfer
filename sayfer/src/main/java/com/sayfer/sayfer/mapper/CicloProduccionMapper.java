package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.CicloProduccionDTO;
import com.sayfer.sayfer.entity.CicloProduccion;
import org.springframework.stereotype.Component;

@Component
public class CicloProduccionMapper extends GenericMapper<CicloProduccion, CicloProduccionDTO> {
    @Override
    public CicloProduccionDTO toDTO(CicloProduccion entity) {
        if (entity==null) {
            return null;
        }
        return CicloProduccionDTO.builder()
                .id(entity.getId())
                .nombreCiclo(entity.getNombreCiclo())
                .fecha_inicio(entity.getFecha_inicio())
                .fecha_fin(entity.getFecha_fin())
                .build();
    }

    @Override
    public CicloProduccion toEntity(CicloProduccionDTO dto) {
        if (dto==null){
            return null;
        }
        return CicloProduccion.builder()
                .id(dto.getId())
                .nombreCiclo(dto.getNombreCiclo())
                .fecha_inicio(dto.getFecha_inicio())
                .fecha_fin(dto.getFecha_fin())
                .build();
    }
}
