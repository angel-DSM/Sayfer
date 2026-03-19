package com.sayfer.sayfer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "admi_medicamento")
public class AdmiMedicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_admin_medicamento;

    @Column(name = "cantidad_utilizada_medi", precision =20, nullable = false )
    private BigDecimal cantidad_utilizada_medi;

    @Column(name = "fecha_medicacion", nullable = false)
    private LocalDate fecha_medicacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_medicamento", nullable = false)
    private TipoMedicamento tipo_medicamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario id_usuario;

    /*@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_unidad", nullable = false)
    private UnidadMedida id_unidad;*/

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ciclo", nullable = false)
    private CicloProduccion id_ciclo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_galpon", nullable = false)
    private Galpon id_galpon;

}
