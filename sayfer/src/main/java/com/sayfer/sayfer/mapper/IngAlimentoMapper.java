package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.IngAlimentoDTO;
import com.sayfer.sayfer.entity.IngAlimento;

public class IngAlimentoMapper extends GenericMapper<IngAlimento, IngAlimentoDTO>{
    @Override
    public IngAlimentoDTO toDTO(IngAlimento entity) {
        if (entity == null){
            return null;
        }
        return IngAlimentoDTO.builder()
                .id_IngAlimento(entity.getId_IngAlimento())
                .catidad(entity.getCatidad())
                .fecha_ingreso(entity.getFecha_ingreso())
                .valor_unitario(entity.getValor_unitario())
                .valor_total(entity.getValor_total())
                .build();
    }

    @Override
    public IngAlimento toEntity(IngAlimentoDTO dto) {
        if (dto == null){
            return null;
        }
        return IngAlimento.builder()
                .id_IngAlimento(dto.getId_IngAlimento())
                .catidad(dto.getCatidad())
                .fecha_ingreso(dto.getFecha_ingreso())
                .valor_unitario(dto.getValor_unitario())
                .valor_total(dto.getValor_total())
                .build();
    }
}
