package com.sayfer.sayfer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.sayfer.sayfer.entity.TipoMuerte;
import com.sayfer.sayfer.repository.TipoMuerteRepository;

@RestController
@RequestMapping("/tipo-muerte")
public class TipoMuerteController {

    @Autowired
    private TipoMuerteRepository repository;

    @GetMapping
    public List<TipoMuerte> listar() {
        return repository.findAll();
    }

    @PostMapping
    public TipoMuerte guardar(@RequestBody TipoMuerte tipoMuerte) {
        return repository.save(tipoMuerte);
    }
}