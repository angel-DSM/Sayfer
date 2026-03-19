package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.dto.StockAlimentoDTO;
import com.sayfer.sayfer.service.StockAlimentoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stock-alimento")
public class StockAlimentoController {

    private final StockAlimentoService service;

    public StockAlimentoController(StockAlimentoService service) {
        this.service = service;
    }

    // GET /stock-alimento?page=0&size=10&search=xxx
    @GetMapping
    public ResponseEntity<ApiResponse<Page<StockAlimentoDTO>>> findAll(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<StockAlimentoDTO> resultado = service.findAll(pageable, search);
        return new ApiResponse<>(resultado, true, "Listado de stock de alimento")
                .createResponse();
    }

    // GET /stock-alimento/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StockAlimentoDTO>> findById(@PathVariable Integer id) {
        StockAlimentoDTO resultado = service.findById(id);
        return new ApiResponse<>(resultado, true, "Stock de alimento encontrado")
                .createResponse();
    }

    // POST /stock-alimento
    @PostMapping
    public ResponseEntity<ApiResponse<StockAlimentoDTO>> create(@RequestBody StockAlimentoDTO dto) {
        StockAlimentoDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Stock de alimento creado exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /stock-alimento/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StockAlimentoDTO>> update(
            @PathVariable Integer id,
            @RequestBody StockAlimentoDTO dto) {
        StockAlimentoDTO resultado = service.update(id, dto);
        return new ApiResponse<>(resultado, true, "Stock de alimento actualizado exitosamente")
                .createResponse();
    }

    // DELETE /stock-alimento/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Stock de alimento eliminado exitosamente")
                .createResponse();
    }
}