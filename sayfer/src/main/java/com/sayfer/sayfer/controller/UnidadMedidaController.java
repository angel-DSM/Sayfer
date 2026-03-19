package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.dto.UnidadMedidaDTO;
import com.sayfer.sayfer.service.UnidadMedidaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/unidad-medida")
public class UnidadMedidaController {

    private final UnidadMedidaService service;

    public UnidadMedidaController(UnidadMedidaService service) {
        this.service = service;
    }

    // GET /unidad-medida?page=0&size=10&search=xxx
    @GetMapping
    public ResponseEntity<ApiResponse<List<UnidadMedidaDTO>>> findAll() {
        List<UnidadMedidaDTO> resultado = service.findAll();
        return new ApiResponse<>(resultado, true, "Listado de usuarios")
                .createResponse();
    }

    // GET /unidad-medida/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UnidadMedidaDTO>> findById(@PathVariable Integer id) {
        UnidadMedidaDTO resultado = service.findById(id);
        return new ApiResponse<>(resultado, true, "Unidad de medida encontrada")
                .createResponse();
    }

    // POST /unidad-medida
    @PostMapping
    public ResponseEntity<ApiResponse<UnidadMedidaDTO>> create(@RequestBody UnidadMedidaDTO dto) {
        UnidadMedidaDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Unidad de medida creada exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /unidad-medida/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UnidadMedidaDTO>> update(
            @PathVariable Integer id,
            @RequestBody UnidadMedidaDTO dto) {
        UnidadMedidaDTO resultado = service.update(id, dto);
        return new ApiResponse<>(resultado, true, "Unidad de medida actualizada exitosamente")
                .createResponse();
    }

    // DELETE /unidad-medida/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Unidad de medida eliminada exitosamente")
                .createResponse();
    }
}