package com.sayfer.sayfer.repository;

import com.sayfer.sayfer.entity.StockAlimento;
import com.sayfer.sayfer.entity.TipoAlimento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StockAlimentoRepository extends JpaRepository<StockAlimento, Integer> {
    Page<StockAlimento> findBycantidadContainingIgnoreCase(Pageable pageable, String Cantidad);
    
    @Query("SELECT s FROM StockAlimento s WHERE s.id_tipo_alimento = :tipoAlimento")
    Optional<StockAlimento> findByIdTipoAlimento(@Param("tipoAlimento") TipoAlimento tipoAlimento);
}
