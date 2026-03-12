package com.sayfer.sayfer.dto;

import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class UsuarioDTO {
    private Integer cedula;
    private String nombre;
    private String apellido;
    private LocalDate fecha_registro;
    private String rol;
    private String correo;
    private String password;
}
