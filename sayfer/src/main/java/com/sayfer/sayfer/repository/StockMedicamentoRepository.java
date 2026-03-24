package com.sayfer.sayfer.repository;

import com.sayfer.sayfer.entity.StockMedicamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.sayfer.sayfer.entity.TipoMedicamento;
import java.util.Optional;

public interface StockMedicamentoRepository extends JpaRepository<StockMedicamento, Integer> {
    Page<StockMedicamento> findBycantidadActualContainingIgnoreCase(Pageable pageable, String search);

    @Query("SELECT s FROM StockMedicamento s WHERE s.id_tipo_medicamento = :tipo")
    Optional<StockMedicamento> findByIdTipoMedicamento(@Param("tipo") TipoMedicamento tipo);
}
