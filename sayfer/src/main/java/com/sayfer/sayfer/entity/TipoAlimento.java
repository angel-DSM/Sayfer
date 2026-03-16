package com.sayfer.sayfer.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "tipo_alimento")
public class TipoAlimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_alimento")
    private Integer id_tipo_alimento;

    @Column(name = "nombre_alimento", length = 30, nullable = false)
    private String nombre_alimento;

    @Column(name = "descripcion_alimento", length = 200)
    private String descripcion_alimento;

}
