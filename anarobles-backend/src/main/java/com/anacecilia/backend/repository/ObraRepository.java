package com.anacecilia.backend.repository;

import com.anacecilia.backend.entity.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ObraRepository extends JpaRepository<Obra, Long> {
    List<Obra> findByPublicadoTrue();
    boolean existsBySlug(String slug);
}
