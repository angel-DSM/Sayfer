package com.sayfer.sayfer.repository;

import com.sayfer.sayfer.entity.IngAlimento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngAlimentoRepository extends JpaRepository<IngAlimento, Integer> {
    Page<IngAlimento> findByCantidadContainingIgnoreCase(Pageable pageable, String search);
}
