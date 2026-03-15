package com.sayfer.sayfer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data

public class TipoMuerteDTO {

        private Integer id_tipo_muerte;
        private String nombre;
        private String descripcion;

    }
