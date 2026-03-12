package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.sayfer.sayfer.entity.TipoMedicamento;
import com.sayfer.sayfer.repository.TipoMedicamentoRepository;

@RestController
@RequestMapping("/tipo-medicamento")
public class TipoMedicamentoController {

    @Autowired
    private TipoMedicamentoRepository repository;

    @GetMapping
    public List<TipoMedicamento> listar() {
        return repository.findAll();
    }

    @PostMapping
    public TipoMedicamento guardar(@RequestBody TipoMedicamento tipoMedicamento) {
        return repository.save(tipoMedicamento);
    }
}