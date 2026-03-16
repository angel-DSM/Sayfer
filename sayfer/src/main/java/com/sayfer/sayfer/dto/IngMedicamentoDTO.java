package com.sayfer.sayfer.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class IngMedicamentoDTO {

    private Integer ing_medicamento;
    private Double cantidad;
    private LocalDate fecha_ingreso;
    private BigDecimal valor_unitario;
    private  BigDecimal valor_total;
    private TipoMedicamentoDTO id_tipo_medicamento;
    private UnidadMedidaDTO id_unidad;
}
