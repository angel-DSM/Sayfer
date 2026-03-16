package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.GalponDTO;
import com.sayfer.sayfer.entity.Galpon;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.mapper.GalponMapper;
import com.sayfer.sayfer.repository.GalponRepository;
import com.sayfer.sayfer.service.GalponService;
import com.sayfer.sayfer.validator.GalponValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GalponServiceImplementation implements GalponService {
    private final GalponRepository repository;
    private final GalponMapper mapper;

    public GalponServiceImplementation(GalponRepository repository, GalponMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<GalponDTO> findAll() {
        List<Galpon> entidad = repository.findAll();
        return entidad.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public GalponDTO findById(Integer id) {
        Galpon entidad = repository.findById(id)
                .orElseThrow(()-> new NoDataFoundException("identificador " + id + " no encontrado"));
        return mapper.toDTO(entidad);
    }

    @Override
    public GalponDTO create(GalponDTO obj) {
        GalponValidator.validate(obj);
        Galpon entidad = mapper.toEntity(obj);
        Galpon update = repository.save(entidad);
        return mapper.toDTO(update);
    }

    @Override
    public GalponDTO update(Integer id, GalponDTO obj) {
        GalponValidator.validate(obj);
        if (repository.existsById(id)){
            Galpon entidad = mapper.toEntity(obj);
            entidad.setId_galpon(id);
            Galpon update = repository.save(entidad);
            return mapper.toDTO(update);
        }
        throw new NoDataFoundException("No se puede actualizar: No existe el galpon con ID " + id);
    }

    @Override
    public void delete(Integer id) {
        Galpon entidad = repository.findById(id)
                .orElseThrow(()-> new NoDataFoundException("No existe el galpon con ID" + id));
        repository.delete(entidad);
    }
}
