package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.AdmiAlimentoDTO;
import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.service.AdmiAlimentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admi-alimento")
public class AdmiAlimentoController {

    private final AdmiAlimentoService service;

    public AdmiAlimentoController(AdmiAlimentoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdmiAlimentoDTO>>> findAll() {
        List<AdmiAlimentoDTO> resultado = service.findAll();
        return new ApiResponse<>(resultado, true, "Listado de administracion de alimentos")
                .createResponse();
    }

    // GET /admi-alimento/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdmiAlimentoDTO>> findById(@PathVariable Integer id) {
        AdmiAlimentoDTO resultado = service.findById(id);
        return new ApiResponse<>(resultado, true, "Administración de alimento encontrada")
                .createResponse();
    }

    // POST /admi-alimento
    @PostMapping
    public ResponseEntity<ApiResponse<AdmiAlimentoDTO>> create(@RequestBody AdmiAlimentoDTO dto) {
        AdmiAlimentoDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Administración de alimento creada exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /admi-alimento/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdmiAlimentoDTO>> update(
            @PathVariable Integer id,
            @RequestBody AdmiAlimentoDTO dto) {
        AdmiAlimentoDTO resultado = service.update(id, dto);
        return new ApiResponse<>(resultado, true, "Administración de alimento actualizada exitosamente")
                .createResponse();
    }

    // DELETE /admi-alimento/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Administración de alimento eliminada exitosamente")
                .createResponse();
    }
}