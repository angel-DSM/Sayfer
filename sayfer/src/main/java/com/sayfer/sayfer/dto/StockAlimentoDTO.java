package com.sayfer.sayfer.dto;

import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter

public class StockAlimentoDTO {

    private Integer id_stock_alimento;
    private long cantidad;
    private TipoAlimentoDTO id_tipo_alimento;
    private UnidadMedidaDTO id_unidad;

}
