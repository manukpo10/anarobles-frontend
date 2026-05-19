package com.anacecilia.backend.repository;

import com.anacecilia.backend.entity.Orden;
import com.anacecilia.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {
    List<Orden> findByUsuarioOrderByCreatedAtDesc(Usuario usuario);
    Optional<Orden> findByExternalReference(String externalReference);
    Optional<Orden> findByPaymentId(String paymentId);
}
