package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.IngMedicamentoDTO;
import com.sayfer.sayfer.entity.IngMedicamento;
import com.sayfer.sayfer.mapper.IngMedicamentoMapper;
import com.sayfer.sayfer.repository.IngMedicamentoRepository;
import com.sayfer.sayfer.service.IngMedicamentoService;
import com.sayfer.sayfer.validator.IngMedicamentoValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
public class IngMedicamentoServiceImplementation implements IngMedicamentoService {

    private final IngMedicamentoRepository repository;
    private final IngMedicamentoMapper mapper;

    public IngMedicamentoServiceImplementation(IngMedicamentoRepository repository, IngMedicamentoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Page<IngMedicamentoDTO> findAll(Pageable pageable, String search) {
        Page<IngMedicamento> IngMedicamentos;
        if (search == null || search.trim().isEmpty()) {
            IngMedicamentos = repository.findAll(pageable);
        } else {
            IngMedicamentos = repository.findBycantidadContainingIgnoreCase(pageable, search);
        }
        return new PageImpl<>(
                IngMedicamentos.getContent().stream()
                        .map(mapper::toDTO)
                        .collect(Collectors.toList()),
                pageable,
                IngMedicamentos.getTotalElements()
        );
    }

    @Override
    public IngMedicamentoDTO findById(Integer id) {
        IngMedicamento entidad = repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró ingreso de alimento con id: " + id));
        return mapper.toDTO(entidad);
    }

    @Override
    public IngMedicamentoDTO create(IngMedicamentoDTO obj) {
        IngMedicamentoValidator.validate(obj);
        IngMedicamento entidad = mapper.toEntity(obj);
        IngMedicamento guardado = repository.save(entidad);
        return mapper.toDTO(guardado);
    }

    @Override
    public IngMedicamentoDTO update(Integer id, IngMedicamentoDTO obj) {
        IngMedicamentoValidator.validate(obj);
        repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró ingreso de alimento con id: " + id));
        IngMedicamento entidad = mapper.toEntity(obj);
        entidad.setIng_medicamento(id);
        IngMedicamento actualizado = repository.save(entidad);
        return mapper.toDTO(actualizado);
    }

    @Override
    public void delete(Integer id) {
        repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró ingreso de alimento con id: " + id));
        repository.deleteById(id);
    }
}