package com.sayfer.sayfer.repository;

import com.sayfer.sayfer.entity.Mortalidad;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MortalidadRepository extends JpaRepository<Mortalidad, Integer> {
    Page<Mortalidad> findBycantidad_muertosContainingIgnoreCase(Pageable pageable, String search);
}
