package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.MortalidadDTO;
import com.sayfer.sayfer.entity.Mortalidad;
import com.sayfer.sayfer.mapper.MortalidadMapper;
import com.sayfer.sayfer.repository.MortalidadRepository;
import com.sayfer.sayfer.service.MortalidadService;
import com.sayfer.sayfer.validator.MortalidadValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class MortalidadServiceImplementation implements MortalidadService {
    private final MortalidadRepository repository;
    private final MortalidadMapper mapper;

    public MortalidadServiceImplementation(MortalidadRepository repository, MortalidadMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Page<MortalidadDTO> findAll(Pageable pageable, String search) {
        Page<Mortalidad> Mortalidads;
        if (search == null || search.trim().isEmpty()) {
            Mortalidads = repository.findAll(pageable);
        } else {
            Mortalidads = repository.findBycantidad_muertosContainingIgnoreCase(pageable, search);
        }
        return new PageImpl<>(
                Mortalidads.getContent().stream()
                        .map(mapper::toDTO)
                        .collect(Collectors.toList()),
                pageable,
                Mortalidads.getTotalElements()
        );
    }

    @Override
    public MortalidadDTO findById(Integer id) {
        Mortalidad entidad = repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró ingreso de alimento con id: " + id));
        return mapper.toDTO(entidad);
    }

    @Override
    public MortalidadDTO create(MortalidadDTO obj) {
        MortalidadValidator.validate(obj);
        Mortalidad entidad = mapper.toEntity(obj);
        Mortalidad guardado = repository.save(entidad);
        return mapper.toDTO(guardado);
    }

    @Override
    public MortalidadDTO update(Integer id, MortalidadDTO obj) {
        MortalidadValidator.validate(obj);
        repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró ingreso de alimento con id: " + id));
        Mortalidad entidad = mapper.toEntity(obj);
        entidad.setId_Mortalidad(id);
        Mortalidad actualizado = repository.save(entidad);
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