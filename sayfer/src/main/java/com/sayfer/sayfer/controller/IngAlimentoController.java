package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.sayfer.sayfer.entity.IngAlimento;
import com.sayfer.sayfer.repository.IngAlimentoRepository;

@RestController
@RequestMapping("/ing-alimento")
public class IngAlimentoController {

    @Autowired
    private IngAlimentoRepository repository;

    @GetMapping
    public List<IngAlimento> listar() {
        return repository.findAll();
    }

    @PostMapping
    public IngAlimento guardar(@RequestBody IngAlimento ingAlimento) {
        return repository.save(ingAlimento);
    }
}