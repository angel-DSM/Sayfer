package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.AdmiAlimentoDTO;
import com.sayfer.sayfer.entity.AdmiAlimento;
import org.springframework.stereotype.Component;

@Component
public class AdmiAlimentoMapper extends GenericMapper<AdmiAlimento, AdmiAlimentoDTO>{
    @Override
    public AdmiAlimentoDTO toDTO(AdmiAlimento entity){
        if(entity == null) return null;

        return AdmiAlimentoDTO.builder()
                .id_admi_alimento(entity.getId_admi_alimento())
                .cantidad_utilizada(entity.getCantidad_utilizada())
                .fecha_alimentacion(entity.getFecha_alimentacion())
                .id_tipo_alimento(entity.getId_tipo_alimento())
                .build();
    }

    @Override
    public AdmiAlimento toEntity(AdmiAlimentoDTO dto) {
        if (dto == null){
            return null;
    }
    return AdmiAlimento.builder()
            .id_admi_alimento(dto.getId_admi_alimento())
            .cantidad_utilizada(dto.getCantidad_utilizada())
            .fecha_alimentacion(dto.getFecha_alimentacion())
            .id_tipo_alimento(dto.getId_tipo_alimento())
            .build();
 }
}
