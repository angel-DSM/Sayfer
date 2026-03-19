package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.dto.MortalidadDTO;
import com.sayfer.sayfer.service.MortalidadService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mortalidad")
public class MortalidadController {

    private final MortalidadService service;

    public MortalidadController(MortalidadService service) {
        this.service = service;
    }

    // GET /mortalidad?page=0&size=10&search=xxx
    @GetMapping
    public ResponseEntity<ApiResponse<Page<MortalidadDTO>>> findAll(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<MortalidadDTO> resultado = service.findAll(pageable, search);
        return new ApiResponse<>(resultado, true, "Listado de mortalidad")
                .createResponse();
    }

    // GET /mortalidad/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MortalidadDTO>> findById(@PathVariable Integer id) {
        MortalidadDTO resultado = service.findById(id);
        return new ApiResponse<>(resultado, true, "Registro de mortalidad encontrado")
                .createResponse();
    }

    // POST /mortalidad
    @PostMapping
    public ResponseEntity<ApiResponse<MortalidadDTO>> create(@RequestBody MortalidadDTO dto) {
        MortalidadDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Registro de mortalidad creado exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /mortalidad/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MortalidadDTO>> update(
            @PathVariable Integer id,
            @RequestBody MortalidadDTO dto) {
        MortalidadDTO resultado = service.update(id, dto);
        return new ApiResponse<>(resultado, true, "Registro de mortalidad actualizado exitosamente")
                .createResponse();
    }

    // DELETE /mortalidad/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Registro de mortalidad eliminado exitosamente")
                .createResponse();
    }
}