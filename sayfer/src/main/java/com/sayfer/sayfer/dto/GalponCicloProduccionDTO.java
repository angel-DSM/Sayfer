package com.sayfer.sayfer.dto;

import lombok.*;

import java.time.LocalDate;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class GalponCicloProduccionDTO {

    private Integer id_galpon_ciclo_produccion;
    private LocalDate fecha_inicio;
    private LocalDate fecha_fin;
    private GalponDTO        id_galpon;
    private CicloProduccionDTO id_ciclo;

}
