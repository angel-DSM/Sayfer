package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.AdmiAlimentoDTO;
import com.sayfer.sayfer.entity.AdmiAlimento;
import com.sayfer.sayfer.entity.StockAlimento;
import com.sayfer.sayfer.exeption.NoDataFoundException;
import com.sayfer.sayfer.exeption.ValidateException;
import com.sayfer.sayfer.mapper.AdmiAlimentoMapper;
import com.sayfer.sayfer.repository.AdmiAlimentoRepository;
import com.sayfer.sayfer.repository.StockAlimentoRepository;
import com.sayfer.sayfer.service.AdmiAlimentoService;
import com.sayfer.sayfer.validator.AdmiAlimentoValidator;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdmiAlimentoServiceImplementation implements AdmiAlimentoService {
    private final AdmiAlimentoRepository repository;
    private final AdmiAlimentoMapper mapper;
    private final StockAlimentoRepository stockRepository;

    public AdmiAlimentoServiceImplementation(AdmiAlimentoRepository repository,
                                             AdmiAlimentoMapper mapper,
                                             StockAlimentoRepository stockRepository) {
        this.repository = repository;
        this.mapper = mapper;
        this.stockRepository = stockRepository;
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

        // Descontar del stock
        if (entidad.getId_tipo_alimento() != null && obj.getCantidad_utilizada() != null) {
            Optional<StockAlimento> stockOpt = stockRepository.findByIdTipoAlimento(entidad.getId_tipo_alimento());
            if (stockOpt.isPresent()) {
                StockAlimento stock = stockOpt.get();
                long nuevo = stock.getCantidad() - obj.getCantidad_utilizada();
                if (nuevo < 0) {
                    throw new ValidateException("Stock insuficiente. Disponible: " + stock.getCantidad() + " kg");
                }
                stock.setCantidad(nuevo);
                stockRepository.save(stock);
            }
        }

        AdmiAlimento save = repository.save(entidad);
        return mapper.toDTO(save);
    }
    //actualizar
    @Override
    public AdmiAlimentoDTO update(Integer id_admi_alimento, AdmiAlimentoDTO obj) {
        AdmiAlimentoValidator.validate(obj);

        AdmiAlimento anterior = repository.findById(id_admi_alimento)
                .orElseThrow(() -> new NoDataFoundException(
                        "No existe el registro con ID " + id_admi_alimento));

        // 1. Devolver la cantidad anterior al stock
        if (anterior.getId_tipo_alimento() != null) {
            stockRepository.findByIdTipoAlimento(anterior.getId_tipo_alimento()).ifPresent(stock -> {
                stock.setCantidad(stock.getCantidad() + anterior.getCantidad_utilizada());
                stockRepository.save(stock);
            });
        }

        // 2. Guardar el nuevo registro
        AdmiAlimento entidad = mapper.toEntity(obj);
        entidad.setId_admi_alimento(id_admi_alimento);
        AdmiAlimento update = repository.save(entidad);

        // 3. Descontar la nueva cantidad
        if (entidad.getId_tipo_alimento() != null && obj.getCantidad_utilizada() != null) {
            Optional<StockAlimento> stockOpt = stockRepository.findByIdTipoAlimento(entidad.getId_tipo_alimento());
            if (stockOpt.isPresent()) {
                StockAlimento stock = stockOpt.get();
                long nuevo = stock.getCantidad() - obj.getCantidad_utilizada();
                if (nuevo < 0) throw new ValidateException(
                        "Stock insuficiente. Disponible: " + stock.getCantidad() + " kg");
                stock.setCantidad(nuevo);
                stockRepository.save(stock);
            }
        }

        return mapper.toDTO(update);
    }

                                //ELIMINAR
    @Override
    @Transactional
    public void delete(Integer id) {
        AdmiAlimento entidad = repository.findById(id)
                .orElseThrow(() -> new NoDataFoundException("No se puede eliminar: El ID " + id + " no existe"));

        // Devolver cantidad al stock
        if (entidad.getId_tipo_alimento() != null && entidad.getCantidad_utilizada() != null) {
            stockRepository.findByIdTipoAlimento(entidad.getId_tipo_alimento()).ifPresent(stock -> {
                stock.setCantidad(stock.getCantidad() + entidad.getCantidad_utilizada());
                stockRepository.save(stock);
            });
        }

        repository.delete(entidad);
    }
}