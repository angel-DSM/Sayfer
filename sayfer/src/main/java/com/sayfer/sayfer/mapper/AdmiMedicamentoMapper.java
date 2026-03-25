package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.AdmiMedicamentoDTO;
import com.sayfer.sayfer.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;

@Component
public class AdmiMedicamentoMapper extends GenericMapper<AdmiMedicamento, AdmiMedicamentoDTO> {

    @PersistenceContext
    private EntityManager em;

    @Override
    public AdmiMedicamentoDTO toDTO(AdmiMedicamento entity) {
        if (entity == null) return null;
        return AdmiMedicamentoDTO.builder()
                .id_admi_medicamento(entity.getId_admin_medicamento())
                .cantidad_utilizada(entity.getCantidad_utilizada_medi())
                .fecha_medicacion(entity.getFecha_medicacion())
                .id_tipo_medicamento(entity.getTipo_medicamento() != null ? entity.getTipo_medicamento().getId_tipo_medicamento() : null)
                .nombre_med(entity.getTipo_medicamento() != null ? entity.getTipo_medicamento().getNombre() : null)
                .id_galpon(entity.getId_galpon() != null ? entity.getId_galpon().getId_galpon() : null)
                .nombre_galpon(entity.getId_galpon() != null ? entity.getId_galpon().getNombre() : null)
                .id_ciclo(entity.getId_ciclo() != null ? entity.getId_ciclo().getId() : null)
                .nombre_ciclo(entity.getId_ciclo() != null ? entity.getId_ciclo().getNombreCiclo() : null)
                .id_usuario(entity.getId_usuario() != null ? entity.getId_usuario().getCedula() : null)
                .nombre_usuario(entity.getId_usuario() != null ? entity.getId_usuario().getNombre() + " " + entity.getId_usuario().getApellido() : null)
                .build();
    }

    @Override
    public AdmiMedicamento toEntity(AdmiMedicamentoDTO dto) {
        if (dto == null) return null;

        TipoMedicamento tipo = dto.getId_tipo_medicamento() != null
                ? em.getReference(TipoMedicamento.class, dto.getId_tipo_medicamento()) : null;
        Galpon galpon = dto.getId_galpon() != null
                ? em.getReference(Galpon.class, dto.getId_galpon()) : null;
        CicloProduccion ciclo = dto.getId_ciclo() != null
                ? em.getReference(CicloProduccion.class, dto.getId_ciclo()) : null;
        Usuario usuario = dto.getId_usuario() != null
                ? em.getReference(Usuario.class, dto.getId_usuario()) : null;

        return AdmiMedicamento.builder()
                .id_admin_medicamento(dto.getId_admi_medicamento())
                .cantidad_utilizada_medi(dto.getCantidad_utilizada())
                .fecha_medicacion(dto.getFecha_medicacion())
                .tipo_medicamento(tipo)
                .id_galpon(galpon)
                .id_ciclo(ciclo)
                .id_usuario(usuario)
                .build();
    }
}
