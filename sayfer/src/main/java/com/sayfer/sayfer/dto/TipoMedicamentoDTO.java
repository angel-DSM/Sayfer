package com.sayfer.sayfer.dto;

import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter

public class TipoMedicamentoDTO {
    private Integer id_tipo_medicamento;
    private String nombre;
    private String descripcion_medi;
    private String categoria;
    private String unidad;
    private Integer periodo_retiro;
    private String condiciones_almacenamiento;
}
