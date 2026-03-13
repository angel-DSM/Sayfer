package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.AdmiAlimentoDTO;
import com.sayfer.sayfer.entity.AdmiAlimento;
import com.sayfer.sayfer.mapper.AdmiAlimentoMapper;
import com.sayfer.sayfer.repository.AdmiAlimentoRepository;
import com.sayfer.sayfer.service.AdmiAlimentoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service

public class AdmiAlimentoServiceImplementation implements AdmiAlimentoService {
    private final AdmiAlimentoRepository repository;
    private final AdmiAlimentoMapper mapper;

    public AdmiAlimentoServiceImplementation(AdmiAlimentoRepository repository, AdmiAlimentoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Page<AdmiAlimentoDTO> findAll(Pageable pageable, String search) {
        Page<AdmiAlimento> admialimentos;
        if (search==null || search.trim().isEmpty()){
            admialimentos= repository.findAll(pageable);
        }else{
            admialimentos= repository.findByNombreContainingIgnoreCase(pageable, search);
        }
        return new PageImpl<>(
                admialimentos.getContent().stream()
                        .map(mapper::toDTO)
                        .collect(Collectors.toList()),
                pageable,
                admialimentos.getTotalElements()
        );
        }

    @Override
    public AdmiAlimentoDTO findById(Integer id_admi_alimento) {
        AdmiAlimento entidad= repository.findById(id_admi_alimento).orElseThrow();
        return mapper.toDTO(entidad);
    }

    @Override
    public AdmiAlimentoDTO create(AdmiAlimentoDTO obj) {
        //AdmiAlimento.save(obj);
        AdmiAlimento entidad=mapper.toEntity(obj);
        AdmiAlimento saved = repository.save(entidad);
        return mapper.toDTO(saved);
    }

    @Override
    public AdmiAlimentoDTO update(Integer id_admi_alimento, AdmiAlimentoDTO obj) {
        AdmiAlimento entidad=mapper.toEntity(obj);
        if (repository.existsById(id_admi_alimento)){
            entidad.setId_admi_alimento(id_admi_alimento);
            AdmiAlimento saved=repository.save(entidad);
        return mapper.toDTO(entidad);
        }
        return null;
    }

    @Override
    public void delete(Integer id_admi_alimento) {
        AdmiAlimento entidad=repository.findById(id_admi_alimento).orElseThrow();
        repository.delete(entidad);
    }
}

