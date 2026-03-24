package com.sayfer.sayfer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fecha_inicio;

    @Column(name = "fecha_fin")
    private LocalDate fecha_fin;

    // Se calcula automáticamente (días entre inicio y fin)
    @Column(name = "duracion")
    private Integer duracion;

    // Un ciclo pertenece a un galpón
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_galpon", nullable = false)
    private Galpon id_galpon;
}