package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.IngAlimentoDTO;
import com.sayfer.sayfer.dto.TipoAlimentoDTO;
import com.sayfer.sayfer.entity.IngAlimento;
import com.sayfer.sayfer.entity.TipoAlimento;
import org.springframework.stereotype.Component;

@Component
public class IngAlimentoMapper extends GenericMapper<IngAlimento, IngAlimentoDTO> {

    @Override
    public IngAlimentoDTO toDTO(IngAlimento entity) {
        if (entity == null) return null;

        TipoAlimentoDTO tipoDTO = null;
        if (entity.getId_tipo_alimento() != null) {
            TipoAlimento tipo = entity.getId_tipo_alimento();
            tipoDTO = TipoAlimentoDTO.builder()
                    .id_tipo_alimento(tipo.getId_tipo_alimento())
                    .nombre_alimento(tipo.getNombre_alimento())       // ← campo correcto
                    .descripcion_alimento(tipo.getDescripcion_alimento())
                    .build();
        }

        return IngAlimentoDTO.builder()
                .id_IngAlimento(entity.getId_IngAlimento())
                .cantidad(entity.getCantidad())
                .fecha_ingreso(entity.getFecha_ingreso())
                .valor_total(entity.getValor_total())
                .id_tipo_alimento(tipoDTO)
                .build();
    }

    @Override
    public IngAlimento toEntity(IngAlimentoDTO dto) {
        if (dto == null) return null;

        TipoAlimento tipo = null;
        if (dto.getId_tipo_alimento() != null) {
            tipo = new TipoAlimento();
            tipo.setId_tipo_alimento(dto.getId_tipo_alimento().getId_tipo_alimento());
        }

        return IngAlimento.builder()
                .id_IngAlimento(dto.getId_IngAlimento())
                .cantidad(dto.getCantidad())
                .fecha_ingreso(dto.getFecha_ingreso())
                .valor_total(dto.getValor_total())
                .id_tipo_alimento(tipo)
                .build();
    }
}