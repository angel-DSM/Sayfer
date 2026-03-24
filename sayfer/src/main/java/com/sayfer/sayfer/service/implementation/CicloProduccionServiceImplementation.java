package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.CicloProduccionDTO;
import com.sayfer.sayfer.entity.CicloProduccion;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.mapper.CicloProduccionMapper;
import com.sayfer.sayfer.repository.CicloProduccionRepository;
import com.sayfer.sayfer.service.CicloProduccionService;
import com.sayfer.sayfer.validator.CicloProduccionValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CicloProduccionServiceImplementation implements CicloProduccionService {

    private final CicloProduccionRepository repository;
    private final CicloProduccionMapper     mapper;

    public CicloProduccionServiceImplementation(CicloProduccionRepository repository,
                                                CicloProduccionMapper mapper) {
        this.repository = repository;
        this.mapper     = mapper;
    }

    // ── Calcula duración en días ──────────────────────────────
    private void calcularDuracion(CicloProduccionDTO dto) {
        if (dto.getFecha_inicio() != null && dto.getFecha_fin() != null) {
            long dias = ChronoUnit.DAYS.between(dto.getFecha_inicio(), dto.getFecha_fin());
            dto.setDuracion((int) dias);
        } else {
            // Ciclo en curso: duración desde inicio hasta hoy
            if (dto.getFecha_inicio() != null) {
                long dias = ChronoUnit.DAYS.between(dto.getFecha_inicio(),
                        java.time.LocalDate.now());
                dto.setDuracion((int) dias);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CicloProduccionDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CicloProduccionDTO findById(Integer id) {
        CicloProduccion entidad = repository.findById(id)
                .orElseThrow(() -> new NoDataFoundException(
                        "Ciclo con ID " + id + " no encontrado"));
        return mapper.toDTO(entidad);
    }

    @Override
    public CicloProduccionDTO create(CicloProduccionDTO dto) {
        CicloProduccionValidator.validate(dto);
        calcularDuracion(dto);                          // ← calcula duración antes de guardar
        CicloProduccion entidad = mapper.toEntity(dto);
        CicloProduccion saved   = repository.save(entidad);
        return mapper.toDTO(saved);
    }

    @Override
    public CicloProduccionDTO update(Integer id, CicloProduccionDTO dto) {
        CicloProduccionValidator.validate(dto);
        if (!repository.existsById(id)) {
            throw new NoDataFoundException(
                    "No se puede actualizar: no existe el ciclo con ID " + id);
        }
        calcularDuracion(dto);                          // ← recalcula duración al editar
        CicloProduccion entidad = mapper.toEntity(dto);
        entidad.setId(id);
        CicloProduccion saved = repository.save(entidad);
        return mapper.toDTO(saved);
    }

    @Override
    public void delete(Integer id) {
        CicloProduccion entidad = repository.findById(id)
                .orElseThrow(() -> new NoDataFoundException(
                        "No existe el ciclo con ID " + id));
        repository.delete(entidad);
    }
}