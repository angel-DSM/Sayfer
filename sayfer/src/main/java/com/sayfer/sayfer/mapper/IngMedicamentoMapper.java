package com.sayfer.sayfer.mapper;
import com.sayfer.sayfer.dto.IngMedicamentoDTO;
import com.sayfer.sayfer.entity.IngMedicamento;
import com.sayfer.sayfer.entity.TipoMedicamento;
import com.sayfer.sayfer.entity.UnidadMedida;
import org.springframework.stereotype.Component;

@Component
public class IngMedicamentoMapper extends GenericMapper<IngMedicamento, IngMedicamentoDTO> {

    @Override
    public IngMedicamentoDTO toDTO(IngMedicamento entidad) {
        if (entidad == null) return null;
        return IngMedicamentoDTO.builder()
                .ing_medicamento(entidad.getIng_medicamento())
                .cantidad(entidad.getCantidad())
                .fecha_ingreso(entidad.getFecha_ingreso())
                .valor_total(entidad.getValor_total())
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