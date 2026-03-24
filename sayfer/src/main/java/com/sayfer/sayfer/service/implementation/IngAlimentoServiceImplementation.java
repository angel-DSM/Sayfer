package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.IngAlimentoDTO;
import com.sayfer.sayfer.entity.IngAlimento;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.mapper.IngAlimentoMapper;
import com.sayfer.sayfer.repository.IngAlimentoRepository;
import com.sayfer.sayfer.service.IngAlimentoService;
import com.sayfer.sayfer.validator.IngAlimentoValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional
public class IngAlimentoServiceImplementation implements IngAlimentoService {

    private final IngAlimentoRepository repository;
    private final IngAlimentoMapper mapper;

    public IngAlimentoServiceImplementation(IngAlimentoRepository repository, IngAlimentoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<IngAlimentoDTO> findAll(Pageable pageable, String search) {
        Page<IngAlimento> ingAlimentos;
        if (search == null || search.trim().isEmpty()) {
            ingAlimentos = repository.findAll(pageable);
        } else {
            ingAlimentos = repository.findByCantidadContainingIgnoreCase(pageable, search);
        }
        return new PageImpl<>(
                ingAlimentos.getContent().stream()
                        .map(mapper::toDTO)
                        .collect(Collectors.toList()),
                pageable,
                ingAlimentos.getTotalElements()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public IngAlimentoDTO findById(Integer id) {
        IngAlimento entidad = repository.findById(id)
                .orElseThrow(() -> new NoDataFoundException(
                        "No se encontró ingreso de alimento con id: " + id));
        return mapper.toDTO(entidad);
    }

    @Override
    public IngAlimentoDTO create(IngAlimentoDTO obj) {
        IngAlimentoValidator.validate(obj);
        IngAlimento entidad = mapper.toEntity(obj);
        IngAlimento guardado = repository.save(entidad);
        return mapper.toDTO(guardado);
    }

    @Override
    public IngAlimentoDTO update(Integer id, IngAlimentoDTO obj) {
        IngAlimentoValidator.validate(obj);
        repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró ingreso de alimento con id: " + id));
        IngAlimento entidad = mapper.toEntity(obj);
        entidad.setId_IngAlimento(id);
        IngAlimento actualizado = repository.save(entidad);
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