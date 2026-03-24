package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.CicloProduccionDTO;
import com.sayfer.sayfer.dto.GalponCicloProduccionDTO;
import com.sayfer.sayfer.entity.CicloProduccion;
import com.sayfer.sayfer.entity.Galpon;
import com.sayfer.sayfer.entity.GalponCicloProduccion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GalponCicloProduccionMapper extends GenericMapper<GalponCicloProduccion, GalponCicloProduccionDTO> {

    @Autowired
    private GalponMapper galponMapper;

    @Override
    public GalponCicloProduccionDTO toDTO(GalponCicloProduccion entity) {
        if (entity == null) return null;
        return GalponCicloProduccionDTO.builder()
                .id_galpon_ciclo_produccion(entity.getId_galpon_ciclo_produccion())
                .nombreCiclo(entity.getNombreCiclo())
                .fecha_inicio(entity.getFecha_inicio())
                .fecha_fin(entity.getFecha_fin())
                .build();
    }

    @Override
    public GalponCicloProduccion toEntity(GalponCicloProduccionDTO dto) {
        return null;
    }

}