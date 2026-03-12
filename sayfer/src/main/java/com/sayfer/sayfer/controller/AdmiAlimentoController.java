package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.sayfer.sayfer.entity.AdmiAlimento;
import com.sayfer.sayfer.repository.AdmiAlimentoRepository;

@RestController
@RequestMapping("/admi-alimento")
public class AdmiAlimentoController {

    @Autowired
    private AdmiAlimentoRepository repository;

    @GetMapping
    public List<AdmiAlimento> listar() {
        return repository.findAll();
    }

    @PostMapping
    public AdmiAlimento guardar(@RequestBody AdmiAlimento admiAlimento) {
        return repository.save(admiAlimento);
    }
}