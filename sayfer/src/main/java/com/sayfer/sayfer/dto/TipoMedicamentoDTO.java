package com.sayfer.sayfer.dto;

import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter

public class TipoMedicamentoDTO {
    private String id_tipo_medicamento;
    private String nombre;
    private String descripcion;
}
