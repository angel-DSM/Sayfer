package com.sayfer.sayfer.repository;

import com.sayfer.sayfer.entity.GalponCicloProduccion;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface GalponCicloProduccionRepository extends JpaRepository<GalponCicloProduccion, Integer> {

    /** Devuelve true si el galpón ya tiene un ciclo activo (sin fecha_fin o fecha_fin >= hoy),
     *  excluyendo opcionalmente un vínculo existente (para edición). */
    @Query("SELECT COUNT(v) > 0 FROM GalponCicloProduccion v " +
           "WHERE v.id_galpon.id_galpon = :idGalpon " +
           "AND (:excludeId IS NULL OR v.id_galpon_ciclo_produccion <> :excludeId) " +
           "AND (v.fecha_fin IS NULL OR v.fecha_fin >= :hoy)")
    boolean tienecicloActivo(@Param("idGalpon") Integer idGalpon,
                              @Param("hoy") LocalDate hoy,
                              @Param("excludeId") Integer excludeId);
}
