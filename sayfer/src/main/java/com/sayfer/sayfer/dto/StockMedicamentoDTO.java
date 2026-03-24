package com.sayfer.sayfer.dto;

import lombok.*;

import java.math.BigDecimal;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter

public class StockMedicamentoDTO {
    private Integer id_stock_medicamento;
    private BigDecimal cantidadActual;
    private TipoMedicamentoDTO id_tipo_medicamento;
}
