package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.GalponCicloProduccionDTO;
import com.sayfer.sayfer.entity.GalponCicloProduccion;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.exeption.ValidateException;
import com.sayfer.sayfer.mapper.GalponCicloProduccionMapper;
import com.sayfer.sayfer.repository.GalponCicloProduccionRepository;
import com.sayfer.sayfer.service.GalponCicloProduccionService;
import com.sayfer.sayfer.validator.GalponCicloProduccionValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GalponCicloProduccionServiceImplementation implements GalponCicloProduccionService {
    private final GalponCicloProduccionRepository repository;
    private final GalponCicloProduccionMapper mapper;

    public GalponCicloProduccionServiceImplementation(GalponCicloProduccionRepository repository, GalponCicloProduccionMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<GalponCicloProduccionDTO> findAll() {
        List<GalponCicloProduccion> entidad = repository.findAll();
        return entidad.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GalponCicloProduccionDTO findById(Integer id) {
        GalponCicloProduccion entidad = repository.findById(id)
                .orElseThrow(()-> new NoDataFoundException("identificador del GalponCicloProduccion" + id + " no encontrado"));
        return mapper.toDTO(entidad);
    }

    @Override
    public GalponCicloProduccionDTO create(GalponCicloProduccionDTO obj) {
        GalponCicloProduccionValidator.validate(obj);
        Integer idGalpon = obj.getId_galpon() != null ? obj.getId_galpon().getId_galpon() : null;
        if (idGalpon != null && repository.tienecicloActivo(idGalpon, LocalDate.now(), null)) {
            throw new ValidateException(
                "El galpón ya tiene un ciclo de producción en curso. Ciérralo antes de asignar uno nuevo.");
        }
        GalponCicloProduccion entidad = mapper.toEntity(obj);
        GalponCicloProduccion update = repository.save(entidad);
        return mapper.toDTO(update);
    }

    @Override
    public GalponCicloProduccionDTO update(Integer id, GalponCicloProduccionDTO obj) {
        GalponCicloProduccionValidator.validate(obj);
        if (!repository.existsById(id)) {
            throw new NoDataFoundException("No se puede actualizar: No existe el GalponCicloProduccion con ID" + id);
        }
        Integer idGalpon = obj.getId_galpon() != null ? obj.getId_galpon().getId_galpon() : null;
        if (idGalpon != null && repository.tienecicloActivo(idGalpon, LocalDate.now(), id)) {
            throw new ValidateException(
                "El galpón ya tiene un ciclo de producción en curso. Ciérralo antes de asignar uno nuevo.");
        }
        GalponCicloProduccion entidad = mapper.toEntity(obj);
        entidad.setId_galpon_ciclo_produccion(id);
        GalponCicloProduccion update = repository.save(entidad);
        return mapper.toDTO(update);
    }

    @Override
    public void delete(Integer id) {
        GalponCicloProduccion entidad = repository.findById(id)
                .orElseThrow(()-> new NoDataFoundException("No existe el GalponCicloProduccion con ID" + id));
        repository.delete(entidad);
    }
}
