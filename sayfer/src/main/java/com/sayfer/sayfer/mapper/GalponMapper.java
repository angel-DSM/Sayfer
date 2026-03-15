package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.GalponDTO;
import com.sayfer.sayfer.entity.Galpon;

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
                .build();
    }
}
