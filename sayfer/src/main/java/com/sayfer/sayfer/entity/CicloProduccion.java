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
@Table(name = "ciclo_produccion")
public class CicloProduccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ciclo")
    private Integer id;

    @Column(name = "nombre_ciclo", length = 20, nullable = false)
    private String nombre_ciclo;

    @Column(name = "fecha_inicio")
    private LocalDate fecha_inicio;

    @Column(name = "fecha_fin")
    private LocalDate fecha_fin;

    @Column(name = "duracion")
    private Integer duracion;

    @Column(name = "cantidad_pollos")
    private Integer cantidad_pollos;

    @Column(name = "valor_pollo", precision = 12, scale = 2)
    private BigDecimal valor_pollo;

}
