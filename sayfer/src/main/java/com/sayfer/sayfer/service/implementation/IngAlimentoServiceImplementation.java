package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.IngAlimentoDTO;
import com.sayfer.sayfer.entity.IngAlimento;
import com.sayfer.sayfer.entity.StockAlimento;
import com.sayfer.sayfer.entity.TipoAlimento;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.mapper.IngAlimentoMapper;
import com.sayfer.sayfer.repository.IngAlimentoRepository;
import com.sayfer.sayfer.repository.StockAlimentoRepository;
import com.sayfer.sayfer.service.IngAlimentoService;
import com.sayfer.sayfer.validator.IngAlimentoValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class IngAlimentoServiceImplementation implements IngAlimentoService {

    private final IngAlimentoRepository repository;
    private final IngAlimentoMapper mapper;
    private final StockAlimentoRepository stockRepository;

    public IngAlimentoServiceImplementation(IngAlimentoRepository repository,
                                            IngAlimentoMapper mapper,
                                            StockAlimentoRepository stockRepository) {
        this.repository = repository;
        this.mapper = mapper;
        this.stockRepository = stockRepository;
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

        // Actualizar stock automáticamente
        TipoAlimento tipo = guardado.getId_tipo_alimento();
        if (tipo != null && obj.getCantidad() != null) {
            long cantidadNueva = obj.getCantidad().longValue();
            Optional<StockAlimento> stockOpt = stockRepository.findByIdTipoAlimento(tipo);
            if (stockOpt.isPresent()) {
                StockAlimento stock = stockOpt.get();
                stock.setCantidad(stock.getCantidad() + cantidadNueva);
                stockRepository.save(stock);
            } else {
                StockAlimento nuevoStock = StockAlimento.builder()
                        .id_tipo_alimento(tipo)
                        .cantidad(cantidadNueva)
                        .build();
                stockRepository.save(nuevoStock);
            }
        }

        // Recargar para obtener el nombre del tipo alimento
        return mapper.toDTO(repository.findById(guardado.getId_IngAlimento()).orElse(guardado));
    }

    @Override
    public IngAlimentoDTO update(Integer id, IngAlimentoDTO obj) {
        IngAlimentoValidator.validate(obj);
        IngAlimento anterior = repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró ingreso de alimento con id: " + id));

        // Ajustar stock con la diferencia de cantidad
        long cantidadAnterior = anterior.getCantidad() != null ? anterior.getCantidad().longValue() : 0;
        long cantidadNueva = obj.getCantidad() != null ? obj.getCantidad().longValue() : 0;
        long delta = cantidadNueva - cantidadAnterior;
        if (delta != 0 && anterior.getId_tipo_alimento() != null) {
            stockRepository.findByIdTipoAlimento(anterior.getId_tipo_alimento()).ifPresent(stock -> {
                long nuevoStock = stock.getCantidad() + delta;
                stock.setCantidad(Math.max(nuevoStock, 0));
                stockRepository.save(stock);
            });
        }

        IngAlimento entidad = mapper.toEntity(obj);
        entidad.setId_IngAlimento(id);
        IngAlimento actualizado = repository.save(entidad);
        return mapper.toDTO(repository.findById(actualizado.getId_IngAlimento()).orElse(actualizado));
    }

    @Override
    public void delete(Integer id) {
        IngAlimento entidad = repository.findById(id)
                .orElseThrow(() -> new com.sayfer.sayfer.exeption.NoDataFoundException(
                        "No se encontró ingreso de alimento con id: " + id));

        // Restar del stock la cantidad que se elimina
        if (entidad.getId_tipo_alimento() != null && entidad.getCantidad() != null) {
            stockRepository.findByIdTipoAlimento(entidad.getId_tipo_alimento()).ifPresent(stock -> {
                long nuevo = stock.getCantidad() - entidad.getCantidad().longValue();
                stock.setCantidad(Math.max(nuevo, 0));
                stockRepository.save(stock);
            });
        }

        repository.deleteById(id);
    }
}