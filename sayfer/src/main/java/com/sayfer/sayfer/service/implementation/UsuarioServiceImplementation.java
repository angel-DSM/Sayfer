package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.UsuarioDTO;
import com.sayfer.sayfer.entity.Usuario;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.exeption.ValidateException;
import com.sayfer.sayfer.mapper.UsuarioMapper;
import com.sayfer.sayfer.repository.UsuarioRepository;
import com.sayfer.sayfer.service.UsuarioService;
import com.sayfer.sayfer.validator.UsuarioValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImplementation implements UsuarioService {
    private final UsuarioRepository repository;
    private final UsuarioMapper mapper;

    public UsuarioServiceImplementation(UsuarioRepository repository, UsuarioMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDTO> findAll() {
        List<Usuario> entidad = repository.findAll();
        return entidad.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioDTO findById(Long id) {
        Usuario entidad = repository.findById(id)
                .orElseThrow(() -> new NoDataFoundException("No se encontro el usuario por el id "+ id));
        return mapper.toDTO(entidad);
    }
    //el unico validador es si el valor de cantidad es mayor a 0
    @Override
    public UsuarioDTO create(UsuarioDTO obj) {
        UsuarioValidator.validate(obj);
        Usuario entidad = mapper.toEntity(obj);
        Usuario update = repository.save(entidad);
        return mapper.toDTO(update);
    }

    @Override
    public UsuarioDTO update(Long id, UsuarioDTO obj) {
        UsuarioValidator.validate(obj);

        Usuario existente = repository.findById(id)
                .orElseThrow(() -> new NoDataFoundException(
                        "No se puede actualizar: No existe el usuario con ID " + id));

        Usuario entidad = mapper.toEntity(obj);
        entidad.setCedula(id);

        // Si no se envió password, conservar el que ya está en la BD
        if (obj.getPassword() == null || obj.getPassword().isBlank()) {
            entidad.setPassword(existente.getPassword());
        }

        Usuario actualizado = repository.save(entidad);
        return mapper.toDTO(actualizado);
    }

    @Override
    public void delete(Long id) {
        Usuario entidad = repository.findById(id)
                .orElseThrow(()-> new NoDataFoundException("No se puede actualizar: No existe el usuario con ID" + id));
        repository.delete(entidad);
    }

    @Override
    public UsuarioDTO login(String correo, String password) {
        Usuario usuario = repository.findByCorreo(correo)
                .orElseThrow(() -> new ValidateException("Credenciales incorrectas"));
        if (!password.equals(usuario.getPassword())) {
            throw new ValidateException("Credenciales incorrectas");
        }
        if (Boolean.FALSE.equals(usuario.getEstado())) {
            throw new ValidateException("Usuario inactivo");
        }
        return mapper.toDTO(usuario);
    }
}
