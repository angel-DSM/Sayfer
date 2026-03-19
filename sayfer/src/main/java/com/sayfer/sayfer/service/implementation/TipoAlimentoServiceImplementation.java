package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.TipoAlimentoDTO;
import com.sayfer.sayfer.entity.TipoAlimento;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.mapper.TipoAlimentoMapper;
import com.sayfer.sayfer.repository.TipoAlimentoRepository;
import com.sayfer.sayfer.service.TipoAlimentoService;
import com.sayfer.sayfer.validator.TipoAlimentoValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TipoAlimentoServiceImplementation implements TipoAlimentoService {

    private final TipoAlimentoRepository repository;
    private final TipoAlimentoMapper mapper;

    public TipoAlimentoServiceImplementation(TipoAlimentoRepository repository, TipoAlimentoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TipoAlimentoDTO> findAll() {
        List<TipoAlimento> entidad = repository.findAll();
        return entidad.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TipoAlimentoDTO findById(Integer id) {
        TipoAlimento entidad = repository.findById(id)
                .orElseThrow(()-> new NoDataFoundException("No se enconto el tipo de alimento con el identificador " + id));
        return mapper.toDTO(entidad);
    }

    @Override
    public TipoAlimentoDTO create(TipoAlimentoDTO obj) {
        TipoAlimentoValidator.validate(obj);
        TipoAlimento entidad = mapper.toEntity(obj);
        TipoAlimento update = repository.save(entidad);
        return mapper.toDTO(update);
    }

    @Override
    public TipoAlimentoDTO update(Integer id, TipoAlimentoDTO obj) {
        TipoAlimentoValidator.validate(obj);
        if (repository.existsById(id)){
            TipoAlimento entidad = mapper.toEntity(obj);
            entidad.setId_tipo_alimento(id);
            TipoAlimento update = repository.save(entidad);
            return mapper.toDTO(update);
        }
        throw new NoDataFoundException("No se enconto el tipo de alimento con el identificador " + id);
    }

    @Override
    public void delete(Integer id) {
        TipoAlimento entidad = repository.findById(id)
                .orElseThrow(()-> new NoDataFoundException("No existe el TipoAlimento con ID" + id));
        repository.delete(entidad);
    }
}