package com.sayfer.sayfer.config;

import com.sayfer.sayfer.entity.Usuario;
import com.sayfer.sayfer.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository repository;

    public DataInitializer(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            repository.save(Usuario.builder()
                    .cedula(1000000000L)
                    .nombre("Admin")
                    .apellido("Sayfer")
                    .correo("admin@sayfer.com")
                    .password("admin123")
                    .rol("admin")
                    .fecha_registro(LocalDate.now())
                    .estado(true)
                    .build());

            repository.save(Usuario.builder()
                    .cedula(2000000000L)
                    .nombre("Trabajador")
                    .apellido("Sayfer")
                    .correo("trabajador@sayfer.com")
                    .password("trabajador123")
                    .rol("trabajador")
                    .fecha_registro(LocalDate.now())
                    .estado(true)
                    .build());
        }
    }
}
