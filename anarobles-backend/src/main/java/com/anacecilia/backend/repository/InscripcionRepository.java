package com.anacecilia.backend.repository;

import com.anacecilia.backend.entity.Curso;
import com.anacecilia.backend.entity.Inscripcion;
import com.anacecilia.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {
    List<Inscripcion> findByUsuario(Usuario usuario);
    @Query("SELECT i FROM Inscripcion i JOIN FETCH i.curso WHERE i.usuario = :usuario")
    List<Inscripcion> findByUsuarioWithCurso(@Param("usuario") Usuario usuario);
    Optional<Inscripcion> findByUsuarioAndCurso(Usuario usuario, Curso curso);
    boolean existsByUsuarioAndCurso(Usuario usuario, Curso curso);
    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END FROM Inscripcion i WHERE i.usuario.id = :usuarioId AND i.curso.id = :cursoId")
    boolean existsByUsuarioIdAndCursoId(@Param("usuarioId") Long usuarioId, @Param("cursoId") Long cursoId);
}
