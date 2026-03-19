package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.dto.TipoAlimentoDTO;
import com.sayfer.sayfer.service.TipoAlimentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tipo-alimento")
public class TipoAlimentoController {

    private final TipoAlimentoService service;

    public TipoAlimentoController(TipoAlimentoService service) {
        this.service = service;
    }

    // GET /tipo-alimento?page=0&size=10&search=xxx
    @GetMapping
    public ResponseEntity<ApiResponse<List<TipoAlimentoDTO>>> findAll() {
        List<TipoAlimentoDTO> resultado = service.findAll();
        return new ApiResponse<>(resultado, true, "Listado de Tipo de alimento")
                .createResponse();
    }

    // GET /tipo-alimento/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TipoAlimentoDTO>> findById(@PathVariable Integer id) {
        TipoAlimentoDTO resultado = service.findById(id);
        return new ApiResponse<>(resultado, true, "Tipo de alimento encontrado")
                .createResponse();
    }

    // POST /tipo-alimento
    @PostMapping
    public ResponseEntity<ApiResponse<TipoAlimentoDTO>> create(@RequestBody TipoAlimentoDTO dto) {
        TipoAlimentoDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Tipo de alimento creado exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /tipo-alimento/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TipoAlimentoDTO>> update(
            @PathVariable Integer id,
            @RequestBody TipoAlimentoDTO dto) {
        TipoAlimentoDTO resultado = service.update(id, dto);
        return new ApiResponse<>(resultado, true, "Tipo de alimento actualizado exitosamente")
                .createResponse();
    }

    // DELETE /tipo-alimento/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Tipo de alimento eliminado exitosamente")
                .createResponse();
    }
}