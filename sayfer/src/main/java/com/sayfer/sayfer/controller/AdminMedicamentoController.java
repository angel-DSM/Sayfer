package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.AdmiMedicamentoDTO;
import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.service.AdminMedicamentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admi-medicamento")
public class AdminMedicamentoController {

    private final AdminMedicamentoService service;

    public AdminMedicamentoController(AdminMedicamentoService service) {
        this.service = service;
    }

    // GET /admi-medicamento?page=0&size=10&search=xxx
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdmiMedicamentoDTO>>> findAll() {
        List<AdmiMedicamentoDTO> resultado = service.findAll();
        return new ApiResponse<>(resultado, true, "Listado de usuarios")
                .createResponse();
    }

    // GET /admi-medicamento/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdmiMedicamentoDTO>> findById(@PathVariable Integer id) {
        AdmiMedicamentoDTO resultado = service.findById(id);
        return new ApiResponse<>(resultado, true, "Administración de medicamento encontrada")
                .createResponse();
    }

    // POST /admi-medicamento
    @PostMapping
    public ResponseEntity<ApiResponse<AdmiMedicamentoDTO>> create(@RequestBody AdmiMedicamentoDTO dto) {
        AdmiMedicamentoDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Administración de medicamento creada exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /admi-medicamento/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdmiMedicamentoDTO>> update(
            @PathVariable Integer id,
            @RequestBody AdmiMedicamentoDTO dto) {
        AdmiMedicamentoDTO resultado = service.update(id, dto);
        return new ApiResponse<>(resultado, true, "Administración de medicamento actualizada exitosamente")
                .createResponse();
    }

    // DELETE /admi-medicamento/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Administración de medicamento eliminada exitosamente")
                .createResponse();
    }
}