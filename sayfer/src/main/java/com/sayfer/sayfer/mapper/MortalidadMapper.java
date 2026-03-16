package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.MortalidadDTO;
import com.sayfer.sayfer.entity.Mortalidad;
import org.springframework.stereotype.Component;

@Component
public class MortalidadMapper extends GenericMapper<Mortalidad, MortalidadDTO>{

    @Override
    public MortalidadDTO toDTO(Mortalidad entity) {
        if (entity == null){
            return null;
        }
        return MortalidadDTO.builder()
                .id_Mortalidad(entity.getId_Mortalidad())
                .fecha_de_muerte(entity.getFecha_de_muerte())
                .cantidad_muertos(entity.getCantidad_muertos())
                .causa(entity.getCausa())
                .build();
    }

    @Override
    public Mortalidad toEntity(MortalidadDTO dto) {
        if (dto== null){
            return null;
        }
        return Mortalidad.builder()
                .id_Mortalidad(dto.getId_Mortalidad())
                .fecha_de_muerte(dto.getFecha_de_muerte())
                .cantidad_muertos(dto.getCantidad_muertos())
                .causa(dto.getCausa())
                .build();
    }
}
