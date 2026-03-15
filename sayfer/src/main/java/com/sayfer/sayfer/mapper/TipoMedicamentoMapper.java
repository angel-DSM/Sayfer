package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.TipoAlimentoDTO;
import com.sayfer.sayfer.entity.TipoAlimento;

public class TipoMedicamentoMapper extends GenericMapper<TipoAlimento, TipoAlimentoDTO>{
    @Override
    public TipoAlimentoDTO toDTO(TipoAlimento entity) {
        if (entity==null){
            return null;
        }
        return TipoAlimentoDTO.builder()
                .id_tipo_alimento(entity.getId_tipo_alimento())
                .nombre_alimento(entity.getNombre_alimento())
                .descripcion_alimento(entity.getDescripcion_alimento())
                .build();
    }

    @Override
    public TipoAlimento toEntity(TipoAlimentoDTO dto) {
        if (dto == null){
            return null;
        }
        return TipoAlimento.builder()
                .id_tipo_alimento(dto.getId_tipo_alimento())
                .nombre_alimento(dto.getNombre_alimento())
                .descripcion_alimento(dto.getDescripcion_alimento())
                .build();
    }
}
