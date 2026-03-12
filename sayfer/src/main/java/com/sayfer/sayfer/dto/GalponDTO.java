package com.sayfer.sayfer.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter

public class GalponDTO {
    private Integer id_galpon;

    private String nombre;

    private Long capacidad;
}
