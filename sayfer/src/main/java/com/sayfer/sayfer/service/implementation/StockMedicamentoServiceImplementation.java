package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.StockMedicamentoDTO;
import com.sayfer.sayfer.entity.StockMedicamento;
import com.sayfer.sayfer.mapper.StockMedicamentoMapper;
import com.sayfer.sayfer.repository.StockMedicamentoRepository;
import com.sayfer.sayfer.service.StockMedicamentoService;
import com.sayfer.sayfer.validator.StockMedicamentoValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.stream.Collectors;

public class StockMedicamentoServiceImplementation implements StockMedicamentoService {
    private final StockMedicamentoRepository repository;
    private final StockMedicamentoMapper mapper;

    public StockMedicamentoServiceImplementation(StockMedicamentoRepository repository, StockMedicamentoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Page<StockMedicamentoDTO> findAll(Pageable pageable, String search) {
        Page<StockMedicamento> StockMedicamentos;
        if (search == null || search.trim().isEmpty()) {
            StockMedicamentos = repository.findAll(pageable);
        } else {
            StockMedicamentos = repository.findBycantidadActualContainingIgnoreCase(pageable, search);
        }
        return new PageImpl<>(
                StockMedicamentos.getContent().stream()
                        .map(mapper::toDTO)
                        .collect(Collectors.toList()),
                pageable,
                StockMedicamentos.getTotalElements()
        );
    }

    @Override
    public StockMedicamentoDTO findById(Integer id) {
        StockMedicamento entidad = repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró Stock de medicamento con id: " + id));
        return mapper.toDTO(entidad);
    }

    @Override
    public StockMedicamentoDTO create(StockMedicamentoDTO obj) {
        StockMedicamentoValidator.validate(obj);
        StockMedicamento entidad = mapper.toEntity(obj);
        StockMedicamento guardado = repository.save(entidad);
        return mapper.toDTO(guardado);
    }

    @Override
    public StockMedicamentoDTO update(Integer id, StockMedicamentoDTO obj) {
        StockMedicamentoValidator.validate(obj);
        repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró Stock de medicamento con id: " + id));
        StockMedicamento entidad = mapper.toEntity(obj);
        entidad.setId_stock_medicamento(id);
        StockMedicamento actualizado = repository.save(entidad);
        return mapper.toDTO(actualizado);
    }

    @Override
    public void delete(Integer id) {
        repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró Stock de medicamento con id: " + id));
        repository.deleteById(id);
    }
}
