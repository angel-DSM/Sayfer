package com.sayfer.sayfer.repository;

import com.sayfer.sayfer.entity.StockMedicamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMedicamentoRepository extends JpaRepository<StockMedicamento, Integer> {
    Page<StockMedicamento> findBycantidad_actualContainingIgnoreCase(Pageable pageable, String search);
}
