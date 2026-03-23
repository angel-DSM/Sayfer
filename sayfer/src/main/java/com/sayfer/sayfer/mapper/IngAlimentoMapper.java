package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.IngAlimentoDTO;
import com.sayfer.sayfer.entity.IngAlimento;
import org.springframework.stereotype.Component;

@Component
public class IngAlimentoMapper extends GenericMapper<IngAlimento, IngAlimentoDTO>{
    @Override
    public IngAlimentoDTO toDTO(IngAlimento entity) {
        if (entity == null){
            return null;
        }
        return IngAlimentoDTO.builder()
                .id_IngAlimento(entity.getId_IngAlimento())
                .cantidad(entity.getCantidad())
                .fecha_ingreso(entity.getFecha_ingreso())
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
                .cantidad(dto.getCantidad())
                .fecha_ingreso(dto.getFecha_ingreso())
                .valor_total(dto.getValor_total())
                .build();
    }
}
