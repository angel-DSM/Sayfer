package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.dto.CicloProduccionDTO;
import com.sayfer.sayfer.service.CicloProduccionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ciclo-produccion")
public class CicloProduccionController {

    private final CicloProduccionService service;

    public CicloProduccionController(CicloProduccionService service) {
        this.service = service;
    }

    // GET /ciclo-produccion?page=0&size=10&search=xxx
    @GetMapping
    public ResponseEntity<ApiResponse<List<CicloProduccionDTO>>> findAll() {
        List<CicloProduccionDTO> resultado = service.findAll();
        return new ApiResponse<>(resultado, true, "Listado de usuarios")
                .createResponse();
    }

    // GET /ciclo-produccion/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CicloProduccionDTO>> findById(@PathVariable Integer id) {
        CicloProduccionDTO resultado = service.findById(id);
        return new ApiResponse<>(resultado, true, "Ciclo de producción encontrado")
                .createResponse();
    }

    // POST /ciclo-produccion
    @PostMapping
    public ResponseEntity<ApiResponse<CicloProduccionDTO>> create(@RequestBody CicloProduccionDTO dto) {
        CicloProduccionDTO resultado = service.create(dto);
        return new ApiResponse<>(resultado, true, "Ciclo de producción creado exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /ciclo-produccion/1
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CicloProduccionDTO>> update(
            @PathVariable Integer id,
            @RequestBody CicloProduccionDTO dto) {
        CicloProduccionDTO resultado = service.update(id, dto);
        return new ApiResponse<>(resultado, true, "Ciclo de producción actualizado exitosamente")
                .createResponse();
    }

    // DELETE /ciclo-produccion/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Ciclo de producción eliminado exitosamente")
                .createResponse();
    }
}