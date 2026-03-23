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

    @Column(name = "largo", nullable = false)
    private LocalDate largo;

    @Column(name = "ancho", nullable = false)
    private LocalDate ancho;

    @Column(name = "dimension", largo*ancho)
    private LocalDate dimension;

    @Column(name = "valor_total", precision = 10, scale = 2, nullable = false)
    private BigDecimal valor_total;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_alimento")
    private TipoAlimento id_tipo_alimento;
}