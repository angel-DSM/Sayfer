package com.sayfer.sayfer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "ciclo_produccion")
@Data
public class CicloProduccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ciclo")
    private Integer id;

    @Column(name = "nombre_ciclo", length = 20, nullable = false)
    private String nombreCiclo;
//es la nomenglatura de ciclo 2025/4
}
