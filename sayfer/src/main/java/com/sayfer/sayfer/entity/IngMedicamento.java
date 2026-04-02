package com.sayfer.sayfer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Table(name = "ing_medicamento")
public class IngMedicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ing_medicamento")
    private Integer ing_medicamento;

    @Column(name = "cantidad", nullable = false, precision = 3)
    private double cantidad;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fecha_ingreso;

    @Column(name = "valor_total", precision = 30, scale = 2, nullable = true)
    private  BigDecimal valor_total;

    @Column(name = "fecha_vencimiento", precision = 10, scale = 2)
    private LocalDate fecha_vencimiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_medicamento", nullable = false)
    private TipoMedicamento id_tipo_medicamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_unidad", nullable = true)
    private UnidadMedida id_unidad;
}
