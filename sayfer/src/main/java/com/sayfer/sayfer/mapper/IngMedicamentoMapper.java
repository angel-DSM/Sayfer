package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.IngMedicamentoDTO;
import com.sayfer.sayfer.entity.IngMedicamento;
import org.springframework.stereotype.Component;

@Component
public class IngMedicamentoMapper extends GenericMapper<IngMedicamento, IngMedicamentoDTO>{
    @Override
    public IngMedicamentoDTO toDTO(IngMedicamento entity) {
        if (entity==null){
            return null;
        }
        return IngMedicamentoDTO.builder()
                .ing_medicamento(entity.getIng_medicamento())
                .cantidad(entity.getCantidad())
                .fecha_ingreso(entity.getFecha_ingreso())
                .valor_unitario(entity.getValor_unitario())
                .valor_total(entity.getValor_total())
                .build();
    }

    @Override
    public IngMedicamento toEntity(IngMedicamentoDTO dto) {
        if (dto==null){
            return null;
        }
        return IngMedicamento.builder()
                .ing_medicamento(dto.getIng_medicamento())
                .cantidad(dto.getCantidad())
                .fecha_ingreso(dto.getFecha_ingreso())
                .valor_unitario(dto.getValor_unitario())
                .valor_total(dto.getValor_total())
                .build();
    }
}
