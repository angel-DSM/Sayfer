package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.sayfer.sayfer.entity.Galpon;
import com.sayfer.sayfer.repository.GalponRepository;

@RestController
@RequestMapping("/galpon")
public class GalponController {

    @Autowired
    private GalponRepository repository;

    @GetMapping
    public List<Galpon> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Galpon guardar(@RequestBody Galpon galpon) {
        return repository.save(galpon);
    }
}