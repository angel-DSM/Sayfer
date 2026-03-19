package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.dto.GalponCicloProduccionDTO;
import com.sayfer.sayfer.service.GalponCicloProduccionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/galpon-ciclo-produccion")
public class GalponCicloProduccionController {

    private final GalponCicloProduccionService service;

    public GalponCicloProduccionController(GalponCicloProduccionService service) {
        this.service = service;
    }

    // GET /galpon-ciclo-produccion?page=0&size=10&search=xxx
    @GetMapping
    public ResponseEntity<ApiResponse<List<GalponCicloProduccionDTO>>> findAll() {
        List<GalponCicloProduccionDTO> resultado = service.findAll();
        return new ApiResponse<>(resultado, true, "Listado de Galpón-ciclo")
                .createResponse();
    }

    // GET /galpon-ciclo-produccion/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GalponCicloProduccionDTO>> findById(@PathVariable Integer id) {
        GalponCicloProduccionDTO resultado = service.findById(id);
        return new ApiResponse<>(resultado, true, "Galpón-ciclo de producción encontrado")
                .createResponse();
    }

    // POST /galpon-ciclo-produccion
    @PostMapping
    public ResponseEntity<ApiResponse<GalponCicloProduccionDTO>> create(@RequestBody GalponCicloProduccionDTO dto) {
        GalponCicloProduccionDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Galpón-ciclo de producción creado exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /galpon-ciclo-produccion/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GalponCicloProduccionDTO>> update(
            @PathVariable Integer id,
            @RequestBody GalponCicloProduccionDTO dto) {
        GalponCicloProduccionDTO resultado = service.update(id, dto);
        return new ApiResponse<>(resultado, true, "Galpón-ciclo de producción actualizado exitosamente")
                .createResponse();
    }

    // DELETE /galpon-ciclo-produccion/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Galpón-ciclo de producción eliminado exitosamente")
                .createResponse();
    }
}