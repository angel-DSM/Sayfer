package com.sayfer.sayfer.dto;

import com.sayfer.sayfer.entity.*;
import jakarta.persistence.FetchType;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class AdmiAlimentoDTO {

    private Integer id_admi_alimento;
    private Long cantidad_utilizada;
    private LocalDate fecha_alimentacion;
    private TipoAlimento id_tipo_alimento;
    private Galpon id_galpon;
    private CicloProduccion id_ciclo;
    private Usuario id_usuario;
    private UnidadMedida id_unidad;
}
