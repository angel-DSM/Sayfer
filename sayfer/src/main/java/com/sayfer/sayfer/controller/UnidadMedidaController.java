package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.sayfer.sayfer.entity.UnidadMedida;
import com.sayfer.sayfer.repository.UnidadMedidaRepository;

@RestController
@RequestMapping("/unidad-medida")
public class UnidadMedidaController {

    @Autowired
    private UnidadMedidaRepository repository;

    @GetMapping
    public List<UnidadMedida> listar() {
        return repository.findAll();
    }

    @PostMapping
    public UnidadMedida guardar(@RequestBody UnidadMedida unidadMedida) {
        return repository.save(unidadMedida);
    }
}