package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.StockAlimentoDTO;
import com.sayfer.sayfer.dto.TipoAlimentoDTO;
import com.sayfer.sayfer.entity.StockAlimento;
import com.sayfer.sayfer.entity.TipoAlimento;
import org.springframework.stereotype.Component;

@Component
public class StockAlimentoMapper extends GenericMapper<StockAlimento, StockAlimentoDTO>{
    @Override
    public StockAlimentoDTO toDTO(StockAlimento entity) {
        if (entity == null) return null;

        TipoAlimentoDTO tipoDTO = null;
        String nombreAlimento = null;
        if (entity.getId_tipo_alimento() != null) {
            TipoAlimento tipo = entity.getId_tipo_alimento();
            nombreAlimento = tipo.getNombre_alimento();
            tipoDTO = TipoAlimentoDTO.builder()
                    .id_tipo_alimento(tipo.getId_tipo_alimento())
                    .nombre_alimento(tipo.getNombre_alimento())
                    .descripcion_alimento(tipo.getDescripcion_alimento())
                    .build();
        }

        return StockAlimentoDTO.builder()
                .id_stock_alimento(entity.getId_stock_alimento())
                .cantidad(entity.getCantidad())
                .nombre_alimento(nombreAlimento)
                .id_tipo_alimento(tipoDTO)
                .build();
    }

    @Override
    public StockAlimento toEntity(StockAlimentoDTO dto) {
        if (dto == null) return null;
        TipoAlimento tipo = null;
        if (dto.getId_tipo_alimento() != null) {
            tipo = new TipoAlimento();
            tipo.setId_tipo_alimento(dto.getId_tipo_alimento().getId_tipo_alimento());
        }
        return StockAlimento.builder()
                .id_stock_alimento(dto.getId_stock_alimento())
                .cantidad(dto.getCantidad())
                .id_tipo_alimento(tipo)
                .build();
    }
}
