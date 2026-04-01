package com.sayfer.sayfer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

}
