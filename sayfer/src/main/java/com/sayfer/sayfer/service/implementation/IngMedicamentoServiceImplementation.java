package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.IngMedicamentoDTO;
import com.sayfer.sayfer.entity.IngMedicamento;
import com.sayfer.sayfer.entity.StockMedicamento;
import com.sayfer.sayfer.entity.TipoMedicamento;
import com.sayfer.sayfer.repository.StockMedicamentoRepository;
import java.math.BigDecimal;
import java.util.Optional;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.mapper.IngMedicamentoMapper;
import com.sayfer.sayfer.repository.IngMedicamentoRepository;
import com.sayfer.sayfer.service.IngMedicamentoService;
import com.sayfer.sayfer.validator.IngMedicamentoValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional
public class IngMedicamentoServiceImplementation implements IngMedicamentoService {

    private final IngMedicamentoRepository repository;
    private final IngMedicamentoMapper mapper;
    private final StockMedicamentoRepository stockRepository;

    public IngMedicamentoServiceImplementation(IngMedicamentoRepository repository, IngMedicamentoMapper mapper, StockMedicamentoRepository stockRepository) {
        this.repository = repository;
        this.mapper = mapper;
        this.stockRepository = stockRepository;
    }

    @Override
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
    public IngMedicamentoDTO findById(Integer id) {
        IngMedicamento entidad = repository.findById(id)
                .orElseThrow(() -> new NoDataFoundException(
                        "No se encontró ingreso de medicina con id: " + id));
        return mapper.toDTO(entidad);
    }

    @Override
    public IngMedicamentoDTO create(IngMedicamentoDTO obj) {
        IngMedicamentoValidator.validate(obj);
        IngMedicamento entidad = mapper.toEntity(obj);
        IngMedicamento guardado = repository.save(entidad);

        TipoMedicamento tipo = guardado.getId_tipo_medicamento();
        if (tipo != null && obj.getCantidad() != null) {
            BigDecimal cantidadNueva = BigDecimal.valueOf(obj.getCantidad());
            Optional<StockMedicamento> stockOpt = stockRepository.findByIdTipoMedicamento(tipo);
            if (stockOpt.isPresent()) {
                StockMedicamento stock = stockOpt.get();
                stock.setCantidadActual(stock.getCantidadActual().add(cantidadNueva));
                stockRepository.save(stock);
            } else {
                StockMedicamento nuevoStock = StockMedicamento.builder()
                        .id_tipo_medicamento(tipo)
                        .cantidadActual(cantidadNueva)
                        .id_unidad(guardado.getId_unidad())
                        .build();
                stockRepository.save(nuevoStock);
            }
        }

        return mapper.toDTO(repository.findById(guardado.getIng_medicamento()).orElse(guardado));
    }

    @Override
    public IngMedicamentoDTO update(Integer id, IngMedicamentoDTO obj) {
        IngMedicamentoValidator.validate(obj);
        IngMedicamento anterior = repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró ingreso de medicamento con id: " + id));

        double cantidadAnterior = anterior.getCantidad();
        double cantidadNueva = obj.getCantidad() != null ? obj.getCantidad() : 0;
        double delta = cantidadNueva - cantidadAnterior;
        if (delta != 0 && anterior.getId_tipo_medicamento() != null) {
            stockRepository.findByIdTipoMedicamento(anterior.getId_tipo_medicamento()).ifPresent(stock -> {
                BigDecimal nuevo = stock.getCantidadActual().add(BigDecimal.valueOf(delta));
                stock.setCantidadActual(nuevo.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : nuevo);
                stockRepository.save(stock);
            });
        }

        IngMedicamento entidad = mapper.toEntity(obj);
        entidad.setIng_medicamento(id);
        IngMedicamento actualizado = repository.save(entidad);
        return mapper.toDTO(repository.findById(actualizado.getIng_medicamento()).orElse(actualizado));
    }

    @Override
    public void delete(Integer id) {
        IngMedicamento entidad = repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró ingreso de medicamento con id: " + id));

        if (entidad.getId_tipo_medicamento() != null) {
            stockRepository.findByIdTipoMedicamento(entidad.getId_tipo_medicamento()).ifPresent(stock -> {
                BigDecimal nuevo = stock.getCantidadActual().subtract(BigDecimal.valueOf(entidad.getCantidad()));
                stock.setCantidadActual(nuevo.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : nuevo);
                stockRepository.save(stock);
            });
        }

        repository.deleteById(id);
    }
}