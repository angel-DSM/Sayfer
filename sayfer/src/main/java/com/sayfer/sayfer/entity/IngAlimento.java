package com.sayfer.sayfer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "ing_alimento")
public class IngAlimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_IngAlimento")
    private Integer id_IngAlimento;

    @Column(name = "catidad", precision = 10,scale = 2, nullable = false)
    private BigDecimal catidad;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fecha_ingreso;

    @Column(name = "valor_unitario", precision = 10, scale = 2, nullable = false)
    private BigDecimal valor_unitario;

    @Column(name = "valor_total", precision = 10, scale = 2, nullable = false)
    private BigDecimal valor_total;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_unidad")
    private UnidadMedida id_unidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_medicamento")
    private TipoAlimento id_tipo_medicamento;
}