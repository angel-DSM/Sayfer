package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.UsuarioDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class UsuarioValidator {
    public static void validate(UsuarioDTO register){

        if(register.getNombre() == null){
            throw new ValidateException("se requiere un nombre");
        }
        if(register.getApellido() == null){
            throw new ValidateException("se requiere un apellido");
        }
        if(register.getCedula() == null){
            throw new ValidateException("se requiere una cedula");
        }
        if(register.getRol() == null){
            throw new ValidateException("se requiere un rol");
        }
        if(register.getCorreo() == null){
            throw new ValidateException("se requiere un correo");
        }
        if(register.getFecha_registro() == null){
            throw new ValidateException("se requiere un fecha de registro");
        }
    }
}