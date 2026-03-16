package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.GalponCicloProduccionDTO;
import com.sayfer.sayfer.entity.GalponCicloProduccion;
import org.springframework.stereotype.Component;

@Component
public class GalponCicloProduccionMapper extends GenericMapper<GalponCicloProduccion, GalponCicloProduccionDTO>{
    @Override
    public GalponCicloProduccionDTO toDTO(GalponCicloProduccion entity) {
        if (entity==null){
            return null;
        }
        return GalponCicloProduccionDTO.builder()
                .id_galpon_ciclo_produccion(entity.getId_galpon_ciclo_produccion())
                .fecha_inicio(entity.getFecha_inicio())
                .fecha_fin(entity.getFecha_fin())
                .build();
    }

    @Override
    public GalponCicloProduccion toEntity(GalponCicloProduccionDTO dto) {
        if (dto == null) {
            return null;
        }
        return GalponCicloProduccion.builder()
                .id_galpon_ciclo_produccion(dto.getId_galpon_ciclo_produccion())
                .fecha_inicio(dto.getFecha_inicio())
                .fecha_fin(dto.getFecha_fin())
                .build();
    }
}
