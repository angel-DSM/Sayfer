package com.sayfer.sayfer.repository;

import com.sayfer.sayfer.entity.TipoAlimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TipoAlimentoRepository extends JpaRepository<TipoAlimento, Integer> {
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM TipoAlimento t WHERE LOWER(t.nombre_alimento) = LOWER(:nombre)")
    boolean existsByNombreIgnoreCase(@Param("nombre") String nombre);
}
