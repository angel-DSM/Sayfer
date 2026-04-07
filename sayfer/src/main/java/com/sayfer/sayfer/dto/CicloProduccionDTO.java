package com.sayfer.sayfer.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class CicloProduccionDTO {

    private Integer    id_ciclo;
    private String     nombre_ciclo;
    private LocalDate  fecha_inicio;
    private LocalDate  fecha_fin;
    private Integer    duracion;
    private GalponDTO  id_galpon;
    private Integer    cantidad_pollos;
    private BigDecimal valor_pollo;
}