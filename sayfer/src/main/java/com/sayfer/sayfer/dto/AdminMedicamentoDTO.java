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
public class AdminMedicamentoDTO {

    private Integer id_admin_medicamento;
    private double cantidad_utilizada;
    private LocalDate fecha_medicacion;
    private TipoMedicamento tipo_medicamento;
    private Usuario id_usuario;
    private UnidadMedida id_unidad;
    private CicloProduccion id_ciclo;
    private Galpon id_galpon;

}
