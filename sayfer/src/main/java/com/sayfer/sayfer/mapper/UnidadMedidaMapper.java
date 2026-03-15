package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.UnidadMedidaDTO;
import com.sayfer.sayfer.entity.UnidadMedida;

public class UnidadMedidaMapper extends GenericMapper<UnidadMedida, UnidadMedidaDTO>{
    @Override
    public UnidadMedidaDTO toDTO(UnidadMedida entity) {
        if (entity== null){
            return null;
        }
        return UnidadMedidaDTO.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .build();
    }

    @Override
    public UnidadMedida toEntity(UnidadMedidaDTO dto) {
        if (dto== null){
            return null;
        }
        return UnidadMedida.builder()
                .id(dto.getId())
                .nombre(dto.getNombre())
                .build();
    }
}
