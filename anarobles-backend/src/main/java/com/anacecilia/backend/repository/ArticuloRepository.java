package com.anacecilia.backend.repository;

import com.anacecilia.backend.entity.Articulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ArticuloRepository extends JpaRepository<Articulo, Long> {
    List<Articulo> findByPublicadoTrueOrderByFechaPublicacionDesc();
    Optional<Articulo> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
