package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.dto.StockMedicamentoDTO;
import com.sayfer.sayfer.service.StockMedicamentoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stock-medicamento")
public class StockMedicamentoController {

    private final StockMedicamentoService service;

    public StockMedicamentoController(StockMedicamentoService service) {
        this.service = service;
    }

    // GET /stock-medicamento?page=0&size=10&search=xxx
    @GetMapping
    public ResponseEntity<ApiResponse<Page<StockMedicamentoDTO>>> findAll(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<StockMedicamentoDTO> resultado = service.findAll(pageable, search);
        return new ApiResponse<>(resultado, true, "Listado de stock de medicamento")
                .createResponse();
    }

    // GET /stock-medicamento/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StockMedicamentoDTO>> findById(@PathVariable Integer id) {
        StockMedicamentoDTO resultado = service.findById(id);
        return new ApiResponse<>(resultado, true, "Stock de medicamento encontrado")
                .createResponse();
    }

    // POST /stock-medicamento
    @PostMapping
    public ResponseEntity<ApiResponse<StockMedicamentoDTO>> create(@RequestBody StockMedicamentoDTO dto) {
        StockMedicamentoDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Stock de medicamento creado exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /stock-medicamento/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StockMedicamentoDTO>> update(
            @PathVariable Integer id,
            @RequestBody StockMedicamentoDTO dto) {
        StockMedicamentoDTO resultado = service.update(id, dto);
        return new ApiResponse<>(resultado, true, "Stock de medicamento actualizado exitosamente")
                .createResponse();
    }

    // DELETE /stock-medicamento/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Stock de medicamento eliminado exitosamente")
                .createResponse();
    }
}