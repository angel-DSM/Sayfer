package com.sayfer.sayfer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data

@Table(name = "mortalidad")
public class Mortalidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Mortalidad")
    private Integer id_Mortalidad;

    @Column(name = "fecha_de_muerte", nullable = false)
    private LocalDate fecha_de_muerte;

    @Column(name = "cantidad_muertos", nullable = false, length = 20)
    private String cantidad_muertos;

    @Column(name = "causa", nullable = false, length = 20)
    private String causa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ciclo", nullable = false)
    private CicloProduccion id_ciclo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_galpon", nullable = false)
    private Galpon id_galpon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_muerte", nullable = false)
    private TipoMuerte id_tipo_muerte;

}
