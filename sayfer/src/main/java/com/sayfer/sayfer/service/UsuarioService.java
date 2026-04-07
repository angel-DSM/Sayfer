package com.sayfer.sayfer.service;

import com.sayfer.sayfer.dto.UsuarioDTO;

public interface UsuarioService extends CrudService<UsuarioDTO, Long>{
    UsuarioDTO login(String correo, String password);
    void solicitarRecuperacion(String correo);
    void resetPassword(String correo, String codigo, String nuevaPassword);
}
