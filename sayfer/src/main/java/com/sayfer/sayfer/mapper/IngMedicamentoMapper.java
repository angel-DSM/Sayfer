package com.sayfer.sayfer.mapper;
import com.sayfer.sayfer.dto.IngMedicamentoDTO;
import com.sayfer.sayfer.dto.TipoMedicamentoDTO;
import com.sayfer.sayfer.dto.UnidadMedidaDTO;
import com.sayfer.sayfer.entity.IngMedicamento;
import com.sayfer.sayfer.entity.TipoMedicamento;
import com.sayfer.sayfer.entity.UnidadMedida;
import org.springframework.stereotype.Component;

@Component
public class IngMedicamentoMapper extends GenericMapper<IngMedicamento, IngMedicamentoDTO> {

    @Override
    public IngMedicamentoDTO toDTO(IngMedicamento entidad) {
        if (entidad == null) return null;
        TipoMedicamentoDTO tipoDTO = null;
        if (entidad.getId_tipo_medicamento() != null) {
            TipoMedicamento tipo = entidad.getId_tipo_medicamento();
            tipoDTO = TipoMedicamentoDTO.builder()
                    .id_tipo_medicamento(tipo.getId_tipo_medicamento())
                    .nombre(tipo.getNombre())
                    .descripcion_medi(tipo.getDescripcion_medi())
                    .build();
        }
        UnidadMedidaDTO unidadDTO = null;
        if (entidad.getId_unidad() != null) {
            UnidadMedida u = entidad.getId_unidad();
            unidadDTO = UnidadMedidaDTO.builder().id(u.getId()).nombre(u.getNombre()).build();
        }
        return IngMedicamentoDTO.builder()
                .ing_medicamento(entidad.getIng_medicamento())
                .cantidad(entidad.getCantidad())
                .fecha_ingreso(entidad.getFecha_ingreso())
                .valor_total(entidad.getValor_total())
                .id_tipo_medicamento(tipoDTO)
                .id_unidad(unidadDTO)
                .build();
    }

    @Override
    public IngMedicamento toEntity(IngMedicamentoDTO dto) {
        if (dto == null) return null;

        TipoMedicamento tipo = null;
        if (dto.getId_tipo_medicamento() != null) {
            tipo = new TipoMedicamento();
            tipo.setId_tipo_medicamento(dto.getId_tipo_medicamento().getId_tipo_medicamento());
        }

        UnidadMedida unidad = null;
        if (dto.getId_unidad() != null) {
            unidad = new UnidadMedida();
            unidad.setId(dto.getId_unidad().getId());
        }

        return IngMedicamento.builder()
                .ing_medicamento(dto.getIng_medicamento())
                .cantidad(dto.getCantidad())
                .fecha_ingreso(dto.getFecha_ingreso())
                .valor_total(dto.getValor_total())
                .id_tipo_medicamento(tipo)
                .id_unidad(unidad)
                .build();
    }
}