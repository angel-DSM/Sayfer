package com.sayfer.sayfer.repository;

import com.sayfer.sayfer.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
