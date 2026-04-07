package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.dto.UsuarioDTO;
import com.sayfer.sayfer.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuario")

public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    // GET /usuario?page=0&size=10&search=xxx
    @GetMapping
    public ResponseEntity<ApiResponse<List<UsuarioDTO>>> findAll() {
        List<UsuarioDTO> resultado = service.findAll();
        return new ApiResponse<>(resultado, true, "Listado de usuarios")
                .createResponse();
    }

    // GET /usuario/123456789  (cedula como id)
    @GetMapping("/{cedula}")
    public ResponseEntity<ApiResponse<UsuarioDTO>> findById(@PathVariable Long cedula) {
        UsuarioDTO resultado = service.findById(cedula);
        return new ApiResponse<>(resultado, true, "Usuario encontrado")
                .createResponse();
    }

    // POST /usuario
    @PostMapping
    public ResponseEntity<ApiResponse<UsuarioDTO>> create(@RequestBody UsuarioDTO dto) {
        UsuarioDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Usuario creado exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /usuario/123456789
    @PutMapping("/{cedula}")
    public ResponseEntity<ApiResponse<UsuarioDTO>> update(
            @PathVariable Long cedula,
            @RequestBody UsuarioDTO dto) {
        UsuarioDTO resultado = service.update(cedula, dto);
        return new ApiResponse<>(resultado, true, "Usuario actualizado exitosamente")
                .createResponse();
    }

    // DELETE /usuario/123456789
    @DeleteMapping("/{cedula}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long cedula) {
        service.delete(cedula);
        return new ApiResponse<>(null, true, "Usuario eliminado exitosamente")
                .createResponse();
    }

    // POST /usuario/login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UsuarioDTO>> login(@RequestBody Map<String, String> req) {
        UsuarioDTO resultado = service.login(req.get("correo"), req.get("password"));
        return new ApiResponse<>(resultado, true, "Login exitoso")
                .createResponse();
    }

    // POST /usuario/recuperar  -> envia codigo por email
    @PostMapping("/recuperar")
    public ResponseEntity<ApiResponse<Object>> solicitarRecuperacion(@RequestBody Map<String, String> req) {
        service.solicitarRecuperacion(req.get("correo"));
        return new ApiResponse<>(null, true, "Si el correo existe en el sistema, recibirás un código en breve")
                .createResponse();
    }

    // POST /usuario/reset-password  -> valida codigo y cambia contraseña
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Object>> resetPassword(@RequestBody Map<String, String> req) {
        service.resetPassword(req.get("correo"), req.get("codigo"), req.get("nuevaPassword"));
        return new ApiResponse<>(null, true, "Contraseña actualizada exitosamente")
                .createResponse();
    }
}