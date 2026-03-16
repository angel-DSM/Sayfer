package com.sayfer.sayfer.repository;

import com.sayfer.sayfer.entity.IngMedicamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngMedicamentoRepository extends JpaRepository<IngMedicamento, Integer> {
    Page<IngMedicamento> findBycantidadContainingIgnoreCase(Pageable pageable, String search);
}
