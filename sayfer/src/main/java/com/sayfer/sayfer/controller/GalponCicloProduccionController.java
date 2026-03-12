package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.sayfer.sayfer.entity.GalponCicloProduccion;
import com.sayfer.sayfer.repository.GalponCicloProduccionRepository;

@RestController
@RequestMapping("/galpon-ciclo-produccion")
public class GalponCicloProduccionController {

    @Autowired
    private GalponCicloProduccionRepository repository;

    @GetMapping
    public List<GalponCicloProduccion> listar() {
        return repository.findAll();
    }

    @PostMapping
    public GalponCicloProduccion guardar(@RequestBody GalponCicloProduccion galponCicloProduccion) {
        return repository.save(galponCicloProduccion);
    }
}