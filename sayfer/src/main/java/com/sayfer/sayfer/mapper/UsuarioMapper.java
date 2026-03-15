package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.UsuarioDTO;
import com.sayfer.sayfer.entity.Usuario;

public class UsuarioMapper extends GenericMapper<Usuario, UsuarioDTO>{
    @Override
    public UsuarioDTO toDTO(Usuario entity) {
        if (entity==null){
            return null;
        }
        return UsuarioDTO.builder()
                .cedula(entity.getCedula())
                .nombre(entity.getNombre())
                .apellido(entity.getApellido())
                .fecha_registro(entity.getFecha_registro())
                .rol(entity.getRol())
                .correo(entity.getCorreo())
                .password(entity.getPassword())
                .build();
    }

    @Override
    public Usuario toEntity(UsuarioDTO dto) {
        return null;
    }
}
