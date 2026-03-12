package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.sayfer.sayfer.entity.AdminMedicamento;
import com.sayfer.sayfer.repository.AdminMedicamentoRepository;

@RestController
@RequestMapping("/admi-medicamento")
public class AdminMedicamentoController {

    @Autowired
    private AdminMedicamentoRepository repository;

    @GetMapping
    public List<AdminMedicamento> listar() {
        return repository.findAll();
    }

    @PostMapping
    public AdminMedicamento guardar(@RequestBody AdminMedicamento adminMedicamento) {
        return repository.save(adminMedicamento);
    }
}
