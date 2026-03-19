package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.dto.GalponDTO;
import com.sayfer.sayfer.service.GalponService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/galpon")
public class GalponController {

    private final GalponService service;

    public GalponController(GalponService service) {
        this.service = service;
    }

    // GET /galpon?page=0&size=10&search=xxx
    @GetMapping
    public ResponseEntity<ApiResponse<List<GalponDTO>>> findAll() {
        List<GalponDTO> resultado = service.findAll();
        return new ApiResponse<>(resultado, true, "Listado de usuarios")
                .createResponse();
    }

    // GET /galpon/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GalponDTO>> findById(@PathVariable Integer id) {
        GalponDTO resultado = service.findById(id);
        return new ApiResponse<>(resultado, true, "Galpón encontrado")
                .createResponse();
    }

    // POST /galpon
    @PostMapping
    public ResponseEntity<ApiResponse<GalponDTO>> create(@RequestBody GalponDTO dto) {
        GalponDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Galpón creado exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /galpon/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GalponDTO>> update(
            @PathVariable Integer id,
            @RequestBody GalponDTO dto) {
        GalponDTO resultado = service.update(id, dto);
        return new ApiResponse<>(resultado, true, "Galpón actualizado exitosamente")
                .createResponse();
    }

    // DELETE /galpon/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Galpón eliminado exitosamente")
                .createResponse();
    }
}