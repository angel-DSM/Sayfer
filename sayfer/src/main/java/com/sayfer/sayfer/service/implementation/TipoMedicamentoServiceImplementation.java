package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.TipoMedicamentoDTO;
import com.sayfer.sayfer.entity.TipoMedicamento;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.mapper.TipoMedicamentoMapper;
import com.sayfer.sayfer.repository.TipoMedicamentoRepository;
import com.sayfer.sayfer.service.TipoMedicamentoService;
import com.sayfer.sayfer.validator.TipoMedicamentoValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TipoMedicamentoServiceImplementation implements TipoMedicamentoService {
    private final TipoMedicamentoRepository repository;
    private final TipoMedicamentoMapper mapper;

    public TipoMedicamentoServiceImplementation(TipoMedicamentoRepository repository, TipoMedicamentoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TipoMedicamentoDTO> findAll() {
        List<TipoMedicamento> entidad = repository.findAll();
        return entidad.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TipoMedicamentoDTO findById(Integer id) {
        TipoMedicamento entidad = repository.findById(id)
                .orElseThrow(() -> new NoDataFoundException("No se encontro el medicamento por el id "+ id));
        return mapper.toDTO(entidad);
    }
    //el unico validador es si el valor de cantidad es mayor a 0
    @Override
    public TipoMedicamentoDTO create(TipoMedicamentoDTO obj) {
        TipoMedicamentoValidator.validate(obj);
        TipoMedicamento entidad = mapper.toEntity(obj);
        TipoMedicamento update = repository.save(entidad);
        return mapper.toDTO(update);
    }

    @Override
    public TipoMedicamentoDTO update(Integer id, TipoMedicamentoDTO obj) {
        TipoMedicamentoValidator.validate(obj);
        if (repository.existsById(id)){
            TipoMedicamento entidad = mapper.toEntity(obj);
            entidad.setId_tipo_medicamento(id);
            TipoMedicamento update = repository.save(entidad);
            return mapper.toDTO(update);
        }
        throw new NoDataFoundException("No se puede actualizar: No existe el alimento con ID" + id);
    }

    @Override
    public void delete(Integer id) {
        TipoMedicamento entidad = repository.findById(id)
                .orElseThrow(()-> new NoDataFoundException("No se puede actualizar: No existe el alimento con ID" + id));
        repository.delete(entidad);
    }
}

