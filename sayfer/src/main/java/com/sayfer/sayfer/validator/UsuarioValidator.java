package com.sayfer.sayfer.validator;

import com.sayfer.sayfer.dto.StockAlimentoDTO;
import com.sayfer.sayfer.dto.UsuarioDTO;
import com.sayfer.sayfer.exeption.ValidateException;

public class UsuarioValidator {
    public static void validate(UsuarioDTO register){

        if(register.getNombre() == null){
            throw new ValidateException("se requiere una cantidad");
        }
        if(register.getApellido() == null){
            throw new ValidateException("se requiere una unidad");
        }
        if(register.getCedula() == null){
            throw new ValidateException("se requiere un alimento");
        }
        if(register.getRol() == null){
            throw new ValidateException("se requiere un alimento");
        }
        if(register.getCorreo() == null){
            throw new ValidateException("se requiere un alimento");
        }
        if(register.getPassword() == null){
            throw new ValidateException("se requiere un alimento");
        }
        if(register.getFecha_registro() == null){
            throw new ValidateException("se requiere un alimento");
        }
    }
}