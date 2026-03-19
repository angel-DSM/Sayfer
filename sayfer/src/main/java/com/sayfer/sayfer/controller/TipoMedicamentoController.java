package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.dto.TipoMedicamentoDTO;
import com.sayfer.sayfer.service.TipoMedicamentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tipo-medicamento")
public class TipoMedicamentoController {

    private final TipoMedicamentoService service;

    public TipoMedicamentoController(TipoMedicamentoService service) {
        this.service = service;
    }

    // GET /tipo-medicamento?page=0&size=10&search=xxx
    @GetMapping
    public ResponseEntity<ApiResponse<List<TipoMedicamentoDTO>>> findAll() {
        List<TipoMedicamentoDTO> resultado = service.findAll();
        return new ApiResponse<>(resultado, true, "Listado de Tipo de medicamento")
                .createResponse();
    }

    // GET /tipo-medicamento/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TipoMedicamentoDTO>> findById(@PathVariable Integer id) {
        TipoMedicamentoDTO resultado = service.findById(id);
        return new ApiResponse<>(resultado, true, "Tipo de medicamento encontrado")
                .createResponse();
    }

    // POST /tipo-medicamento
    @PostMapping
    public ResponseEntity<ApiResponse<TipoMedicamentoDTO>> create(@RequestBody TipoMedicamentoDTO dto) {
        TipoMedicamentoDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Tipo de medicamento creado exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /tipo-medicamento/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TipoMedicamentoDTO>> update(
            @PathVariable Integer id,
            @RequestBody TipoMedicamentoDTO dto) {
        TipoMedicamentoDTO resultado = service.update(id, dto);
        return new ApiResponse<>(resultado, true, "Tipo de medicamento actualizado exitosamente")
                .createResponse();
    }

    // DELETE /tipo-medicamento/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Tipo de medicamento eliminado exitosamente")
                .createResponse();
    }
}