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
@Table(name = "ing_alimento")
public class IngAlimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_IngAlimento")
    private Integer id_IngAlimento;

    @Column(name = "cantidad", precision = 10,scale = 2, nullable = false)
    private BigDecimal cantidad;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fecha_ingreso;

    @Column(name = "valor_unitario", precision = 10, scale = 2)
    private BigDecimal valor_unitario;

    @Column(name = "fecha_vencimiento")
    private LocalDate fecha_vencimiento;

    @Column(name = "valor_total", precision = 10, scale = 2)
    private BigDecimal valor_total;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tipo_alimento")
    private TipoAlimento id_tipo_alimento;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_unidad")
    private UnidadMedida id_unidad;
}