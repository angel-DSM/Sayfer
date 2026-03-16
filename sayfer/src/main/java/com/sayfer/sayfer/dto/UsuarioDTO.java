package com.sayfer.sayfer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class UsuarioDTO {
    private Long cedula;
    private String nombre;
    private String apellido;
    private LocalDate fecha_registro;
    private String rol;
    private String correo;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
}
