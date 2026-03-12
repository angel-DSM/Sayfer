package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.sayfer.sayfer.entity.CicloProduccion;
import com.sayfer.sayfer.repository.CicloProduccionRepository;

@RestController
@RequestMapping("/ciclo-produccion")
public class CicloProduccionController {

    @Autowired
    private CicloProduccionRepository repository;

    @GetMapping
    public List<CicloProduccion> listar() {
        return repository.findAll();
    }

    @PostMapping
    public CicloProduccion guardar(@RequestBody CicloProduccion cicloProduccion) {
        return repository.save(cicloProduccion);
    }
}