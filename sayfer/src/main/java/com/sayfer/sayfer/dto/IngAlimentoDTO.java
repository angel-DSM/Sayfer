package com.sayfer.sayfer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class IngAlimentoDTO {

    private Integer id_IngAlimento;
    private BigDecimal cantidad;
    private LocalDate fecha_ingreso;
    private BigDecimal valor_total;
    private UnidadMedidaDTO id_unidad;
    private TipoAlimentoDTO id_tipo_alimento;
}