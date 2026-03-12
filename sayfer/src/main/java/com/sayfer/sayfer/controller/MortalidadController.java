package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.sayfer.sayfer.entity.Mortalidad;
import com.sayfer.sayfer.repository.MortalidadRepository;

@RestController
@RequestMapping("/mortalidad")
public class MortalidadController {

    @Autowired
    private MortalidadRepository repository;

    @GetMapping
    public List<Mortalidad> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Mortalidad guardar(@RequestBody Mortalidad mortalidad) {
        return repository.save(mortalidad);
    }
}