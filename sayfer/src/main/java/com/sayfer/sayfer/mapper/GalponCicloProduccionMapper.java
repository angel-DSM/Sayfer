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

    @Autowired
    private CicloProduccionMapper cicloProduccionMapper;


    @Override
    public GalponCicloProduccionDTO toDTO(GalponCicloProduccion entity) {
        if (entity == null) return null;
        return GalponCicloProduccionDTO.builder()
                .id_galpon_ciclo_produccion(entity.getId_galpon_ciclo_produccion())
                .fecha_inicio(entity.getFecha_inicio())
                .fecha_fin(entity.getFecha_fin())
                .id_galpon(galponMapper.toDTO(entity.getId_galpon()))
                .id_ciclo(cicloProduccionMapper.toDTO(entity.getId_ciclo()))
                .build();
    }

    @Override
    public GalponCicloProduccion toEntity(GalponCicloProduccionDTO dto) {
        if (dto == null) return null;

        Galpon galpon = null;
        if (dto.getId_galpon() != null) {
            galpon = new Galpon();
            galpon.setId_galpon(dto.getId_galpon().getId_galpon());
        }

        CicloProduccion ciclo = null;
        if (dto.getId_ciclo() != null) {
            ciclo = new CicloProduccion();
            ciclo.setId(dto.getId_ciclo().getId_ciclo());
        }

        return GalponCicloProduccion.builder()
                .id_galpon_ciclo_produccion(dto.getId_galpon_ciclo_produccion())
                .fecha_inicio(dto.getFecha_inicio())
                .fecha_fin(dto.getFecha_fin())
                .id_galpon(galpon)
                .id_ciclo(ciclo)
                .build();
    }

}