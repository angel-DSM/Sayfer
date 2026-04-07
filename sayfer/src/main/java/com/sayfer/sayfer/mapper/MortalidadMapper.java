package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.CicloProduccionDTO;
import com.sayfer.sayfer.dto.GalponDTO;
import com.sayfer.sayfer.dto.MortalidadDTO;
import com.sayfer.sayfer.dto.TipoMuerteDTO;
import com.sayfer.sayfer.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;

@Component
public class MortalidadMapper extends GenericMapper<Mortalidad, MortalidadDTO> {

    @PersistenceContext
    private EntityManager em;

    @Override
    public MortalidadDTO toDTO(Mortalidad entity) {
        if (entity == null) return null;

        CicloProduccionDTO cicloDTO = null;
        if (entity.getId_ciclo() != null)
            cicloDTO = CicloProduccionDTO.builder()
                    .id_ciclo(entity.getId_ciclo().getId())
                    .nombre_ciclo(entity.getId_ciclo().getNombre_ciclo())
                    .build();

        GalponDTO galponDTO = null;
        if (entity.getId_galpon() != null)
            galponDTO = GalponDTO.builder()
                    .id_galpon(entity.getId_galpon().getId_galpon())
                    .nombre(entity.getId_galpon().getNombre())
                    .build();

        TipoMuerteDTO tipoDTO = null;
        if (entity.getId_tipo_muerte() != null)
            tipoDTO = TipoMuerteDTO.builder()
                    .id_tipo_muerte(entity.getId_tipo_muerte().getId_tipo_muerte())
                    .nombre(entity.getId_tipo_muerte().getNombre())
                    .descripcion(entity.getId_tipo_muerte().getDescripcion())
                    .build();

        return MortalidadDTO.builder()
                .id_Mortalidad(entity.getId_Mortalidad())
                .fecha_de_muerte(entity.getFecha_de_muerte())
                .muertos(entity.getMuertos())
                .causa(entity.getCausa())
                .id_ciclo(cicloDTO)
                .id_galpon(galponDTO)
                .id_tipo_muerte(tipoDTO)
                .build();
    }

    @Override
    public Mortalidad toEntity(MortalidadDTO dto) {
        if (dto == null) return null;

        CicloProduccion ciclo = dto.getId_ciclo() != null
                ? em.getReference(CicloProduccion.class, dto.getId_ciclo().getId_ciclo()) : null;
        Galpon galpon = dto.getId_galpon() != null
                ? em.getReference(Galpon.class, dto.getId_galpon().getId_galpon()) : null;
        TipoMuerte tipo = dto.getId_tipo_muerte() != null
                ? em.getReference(TipoMuerte.class, dto.getId_tipo_muerte().getId_tipo_muerte()) : null;

        return Mortalidad.builder()
                .id_Mortalidad(dto.getId_Mortalidad())
                .fecha_de_muerte(dto.getFecha_de_muerte())
                .muertos(dto.getMuertos())
                .causa(dto.getCausa())
                .id_ciclo(ciclo)
                .id_galpon(galpon)
                .id_tipo_muerte(tipo)
                .build();
    }
}