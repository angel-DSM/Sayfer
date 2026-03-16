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

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CicloProduccionServiceImplementation implements CicloProduccionService {
    private final CicloProduccionRepository repository;
    private final CicloProduccionMapper mapper;

    public CicloProduccionServiceImplementation(CicloProduccionRepository repository, CicloProduccionMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CicloProduccionDTO> findAll() {
        List<CicloProduccion> entidad = repository.findAll();
        return entidad.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
        }

    @Override
    public CicloProduccionDTO findById(Integer id) {
        CicloProduccion entidad = repository.findById(id)
                .orElseThrow(()-> new NoDataFoundException("identificador del ciclo " + id + " no encontrado"));
        return mapper.toDTO(entidad);
    }

    @Override
    public CicloProduccionDTO create(CicloProduccionDTO obj) {
        CicloProduccionValidator.validate(obj);
        CicloProduccion entidad = mapper.toEntity(obj);
        CicloProduccion update = repository.save(entidad);
        return mapper.toDTO(update);
    }

    @Override
    public CicloProduccionDTO update(Integer id, CicloProduccionDTO obj) {
        CicloProduccionValidator.validate(obj);
        if (repository.existsById(id)){
            CicloProduccion entidad = mapper.toEntity(obj);
            entidad.setId(id);
            CicloProduccion update = repository.save(entidad);
            return mapper.toDTO(update);
        }
        throw new NoDataFoundException("No se puede actualizar: No existe el ciclo con ID" + id);
    }

    @Override
    public void delete(Integer id) {
        CicloProduccion entidad = repository.findById(id)
                .orElseThrow(()-> new NoDataFoundException("No existe el ciclo con ID" + id));
        repository.delete(entidad);
    }
}