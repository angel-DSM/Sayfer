package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.AdmiMedicamentoDTO;
import com.sayfer.sayfer.entity.AdmiMedicamento;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.mapper.AdmiMedicamentoMapper;
import com.sayfer.sayfer.repository.AdmiMedicamentoRepository;
import com.sayfer.sayfer.service.AdminMedicamentoService;
import com.sayfer.sayfer.validator.AdmiMedicamentoValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional
public class AdmiMedicamentoServiceImplementation implements AdminMedicamentoService {
    private final AdmiMedicamentoRepository repository;
    private final AdmiMedicamentoMapper mapper;

    public AdmiMedicamentoServiceImplementation(AdmiMedicamentoRepository repository, AdmiMedicamentoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdmiMedicamentoDTO> findAll() {
        List<AdmiMedicamento> entidad = repository.findAll();
        return entidad.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AdmiMedicamentoDTO findById(Integer id) {
        AdmiMedicamento entidad = repository.findById(id)
                .orElseThrow(() -> new NoDataFoundException("No se encontro el medicamento por el id "+ id));
        return mapper.toDTO(entidad);
    }
    //el unico validador es si el valor de cantidad es mayor a 0
    @Override
    public AdmiMedicamentoDTO create(AdmiMedicamentoDTO obj) {
        AdmiMedicamentoValidator.validate(obj);
        AdmiMedicamento entidad = mapper.toEntity(obj);
        AdmiMedicamento update = repository.save(entidad);
        return mapper.toDTO(update);
    }

    @Override
    public AdmiMedicamentoDTO update(Integer id, AdmiMedicamentoDTO obj) {
        AdmiMedicamentoValidator.validate(obj);
        if (repository.existsById(id)){
            AdmiMedicamento entidad = mapper.toEntity(obj);
            entidad.setId_admin_medicamento(id);
            AdmiMedicamento update = repository.save(entidad);
            return mapper.toDTO(update);
        }
        throw new NoDataFoundException("No se puede actualizar: No existe el alimento con ID" + id);
    }

    @Override
    public void delete(Integer id) {
        AdmiMedicamento entidad = repository.findById(id)
                .orElseThrow(()-> new NoDataFoundException("No se puede actualizar: No existe el alimento con ID" + id));
        repository.delete(entidad);
    }
}
