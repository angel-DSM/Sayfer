package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.TipoMuerteDTO;
import com.sayfer.sayfer.entity.TipoMuerte;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.mapper.TipoMuerteMapper;
import com.sayfer.sayfer.repository.TipoMuerteRepository;
import com.sayfer.sayfer.service.TipoMuerteService;
import com.sayfer.sayfer.validator.TipoMuerteValidator;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

public class TipoMuerteServiceImplementation implements TipoMuerteService {
    private final TipoMuerteRepository repository;
    private final TipoMuerteMapper mapper;

    public TipoMuerteServiceImplementation(TipoMuerteRepository repository, TipoMuerteMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TipoMuerteDTO> findAll() {
        List<TipoMuerte> entidad = repository.findAll();
        return entidad.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TipoMuerteDTO findById(Integer id) {
        TipoMuerte entidad = repository.findById(id)
                .orElseThrow(() -> new NoDataFoundException("No se encontro el tipo de muerte por el id "+ id));
        return mapper.toDTO(entidad);
    }
    //el unico validador es si el valor de cantidad es mayor a 0
    @Override
    public TipoMuerteDTO create(TipoMuerteDTO obj) {
        TipoMuerteValidator.validate(obj);
        TipoMuerte entidad = mapper.toEntity(obj);
        TipoMuerte update = repository.save(entidad);
        return mapper.toDTO(update);
    }

    @Override
    public TipoMuerteDTO update(Integer id, TipoMuerteDTO obj) {
        TipoMuerteValidator.validate(obj);
        if (repository.existsById(id)){
            TipoMuerte entidad = mapper.toEntity(obj);
            entidad.setId_tipo_muerte(id);
            TipoMuerte update = repository.save(entidad);
            return mapper.toDTO(update);
        }
        throw new NoDataFoundException("No se puede actualizar: No existe el alimento con ID" + id);
    }

    @Override
    public void delete(Integer id) {
        TipoMuerte entidad = repository.findById(id)
                .orElseThrow(()-> new NoDataFoundException("No se puede actualizar: No existe el alimento con ID" + id));
        repository.delete(entidad);
    }
}