package com.sayfer.sayfer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.sayfer.sayfer.entity.CicloProduccion;
import com.sayfer.sayfer.entity.Galpon;
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
    private Galpon id_galpon;
    private CicloProduccion id_ciclo;

}
