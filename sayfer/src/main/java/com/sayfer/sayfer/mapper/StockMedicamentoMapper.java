package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.StockMedicamentoDTO;
import com.sayfer.sayfer.entity.StockMedicamento;
import org.springframework.stereotype.Component;

@Component
public class StockMedicamentoMapper extends GenericMapper<StockMedicamento, StockMedicamentoDTO>{
    @Override
    public StockMedicamentoDTO toDTO(StockMedicamento entity) {
        if (entity == null){
            return null;
        }
        return StockMedicamentoDTO.builder()
                .id_stock_medicamento(entity.getId_stock_medicamento())
                .cantidadActual(entity.getCantidadActual())
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
