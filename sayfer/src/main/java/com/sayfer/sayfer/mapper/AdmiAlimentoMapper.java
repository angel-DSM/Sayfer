package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.AdmiAlimentoDTO;
import com.sayfer.sayfer.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;

@Component
public class AdmiAlimentoMapper extends GenericMapper<AdmiAlimento, AdmiAlimentoDTO> {

    @PersistenceContext
    private EntityManager em;

    @Override
    public AdmiAlimentoDTO toDTO(AdmiAlimento entity) {
        if (entity == null) return null;
        return AdmiAlimentoDTO.builder()
                .id_admi_alimento(entity.getId_admi_alimento())
                .cantidad_utilizada(entity.getCantidad_utilizada())
                .fecha_alimentacion(entity.getFecha_alimentacion())
                .id_tipo_alimento(entity.getId_tipo_alimento() != null ? entity.getId_tipo_alimento().getId_tipo_alimento() : null)
                .nombre_alimento(entity.getId_tipo_alimento() != null ? entity.getId_tipo_alimento().getNombre_alimento() : null)
                .id_galpon(entity.getId_galpon() != null ? entity.getId_galpon().getId_galpon() : null)
                .nombre_galpon(entity.getId_galpon() != null ? entity.getId_galpon().getNombre() : null)
                .id_ciclo(entity.getId_ciclo() != null ? entity.getId_ciclo().getId() : null)
                .nombre_ciclo(entity.getId_ciclo() != null ? entity.getId_ciclo().getNombreCiclo() : null)
                .id_usuario(entity.getId_usuario() != null ? entity.getId_usuario().getCedula() : null)
                .nombre_usuario(entity.getId_usuario() != null ? entity.getId_usuario().getNombre() + " " + entity.getId_usuario().getApellido() : null)
                .build();
    }

    @Override
    public AdmiAlimento toEntity(AdmiAlimentoDTO dto) {
        if (dto == null) return null;

        TipoAlimento tipo = dto.getId_tipo_alimento() != null
                ? em.getReference(TipoAlimento.class, dto.getId_tipo_alimento()) : null;
        Galpon galpon = dto.getId_galpon() != null
                ? em.getReference(Galpon.class, dto.getId_galpon()) : null;
        CicloProduccion ciclo = dto.getId_ciclo() != null
                ? em.getReference(CicloProduccion.class, dto.getId_ciclo()) : null;
        Usuario usuario = dto.getId_usuario() != null
                ? em.getReference(Usuario.class, dto.getId_usuario()) : null;

        return AdmiAlimento.builder()
                .id_admi_alimento(dto.getId_admi_alimento())
                .cantidad_utilizada(dto.getCantidad_utilizada())
                .fecha_alimentacion(dto.getFecha_alimentacion())
                .id_tipo_alimento(tipo)
                .id_galpon(galpon)
                .id_ciclo(ciclo)
                .id_usuario(usuario)
                .build();
    }
}
