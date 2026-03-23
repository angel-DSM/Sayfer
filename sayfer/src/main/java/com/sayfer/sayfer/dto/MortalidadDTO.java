package com.sayfer.sayfer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.sayfer.sayfer.entity.CicloProduccion;
import com.sayfer.sayfer.entity.Galpon;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
@Table(name = "mortalidad")
public class MortalidadDTO {

    private Integer id_Mortalidad;
    private LocalDate fecha_de_muerte;
    private String muertos;
    private String causa;
    private CicloProduccion id_ciclo;
    private Galpon id_galpon;
    private TipoMuerteDTO id_tipo_muerte;

}
