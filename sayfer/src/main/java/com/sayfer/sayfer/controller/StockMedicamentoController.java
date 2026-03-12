package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.sayfer.sayfer.entity.StockMedicamento;
import com.sayfer.sayfer.repository.StockMedicamentoRepository;

@RestController
@RequestMapping("/stock-medicamento")
public class StockMedicamentoController {

    @Autowired
    private StockMedicamentoRepository repository;

    @GetMapping
    public List<StockMedicamento> listar() {
        return repository.findAll();
    }

    @PostMapping
    public StockMedicamento guardar(@RequestBody StockMedicamento stockMedicamento) {
        return repository.save(stockMedicamento);
    }
}