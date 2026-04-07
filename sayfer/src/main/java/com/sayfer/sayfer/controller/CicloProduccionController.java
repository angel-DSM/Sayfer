package com.sayfer.sayfer.controller;

import com.sayfer.sayfer.dto.ApiResponse;
import com.sayfer.sayfer.dto.CicloProduccionDTO;
import com.sayfer.sayfer.dto.GalponDTO;
import com.sayfer.sayfer.service.CicloProduccionService;
import com.sayfer.sayfer.service.GalponService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ciclo-produccion")
public class CicloProduccionController {

    private final CicloProduccionService service;
    private final GalponService          galponService;

    public CicloProduccionController(CicloProduccionService service,
                                     GalponService galponService) {
        this.service      = service;
        this.galponService = galponService;
    }

    // GET /ciclo-produccion  → lista todos los ciclos (incluye nombre del galpón via DTO)
    @GetMapping
    public ResponseEntity<ApiResponse<List<CicloProduccionDTO>>> findAll() {
        return new ApiResponse<>(service.findAll(), true, "Listado de ciclos de producción")
                .createResponse();
    }

    // GET /ciclo-produccion/1
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CicloProduccionDTO>> findById(@PathVariable Integer id) {
        return new ApiResponse<>(service.findById(id), true, "Ciclo encontrado")
                .createResponse();
    }

    // GET /ciclo-produccion/galpones  → lista de galpones para llenar el <select>
    @GetMapping("/galpones")
    public ResponseEntity<ApiResponse<List<GalponDTO>>> getGalpones() {
        return new ApiResponse<>(galponService.findAll(), true, "Galpones disponibles")
                .createResponse();
    }

    // POST /ciclo-produccion
    @PostMapping
    public ResponseEntity<ApiResponse<CicloProduccionDTO>> create(
            @RequestBody CicloProduccionDTO dto) {
        return new ApiResponse<>(service.create(dto), true, "Ciclo creado exitosamente")
                .createResponse(HttpStatus.CREATED);
    }

    // PUT /ciclo-produccion/1  → protegido: solo rol ADMIN
    // El frontend envía el header  X-User-Rol: admin
    @PutMapping("/{id}")
    public ResponseEntity<? extends ApiResponse<? extends Object>> update(
            @PathVariable Integer id,
            @RequestBody CicloProduccionDTO dto,
            @RequestHeader(value = "X-User-Rol", defaultValue = "") String rol) {

        if (!"admin".equalsIgnoreCase(rol)) {
            return new ApiResponse<>(null, false, "Acceso denegado: se requiere rol ADMIN")
                    .createResponse(HttpStatus.FORBIDDEN);
        }
        return new ApiResponse<>(service.update(id, dto), true, "Ciclo actualizado exitosamente")
                .createResponse();
    }

    // DELETE /ciclo-produccion/1
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Integer id) {
        service.delete(id);
        return new ApiResponse<>(null, true, "Ciclo eliminado exitosamente")
                .createResponse();
    }
}