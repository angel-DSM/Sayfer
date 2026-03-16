package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.StockAlimentoDTO;
import com.sayfer.sayfer.entity.StockAlimento;
import org.springframework.stereotype.Component;

@Component
public class StockMedicamentoMapper extends GenericMapper<StockAlimento, StockAlimentoDTO>{
    @Override
    public StockAlimentoDTO toDTO(StockAlimento entity) {
        if (entity == null){
            return null;
        }
        return StockAlimentoDTO.builder()
                .id_stock_alimento(entity.getId_stock_alimento())
                .cantidad(entity.getCantidad())
                .build();
    }

    @Override
    public StockAlimento toEntity(StockAlimentoDTO dto) {
        if (dto == null){
            return null;
        }
        return StockAlimento.builder()
                .id_stock_alimento(dto.getId_stock_alimento())
                .cantidad(dto.getCantidad())
                .build();
    }
}
