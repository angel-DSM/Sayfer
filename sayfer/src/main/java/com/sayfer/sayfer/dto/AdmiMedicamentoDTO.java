package com.sayfer.sayfer.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class AdmiMedicamentoDTO {
    private Integer id_admi_medicamento;
    private BigDecimal cantidad_utilizada;
    private LocalDate fecha_medicacion;
    private Integer id_tipo_medicamento;
    private Integer id_galpon;
    private Integer id_ciclo;
    private Long id_usuario;
    private String nombre_med;
    private String nombre_galpon;
    private String nombre_ciclo;
    private String nombre_usuario;
}
