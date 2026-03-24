package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.StockMedicamentoDTO;
import com.sayfer.sayfer.dto.TipoMedicamentoDTO;
import com.sayfer.sayfer.entity.StockMedicamento;
import com.sayfer.sayfer.entity.TipoMedicamento;
import org.springframework.stereotype.Component;

@Component
public class StockMedicamentoMapper extends GenericMapper<StockMedicamento, StockMedicamentoDTO>{
    @Override
    public StockMedicamentoDTO toDTO(StockMedicamento entity) {
        if (entity == null){
            return null;
        }
        TipoMedicamentoDTO tipoDTO = null;
        if (entity.getId_tipo_medicamento() != null) {
            TipoMedicamento tipo = entity.getId_tipo_medicamento();
            tipoDTO = TipoMedicamentoDTO.builder()
                    .id_tipo_medicamento(tipo.getId_tipo_medicamento())
                    .nombre(tipo.getNombre())
                    .build();
        }
        return StockMedicamentoDTO.builder()
                .id_stock_medicamento(entity.getId_stock_medicamento())
                .cantidadActual(entity.getCantidadActual())
                .id_tipo_medicamento(tipoDTO)
                .build();
    }

    @Override
    public StockMedicamento toEntity(StockMedicamentoDTO dto) {
        if (dto==null){
            return null;
        }
        return StockMedicamento.builder()
                .id_stock_medicamento(dto.getId_stock_medicamento())
                .cantidadActual(dto.getCantidadActual())
                .build();
    }


}
