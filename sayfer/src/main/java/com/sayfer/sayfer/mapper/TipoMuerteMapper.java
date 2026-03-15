package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.TipoMuerteDTO;
import com.sayfer.sayfer.entity.TipoMuerte;

public class TipoMuerteMapper extends GenericMapper<TipoMuerte, TipoMuerteDTO>{
    @Override
    public TipoMuerteDTO toDTO(TipoMuerte entity) {
        if (entity==null){
            return null;
        }
        return TipoMuerteDTO.builder()
                .id_tipo_muerte(entity.getId_tipo_muerte())
                .nombre(entity.getNombre())
                .descripcion(entity.getDescripcion())
                .build();
    }

    @Override
    public TipoMuerte toEntity(TipoMuerteDTO dto) {
        if (dto == null){
            return null;
        }
        return TipoMuerte.builder()
                .id_tipo_muerte(dto.getId_tipo_muerte())
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .build();
    }
}
