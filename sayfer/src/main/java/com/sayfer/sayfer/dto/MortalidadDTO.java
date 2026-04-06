package com.sayfer.sayfer.dto;

import lombok.*;
import java.time.LocalDate;

@NoArgsConstructor @AllArgsConstructor @Builder @Setter @Getter
public class MortalidadDTO {

    private Integer        id_Mortalidad;
    private LocalDate      fecha_de_muerte;
    private String         muertos;
    private String         causa;
    private CicloProduccionDTO  id_ciclo;
    private GalponDTO           id_galpon;
    private TipoMuerteDTO       id_tipo_muerte;
}