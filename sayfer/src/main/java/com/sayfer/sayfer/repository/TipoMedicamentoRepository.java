package com.sayfer.sayfer.repository;

import com.sayfer.sayfer.entity.TipoMedicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TipoMedicamentoRepository extends JpaRepository<TipoMedicamento, Integer> {
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM TipoMedicamento t WHERE LOWER(t.nombre) = LOWER(:nombre)")
    boolean existsByNombreIgnoreCase(@Param("nombre") String nombre);
}
