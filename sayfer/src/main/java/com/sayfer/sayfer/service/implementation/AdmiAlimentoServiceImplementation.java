package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.AdmiAlimentoDTO;
import com.sayfer.sayfer.entity.AdmiAlimento;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.mapper.AdmiAlimentoMapper;
import com.sayfer.sayfer.repository.AdmiAlimentoRepository;
import com.sayfer.sayfer.service.AdmiAlimentoService;
import com.sayfer.sayfer.validator.AdmiAlimentoValidator;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdmiAlimentoServiceImplementation implements AdmiAlimentoService {
    private final AdmiAlimentoRepository repository;
    private final AdmiAlimentoMapper mapper;

    public AdmiAlimentoServiceImplementation(AdmiAlimentoRepository repository, AdmiAlimentoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }
                    //BUSCAR GENERAL
    //entidad y id son variables(si sale error cambiar)
    @Override
    // el transactional se usa para que se usen menos recursos porque solo le dice a la base de datos que va leer datos no cambiar o borrar un dato, se necesita esta importacion import org.springframework.transaction.annotation.Transactional; para el readonly
    @Transactional(readOnly = true)
    public List<AdmiAlimentoDTO> findAll() {
        List<AdmiAlimento> entidad = repository.findAll();
        return entidad.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
                            //BUSCAR POR ID
    //en esta parte se busca la identidad por él, id y el orElseThrow es para que si sucede un error se detenga hay y que no colapse nada
//el NoDataFoundException es una clase que está en exeption y es para mostrar un mensaje si sale error
    @Override
    @Transactional(readOnly = true)
    public AdmiAlimentoDTO findById(Integer id) {
        AdmiAlimento entidad = repository.findById(id)
                .orElseThrow(() -> new NoDataFoundException("No se encontró el alimento con ID: " + id));
        return mapper.toDTO(entidad);
    }
                                //CREAR
    // el validador esta en valitator que en este caso solo sirve para que no se ingresen datos >= 0
    @Override
    public AdmiAlimentoDTO create(AdmiAlimentoDTO obj) {
        AdmiAlimentoValidator.validate(obj);
        AdmiAlimento entidad = mapper.toEntity(obj);
        AdmiAlimento save = repository.save(entidad);
        return mapper.toDTO(save);
    }
                                //ACTUALIZAR
    @Override
    public AdmiAlimentoDTO update(Integer id_admi_alimento, AdmiAlimentoDTO obj) {
        AdmiAlimentoValidator.validate(obj);
        if (repository.existsById(id_admi_alimento)){
            AdmiAlimento entidad = mapper.toEntity(obj);
            entidad.setId_admi_alimento(id_admi_alimento);
            AdmiAlimento update = repository.save(entidad);
            return mapper.toDTO(update);
        }
        throw new NoDataFoundException("No se puede actualizar: No existe el alimento con ID " + id_admi_alimento);
    }
                                //ELIMINAR
    @Override
    @Transactional
    public void delete(Integer id) {
        AdmiAlimento entidad = repository.findById(id)
                .orElseThrow(() -> new NoDataFoundException("No se puede eliminar: El ID " + id + " no existe"));
        repository.delete(entidad);
    }
}