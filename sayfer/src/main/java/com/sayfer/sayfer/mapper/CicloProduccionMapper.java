package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.CicloProduccionDTO;
import com.sayfer.sayfer.entity.CicloProduccion;
import com.sayfer.sayfer.entity.Galpon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CicloProduccionMapper extends GenericMapper<CicloProduccion, CicloProduccionDTO> {

    @Autowired
    private GalponMapper galponMapper;

    @Override
    public CicloProduccionDTO toDTO(CicloProduccion entity) {
        if (entity == null) return null;
        return CicloProduccionDTO.builder()
                .id_ciclo(entity.getId())
                .nombre_ciclo(entity.getNombre_ciclo())
                .fecha_inicio(entity.getFecha_inicio())
                .fecha_fin(entity.getFecha_fin())
                .duracion(entity.getDuracion())
                .id_galpon(galponMapper.toDTO(entity.getId_galpon()))   // incluye nombre del galpón
                .build();
    }

    @Override
    public CicloProduccion toEntity(CicloProduccionDTO dto) {
        if (dto == null) return null;

        // Reconstruir la FK de Galpón a partir del id recibido
        Galpon galpon = null;
        if (dto.getId_galpon() != null) {
            galpon = new Galpon();
            galpon.setId_galpon(dto.getId_galpon().getId_galpon());
        }

        return CicloProduccion.builder()
                .id(dto.getId_ciclo())
                .nombre_ciclo(dto.getNombre_ciclo())
                .fecha_inicio(dto.getFecha_inicio())
                .fecha_fin(dto.getFecha_fin())
                .duracion(dto.getDuracion())   // el Service calcula esto antes de llamar al mapper
                .id_galpon(galpon)
                .build();
    }
}