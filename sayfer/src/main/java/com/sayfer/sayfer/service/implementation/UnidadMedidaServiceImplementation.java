package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.UnidadMedidaDTO;
import com.sayfer.sayfer.entity.UnidadMedida;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.mapper.UnidadMedidaMapper;
import com.sayfer.sayfer.repository.UnidadMedidaRepository;
import com.sayfer.sayfer.service.UnidadMedidaService;
import com.sayfer.sayfer.validator.UnidadMedidaValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
@Service
@Transactional
public class UnidadMedidaServiceImplementation implements UnidadMedidaService {
    private final UnidadMedidaRepository repository;
    private final UnidadMedidaMapper mapper;

    public UnidadMedidaServiceImplementation(UnidadMedidaRepository repository, UnidadMedidaMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UnidadMedidaDTO> findAll() {
        List<UnidadMedida> entidad = repository.findAll();
        return entidad.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UnidadMedidaDTO findById(Integer id) {
        UnidadMedida entidad = repository.findById(id)
                .orElseThrow(() -> new NoDataFoundException("No se encontro la unidad de medida por el id "+ id));
        return mapper.toDTO(entidad);
    }
    //el unico validador es si el valor de cantidad es mayor a 0
    @Override
    public UnidadMedidaDTO create(UnidadMedidaDTO obj) {
        UnidadMedidaValidator.validate(obj);
        UnidadMedida entidad = mapper.toEntity(obj);
        UnidadMedida update = repository.save(entidad);
        return mapper.toDTO(update);
    }

    @Override
    public UnidadMedidaDTO update(Integer id, UnidadMedidaDTO obj) {
        UnidadMedidaValidator.validate(obj);
        if (repository.existsById(id)){
            UnidadMedida entidad = mapper.toEntity(obj);
            entidad.setId(id);
            UnidadMedida update = repository.save(entidad);
            return mapper.toDTO(update);
        }
        throw new NoDataFoundException("No se encontro la unidad de medida por el id "+ id);
    }

    @Override
    public void delete(Integer id) {
        UnidadMedida entidad = repository.findById(id)
                .orElseThrow(()-> new NoDataFoundException("No se encontro la unidad de medida por el id "+ id));
        repository.delete(entidad);
    }
}