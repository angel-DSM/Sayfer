package com.sayfer.sayfer.dto;

import lombok.*;

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
    private Integer    duracion;      // calculado en el backend (días)
    private GalponDTO  id_galpon;     // FK → Galpon (incluye id_galpon + nombre)
}