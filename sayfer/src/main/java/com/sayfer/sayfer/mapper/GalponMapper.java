package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.GalponDTO;
import com.sayfer.sayfer.entity.Galpon;
import org.springframework.stereotype.Component;

@Component
public class GalponMapper extends GenericMapper<Galpon, GalponDTO>{

    @Override
    public GalponDTO toDTO(Galpon entity) {
        if (entity==null) {
            return null;
        }
        return GalponDTO.builder()
                .id_galpon(entity.getId_galpon())
                .nombre(entity.getNombre())
                .capacidad(entity.getCapacidad())
                .metros_cuadrados(entity.getMetros_cuadrados())
                .build();
    }

    @Override
    public Galpon toEntity(GalponDTO dto) {
        if (dto==null){
            return null;
        }
        return Galpon.builder()
                .id_galpon(dto.getId_galpon())
                .nombre(dto.getNombre())
                .capacidad(dto.getCapacidad())
                .metros_cuadrados(dto.getMetros_cuadrados())
                .build();
    }
}
