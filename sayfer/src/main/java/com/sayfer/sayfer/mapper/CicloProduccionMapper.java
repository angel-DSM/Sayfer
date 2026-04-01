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
                .build();
    }
}
