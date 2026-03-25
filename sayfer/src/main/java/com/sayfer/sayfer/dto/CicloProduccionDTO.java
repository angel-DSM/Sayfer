package com.sayfer.sayfer.dto;


import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class CicloProduccionDTO {
    private Integer id;
    private String nombreCiclo;
    private java.time.LocalDate fecha_inicio;
    private java.time.LocalDate fecha_fin;
}
