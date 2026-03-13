package com.sayfer.sayfer.repository;

import com.sayfer.sayfer.entity.AdmiAlimento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdmiAlimentoRepository extends JpaRepository<AdmiAlimento, Integer> {
    Page<AdmiAlimento> findByNombreContainingIgnoreCase(Pageable pageable, String search);

}
