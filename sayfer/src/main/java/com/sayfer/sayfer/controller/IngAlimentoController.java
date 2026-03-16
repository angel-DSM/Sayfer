package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.dto.IngAlimentoDTO;
import com.sayfer.sayfer.service.IngAlimentoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ing-alimento")
public class IngAlimentoController {

    private final IngAlimentoService service;

    public IngAlimentoController(IngAlimentoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<IngAlimentoDTO>>> findAll(
            Pageable pageable,
            @RequestParam(required = false) String search) {

        Page<IngAlimentoDTO> resultado = service.findAll(pageable, search);
        return new ApiResponse<>(resultado, true, "Listado de ingresos de alimento")
                .createResponse();
    }

    // GET /ing-alimento/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IngAlimentoDTO>> findById(@PathVariable Integer id) {
        IngAlimentoDTO resultado = service.findById(id);
        return new ApiResponse<>(resultado, true, "Ingreso de alimento encontrado")
                .createResponse();
    }

    // POST /ing-alimento
    @PostMapping
    public ResponseEntity<ApiResponse<IngAlimentoDTO>> create(@RequestBody IngAlimentoDTO dto) {
        IngAlimentoDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Ingreso de alimento creado exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /ing-alimento/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<IngAlimentoDTO>> update(
            @PathVariable Integer id,
            @RequestBody IngAlimentoDTO dto) {

        IngAlimentoDTO resultado = service.update(id, dto);
        return new ApiResponse<>(resultado, true, "Ingreso de alimento actualizado exitosamente")
                .createResponse();
    }

    // DELETE /ing-alimento/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Ingreso de alimento eliminado exitosamente")
                .createResponse();
    }
}