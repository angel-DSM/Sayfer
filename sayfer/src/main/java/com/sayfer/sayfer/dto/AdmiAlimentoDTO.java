package com.sayfer.sayfer.dto;

import lombok.*;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class AdmiAlimentoDTO {
    private Integer id_admi_alimento;
    private Long cantidad_utilizada;
    private LocalDate fecha_alimentacion;
    private Integer id_tipo_alimento;
    private Integer id_galpon;
    private Integer id_ciclo;
    private Long id_usuario;
    private String nombre_alimento;
    private String nombre_galpon;
    private String nombre_ciclo;
    private String nombre_usuario;
}
