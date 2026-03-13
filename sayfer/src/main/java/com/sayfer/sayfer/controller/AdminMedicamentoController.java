package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.sayfer.sayfer.entity.AdmiMedicamento;
import com.sayfer.sayfer.repository.AdmiMedicamentoRepository;

@RestController
@RequestMapping("/admi-medicamento")
public class AdminMedicamentoController {

    @Autowired
    private AdmiMedicamentoRepository repository;

    @GetMapping
    public List<AdmiMedicamento> listar() {
        return repository.findAll();
    }

    @PostMapping
    public AdmiMedicamento guardar(@RequestBody AdmiMedicamento adminMedicamento) {
        return repository.save(adminMedicamento);
    }
}
