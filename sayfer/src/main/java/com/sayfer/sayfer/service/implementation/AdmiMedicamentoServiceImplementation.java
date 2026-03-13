package com.sayfer.sayfer.service.implementation;

import com.sayfer.sayfer.dto.AdmiMedicamentoDTO;
import com.sayfer.sayfer.dto.AdminMedicamentoDTO;
import com.sayfer.sayfer.mapper.AdmiAlimentoMapper;
import com.sayfer.sayfer.repository.AdmiAlimentoRepository;
import com.sayfer.sayfer.service.AdminMedicamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
public class AdmiMedicamentoServiceImplementation implements AdminMedicamentoService {

    @Override
    public Page<AdmiMedicamentoDTO> findAll(Pageable pageable, String search) {
        return null;
    }

    @Override
    public AdmiMedicamentoDTO findById(Integer integer) {
        return null;
    }

    @Override
    public AdmiMedicamentoDTO create(AdmiMedicamentoDTO obj) {
        return null;
    }

    @Override
    public AdmiMedicamentoDTO update(Integer integer, AdmiMedicamentoDTO obj) {
        return null;
    }

    @Override
    public void delete(Integer integer) {

    }
}
