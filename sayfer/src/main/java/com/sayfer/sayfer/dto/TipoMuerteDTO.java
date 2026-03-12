package com.sayfer.sayfer.dto;

import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter

public class TipoMuerteDTO {
    private Integer id_tipo_muerte;
    private String nombre;
    private String descripcion;

}