package com.sayfer.sayfer.repository;

import com.sayfer.sayfer.entity.StockAlimento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockAlimentoRepository extends JpaRepository<StockAlimento, Integer> {
    Page<StockAlimento> findBycantidadContainingIgnoreCase(Pageable pageable, String Cantidad);
}
