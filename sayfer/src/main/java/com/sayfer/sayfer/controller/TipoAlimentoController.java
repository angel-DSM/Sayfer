package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.sayfer.sayfer.entity.TipoAlimento;
import com.sayfer.sayfer.repository.TipoAlimentoRepository;

@RestController
@RequestMapping("/tipo-alimento")
public class TipoAlimentoController {

    @Autowired
    private TipoAlimentoRepository repository;

    @GetMapping
    public List<TipoAlimento> listar() {
        return repository.findAll();
    }

    @PostMapping
    public TipoAlimento guardar(@RequestBody TipoAlimento tipoAlimento) {
        return repository.save(tipoAlimento);
    }
}