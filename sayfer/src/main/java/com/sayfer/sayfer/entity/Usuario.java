package com.sayfer.sayfer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Usuario {
//preferi usar la cedula como llave primaria ya que no se puede reprtir
    @Id
    @Column(name = "cedula",unique = true)
    private Long cedula;

    @Column(name = "nombre", length = 30, nullable = false)
    private String nombre;

    @Column(name = "apellido", length = 30, nullable = false)
    private String apellido;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDate fecha_registro;

    @Column(name = "rol", nullable = false, length = 10)
    private String rol;

    @Column(name = "correo", length = 50,nullable = false)
    private String correo;

    @Column(name = "password",length = 200)
    private String password;

    @Column(name = "estado", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean estado = true;

    @Column(name = "reset_token", length = 6)
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;
}
