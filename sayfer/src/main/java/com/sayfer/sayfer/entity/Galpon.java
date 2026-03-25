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
@Data
@Table(name = "galpon")
public class Galpon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_galpon")
    private Integer id_galpon;

    @Column(name = "nombre", length = 50, nullable = false)
    private String nombre;

    @Column(name = "capacidad", precision = 10, nullable = false)
    private Long capacidad;

    @Column(name = "metros_cuadrados", precision = 10, scale = 2)
    private java.math.BigDecimal metros_cuadrados;

}
