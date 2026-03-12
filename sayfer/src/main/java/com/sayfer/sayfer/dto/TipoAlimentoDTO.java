package com.sayfer.sayfer.dto;


import jakarta.persistence.*;
import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter

public class TipoAlimentoDTO {
    private Integer id_tipo_alimento;
    private String nombre_alimento;
    private String descripcion_alimento;

}
