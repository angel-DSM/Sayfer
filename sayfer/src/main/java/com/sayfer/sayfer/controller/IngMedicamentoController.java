package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.dto.IngMedicamentoDTO;
import com.sayfer.sayfer.service.IngMedicamentoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ing-medicamento")
public class IngMedicamentoController {

    private final IngMedicamentoService service;

    public IngMedicamentoController(IngMedicamentoService service) {
        this.service = service;
    }

    // GET /ing-medicamento?page=0&size=10&search=xxx
    @GetMapping
    public ResponseEntity<ApiResponse<Page<IngMedicamentoDTO>>> findAll(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<IngMedicamentoDTO> resultado = service.findAll(pageable, search);
        return new ApiResponse<>(resultado, true, "Listado de ingresos de medicamento")
                .createResponse();
    }

    // GET /ing-medicamento/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IngMedicamentoDTO>> findById(@PathVariable Integer id) {
        IngMedicamentoDTO resultado = service.findById(id);
        return new ApiResponse<>(resultado, true, "Ingreso de medicamento encontrado")
                .createResponse();
    }

    // POST /ing-medicamento
    @PostMapping
    public ResponseEntity<ApiResponse<IngMedicamentoDTO>> create(@RequestBody IngMedicamentoDTO dto) {
        IngMedicamentoDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Ingreso de medicamento creado exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /ing-medicamento/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<IngMedicamentoDTO>> update(
            @PathVariable Integer id,
            @RequestBody IngMedicamentoDTO dto) {
        IngMedicamentoDTO resultado = service.update(id, dto);
        return new ApiResponse<>(resultado, true, "Ingreso de medicamento actualizado exitosamente")
                .createResponse();
    }

    // DELETE /ing-medicamento/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Ingreso de medicamento eliminado exitosamente")
                .createResponse();
    }
}