package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.IngAlimentoDTO;
import com.sayfer.sayfer.dto.TipoAlimentoDTO;
import com.sayfer.sayfer.dto.UnidadMedidaDTO;
import com.sayfer.sayfer.entity.IngAlimento;
import com.sayfer.sayfer.entity.TipoAlimento;
import com.sayfer.sayfer.entity.UnidadMedida;
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
                    .nombre_alimento(tipo.getNombre_alimento())
                    .descripcion_alimento(tipo.getDescripcion_alimento())
                    .build();
        }

        UnidadMedidaDTO unidadDTO = null;
        if (entity.getId_unidad() != null) {
            UnidadMedida unidad = entity.getId_unidad();
            unidadDTO = UnidadMedidaDTO.builder()
                    .id(unidad.getId())
                    .nombre(unidad.getNombre())
                    .build();
        }

        return IngAlimentoDTO.builder()
                .id_IngAlimento(entity.getId_IngAlimento())
                .cantidad(entity.getCantidad())
                .fecha_ingreso(entity.getFecha_ingreso())
                .valor_unitario(entity.getValor_unitario())
                .valor_total(entity.getValor_total())
                .fecha_vencimiento(entity.getFecha_vencimiento())
                .id_tipo_alimento(tipoDTO)
                .id_unidad(unidadDTO)
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

        UnidadMedida unidad = null;
        if (dto.getId_unidad() != null) {
            unidad = new UnidadMedida();
            unidad.setId(dto.getId_unidad().getId());
        }

        return IngAlimento.builder()
                .id_IngAlimento(dto.getId_IngAlimento())
                .cantidad(dto.getCantidad())
                .fecha_ingreso(dto.getFecha_ingreso())
                .valor_unitario(dto.getValor_unitario())
                .valor_total(dto.getValor_total())
                .fecha_vencimiento(dto.getFecha_vencimiento())
                .id_tipo_alimento(tipo)
                .id_unidad(unidad)
                .build();
    }
}