package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.TipoMedicamentoDTO;
import com.sayfer.sayfer.entity.TipoMedicamento;
import org.springframework.stereotype.Component;

@Component
public class TipoMedicamentoMapper extends GenericMapper<TipoMedicamento, TipoMedicamentoDTO>{

    @Override
    public TipoMedicamentoDTO toDTO(TipoMedicamento entity) {
        if (entity==null){
            return null;
        }
        return TipoMedicamentoDTO.builder()
                .id_tipo_medicamento(entity.getId_tipo_medicamento())
                .nombre(entity.getNombre())
                .descripcion_medi(entity.getDescripcion_medi())
                .build();
    }

    @Override
    public TipoMedicamento toEntity(TipoMedicamentoDTO dto) {
        if (dto==null){
            return null;
        }
        return TipoMedicamento.builder()
                .id_tipo_medicamento(dto.getId_tipo_medicamento())
                .nombre(dto.getNombre())
                .descripcion_medi(dto.getDescripcion_medi())
                .build();
    }
}