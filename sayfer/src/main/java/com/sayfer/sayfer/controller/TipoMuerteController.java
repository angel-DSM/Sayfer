package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.dto.TipoMuerteDTO;
import com.sayfer.sayfer.service.TipoMuerteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tipo-muerte")
public class TipoMuerteController {

    private final TipoMuerteService service;

    public TipoMuerteController(TipoMuerteService service) {
        this.service = service;
    }

    // GET /tipo-muerte?page=0&size=10&search=xxx
    @GetMapping
    public ResponseEntity<ApiResponse<List<TipoMuerteDTO>>> findAll() {
        List<TipoMuerteDTO> resultado = service.findAll();
        return new ApiResponse<>(resultado, true, "Listado de Tipo de muerte")
                .createResponse();
    }

    // GET /tipo-muerte/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TipoMuerteDTO>> findById(@PathVariable Integer id) {
        TipoMuerteDTO resultado = service.findById(id);
        return new ApiResponse<>(resultado, true, "Tipo de muerte encontrado")
                .createResponse();
    }

    // POST /tipo-muerte
    @PostMapping
    public ResponseEntity<ApiResponse<TipoMuerteDTO>> create(@RequestBody TipoMuerteDTO dto) {
        TipoMuerteDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Tipo de muerte creado exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /tipo-muerte/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TipoMuerteDTO>> update(
            @PathVariable Integer id,
            @RequestBody TipoMuerteDTO dto) {
        TipoMuerteDTO resultado = service.update(id, dto);
        return new ApiResponse<>(resultado, true, "Tipo de muerte actualizado exitosamente")
                .createResponse();
    }

    // DELETE /tipo-muerte/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Tipo de muerte eliminado exitosamente")
                .createResponse();
    }
}