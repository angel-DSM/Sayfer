package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.AdmiMedicamentoDTO;
import com.sayfer.sayfer.entity.AdmiMedicamento;
import org.springframework.stereotype.Component;

@Component
public class AdmiMedicamentoMapper extends GenericMapper<AdmiMedicamento, AdmiMedicamentoDTO>{
    @Override
    public AdmiMedicamentoDTO toDTO(AdmiMedicamento entity) {
        if(entity == null) {
            return null;
        }
        return AdmiMedicamentoDTO.builder()
                .id_admi_medicamento(entity.getId_admin_medicamento())
                .cantidad_utilizada_medi(entity.getCantidad_utilizada_medi())
                .fecha_medicacion(entity.getFecha_medicacion())
                .tipo_medicamento(entity.getTipo_medicamento())
                .build();
    }

    @Override
    public AdmiMedicamento toEntity(AdmiMedicamentoDTO dto) {
        if(dto == null){
            return null;
        }
        return AdmiMedicamento.builder()
                .id_admin_medicamento(dto.getId_admi_medicamento())
                .cantidad_utilizada_medi(dto.getCantidad_utilizada_medi())
                .fecha_medicacion(dto.getFecha_medicacion())
                .tipo_medicamento(dto.getTipo_medicamento())
                .build();
    }
}
