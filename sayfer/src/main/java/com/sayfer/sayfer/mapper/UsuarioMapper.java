package com.sayfer.sayfer.mapper;
import com.sayfer.sayfer.dto.UsuarioDTO;
import com.sayfer.sayfer.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper extends GenericMapper<Usuario, UsuarioDTO> {
    @Override
    public UsuarioDTO toDTO(Usuario entidad) {
        if (entidad == null) return null;
        return UsuarioDTO.builder()
                .cedula(entidad.getCedula())
                .nombre(entidad.getNombre())
                .apellido(entidad.getApellido())
                .fecha_registro(entidad.getFecha_registro())
                .rol(entidad.getRol())
                .correo(entidad.getCorreo())
                .estado(entidad.getEstado())
                .build();
    }
    @Override
    public Usuario toEntity(UsuarioDTO dto) {
        if (dto == null) return null;
        return Usuario.builder()
                .cedula(dto.getCedula())
                .nombre(dto.getNombre())
                .apellido(dto.getApellido())
                .fecha_registro(dto.getFecha_registro())
                .rol(dto.getRol())
                .correo(dto.getCorreo())
                .password(dto.getPassword())
                .estado(dto.getEstado())
                .build();
    }
}