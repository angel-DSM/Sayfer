package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.StockAlimentoDTO;
import com.sayfer.sayfer.entity.StockAlimento;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.mapper.StockAlimentoMapper;
import com.sayfer.sayfer.repository.StockAlimentoRepository;
import com.sayfer.sayfer.service.StockAlimentoService;
import com.sayfer.sayfer.validator.StockAlimentoValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;
@Service
@Transactional
public class StockAlimentoServiceImplementation implements StockAlimentoService {

    private final StockAlimentoRepository repository;
    private final StockAlimentoMapper mapper;

    public StockAlimentoServiceImplementation(StockAlimentoRepository repository, StockAlimentoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StockAlimentoDTO> findAll(Pageable pageable, String search) {
        Page<StockAlimento> StockAlimentos;
        if (search == null || search.trim().isEmpty()) {
            StockAlimentos = repository.findAll(pageable);
        } else {
            StockAlimentos = repository.findBycantidadContainingIgnoreCase(pageable, search);
        }
        return new PageImpl<>(
                StockAlimentos.getContent().stream()
                        .map(mapper::toDTO)
                        .collect(Collectors.toList()),
                pageable,
                StockAlimentos.getTotalElements()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public StockAlimentoDTO findById(Integer id) {
        StockAlimento entidad = repository.findById(id)
                .orElseThrow(() -> new NoDataFoundException(
                        "No se encontró Stock de alimento con id: " + id));
        return mapper.toDTO(entidad);
    }

    @Override
    public StockAlimentoDTO create(StockAlimentoDTO obj) {
        StockAlimentoValidator.validate(obj);
        StockAlimento entidad = mapper.toEntity(obj);
        StockAlimento guardado = repository.save(entidad);
        return mapper.toDTO(guardado);
    }

    @Override
    public StockAlimentoDTO update(Integer id, StockAlimentoDTO obj) {
        StockAlimentoValidator.validate(obj);
        repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró Stock de alimento con id: " + id));
        StockAlimento entidad = mapper.toEntity(obj);
        entidad.setId_stock_alimento(id);
        StockAlimento actualizado = repository.save(entidad);
        return mapper.toDTO(actualizado);
    }

    @Override
    public void delete(Integer id) {
        repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró Stock de alimento con id: " + id));
        repository.deleteById(id);
    }
}
