package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.sayfer.sayfer.entity.IngMedicamento;
import com.sayfer.sayfer.repository.IngMedicamentoRepository;

@RestController
@RequestMapping("/ing-medicamento")
public class IngMedicamentoController {

    @Autowired
    private IngMedicamentoRepository repository;

    @GetMapping
    public List<IngMedicamento> listar() {
        return repository.findAll();
    }

    @PostMapping
    public IngMedicamento guardar(@RequestBody IngMedicamento ingMedicamento) {
        return repository.save(ingMedicamento);
    }
}