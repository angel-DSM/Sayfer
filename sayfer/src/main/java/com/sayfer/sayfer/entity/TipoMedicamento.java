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
@Table(name = "tipo_medicamento")
public class TipoMedicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_tipo_medicamento;

    @Column(name = "nombre", length = 100, nullable = false)
    private String nombre;

    @Column(name = "descripcion_medi", length = 200)
    private String descripcion_medi;

    @Column(name = "categoria", length = 50)
    private String categoria;

    @Column(name = "unidad", length = 20)
    private String unidad;

    @Column(name = "periodo_retiro")
    private Integer periodo_retiro;

    @Column(name = "condiciones_almacenamiento", length = 200)
    private String condiciones_almacenamiento;
}
