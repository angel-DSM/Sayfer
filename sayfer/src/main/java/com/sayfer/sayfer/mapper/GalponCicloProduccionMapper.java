package com.sayfer.sayfer.mapper;

import com.sayfer.sayfer.dto.GalponCicloProduccionDTO;
import com.sayfer.sayfer.entity.CicloProduccion;
import com.sayfer.sayfer.entity.Galpon;
import com.sayfer.sayfer.entity.GalponCicloProduccion;
import org.springframework.stereotype.Component;

@Component
public class GalponCicloProduccionMapper extends GenericMapper<GalponCicloProduccion, GalponCicloProduccionDTO>{
    @Override
    public GalponCicloProduccionDTO toDTO(GalponCicloProduccion entity) {
        if (entity==null){
            return null;
        }
        com.sayfer.sayfer.entity.Galpon galpon = entity.getId_galpon();
        com.sayfer.sayfer.entity.Galpon galponRef = null;
        if (galpon != null) {
            galponRef = new com.sayfer.sayfer.entity.Galpon();
            galponRef.setId_galpon(galpon.getId_galpon());
            galponRef.setNombre(galpon.getNombre());
        }
        com.sayfer.sayfer.entity.CicloProduccion ciclo = entity.getId_ciclo();
        com.sayfer.sayfer.entity.CicloProduccion cicloRef = null;
        if (ciclo != null) {
            cicloRef = new com.sayfer.sayfer.entity.CicloProduccion();
            cicloRef.setId(ciclo.getId());
            cicloRef.setNombreCiclo(ciclo.getNombreCiclo());
        }
        return GalponCicloProduccionDTO.builder()
                .id_galpon_ciclo_produccion(entity.getId_galpon_ciclo_produccion())
                .fecha_inicio(entity.getFecha_inicio())
                .fecha_fin(entity.getFecha_fin())
                .id_galpon(galponRef)
                .id_ciclo(cicloRef)
                .build();
    }

    @Override
    public GalponCicloProduccion toEntity(GalponCicloProduccionDTO dto) {
        if (dto == null) {
            return null;
        }
        Galpon galpon = null;
        if (dto.getId_galpon() != null) {
            galpon = new Galpon();
            galpon.setId_galpon(dto.getId_galpon().getId_galpon());
        }
        CicloProduccion ciclo = null;
        if (dto.getId_ciclo() != null) {
            ciclo = new CicloProduccion();
            ciclo.setId(dto.getId_ciclo().getId());
        }
        return GalponCicloProduccion.builder()
                .id_galpon_ciclo_produccion(dto.getId_galpon_ciclo_produccion())
                .fecha_inicio(dto.getFecha_inicio())
                .fecha_fin(dto.getFecha_fin())
                .id_galpon(galpon)
                .id_ciclo(ciclo)
                .build();
    }
}
