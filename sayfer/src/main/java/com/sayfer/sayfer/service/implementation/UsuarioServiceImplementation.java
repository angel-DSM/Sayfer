package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.UsuarioDTO;
import com.sayfer.sayfer.entity.Usuario;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.exeption.ValidateException;
import com.sayfer.sayfer.mapper.UsuarioMapper;
import com.sayfer.sayfer.repository.UsuarioRepository;
import com.sayfer.sayfer.service.EmailService;
import com.sayfer.sayfer.service.UsuarioService;
import com.sayfer.sayfer.validator.UsuarioValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImplementation implements UsuarioService {
    private final UsuarioRepository repository;
    private final UsuarioMapper mapper;
    private final EmailService emailService;

    public UsuarioServiceImplementation(UsuarioRepository repository, UsuarioMapper mapper, EmailService emailService) {
        this.repository = repository;
        this.mapper = mapper;
        this.emailService = emailService;
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

    @Override
    public void solicitarRecuperacion(String correo) {
        // No revelar si el correo existe o no (seguridad)
        repository.findByCorreo(correo).ifPresent(usuario -> {
            if (Boolean.TRUE.equals(usuario.getEstado())) {
                String codigo = String.format("%06d", new Random().nextInt(1000000));
                usuario.setResetToken(codigo);
                usuario.setResetTokenExpiry(LocalDateTime.now().plusMinutes(10));
                repository.save(usuario);
                emailService.enviarCodigoRecuperacion(correo, codigo);
            }
        });
    }

    @Override
    public void resetPassword(String correo, String codigo, String nuevaPassword) {
        Usuario usuario = repository.findByCorreo(correo)
                .orElseThrow(() -> new ValidateException("Datos incorrectos"));

        if (usuario.getResetToken() == null || !usuario.getResetToken().equals(codigo)) {
            throw new ValidateException("Código inválido");
        }

        if (usuario.getResetTokenExpiry() == null || LocalDateTime.now().isAfter(usuario.getResetTokenExpiry())) {
            throw new ValidateException("El código ha expirado, solicita uno nuevo");
        }

        if (nuevaPassword == null || nuevaPassword.length() < 6) {
            throw new ValidateException("La contraseña debe tener al menos 6 caracteres");
        }

        usuario.setPassword(nuevaPassword);
        usuario.setResetToken(null);
        usuario.setResetTokenExpiry(null);
        repository.save(usuario);
    }
}
