package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.entity.TipoAlimento;
import com.sayfer.sayfer.repository.TipoAlimentoRepository;
import com.sayfer.sayfer.service.TipoAlimentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoAlimentoServiceImplementation implements TipoAlimentoService {

    @Override
    public List<TipoAlimento> findAll() {
        return List.of();
    }

    @Override
    public TipoAlimento findById(Integer integer) {
        return null;
    }

    @Override
    public TipoAlimento create(TipoAlimento obj) {
        return null;
    }

    @Override
    public TipoAlimento update(Integer integer, TipoAlimento obj) {
        return null;
    }

    @Override
    public void delete(Integer integer) {

    }
}