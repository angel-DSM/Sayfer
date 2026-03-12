package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.sayfer.sayfer.entity.StockAlimento;
import com.sayfer.sayfer.repository.StockAlimentoRepository;

@RestController
@RequestMapping("/stock-alimento")
public class StockAlimentoController {

    @Autowired
    private StockAlimentoRepository repository;

    @GetMapping
    public List<StockAlimento> listar() {
        return repository.findAll();
    }

    @PostMapping
    public StockAlimento guardar(@RequestBody StockAlimento stockAlimento) {
        return repository.save(stockAlimento);
    }
}