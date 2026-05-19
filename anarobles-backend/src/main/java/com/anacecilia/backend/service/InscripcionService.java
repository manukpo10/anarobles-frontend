package com.anacecilia.backend.service;

import com.anacecilia.backend.dto.InscripcionResponse;
import com.anacecilia.backend.entity.Curso;
import com.anacecilia.backend.entity.Inscripcion;
import com.anacecilia.backend.entity.Usuario;
import com.anacecilia.backend.repository.CursoRepository;
import com.anacecilia.backend.repository.InscripcionRepository;
import com.anacecilia.backend.repository.UsuarioRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InscripcionService {

    private final InscripcionRepository inscripcionRepository;
    private final CursoRepository cursoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional(readOnly = true)
    public List<InscripcionResponse> listarPorUsuario(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return inscripcionRepository.findByUsuarioWithCurso(usuario)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean estaInscripto(String email, Long cursoId) {
        Long usuarioId = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"))
                .getId();
        return inscripcionRepository.existsByUsuarioIdAndCursoId(usuarioId, cursoId);
    }

    @Transactional
    public void inscribir(String email, Long cursoId) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
        if (!inscripcionRepository.existsByUsuarioAndCurso(usuario, curso)) {
            inscripcionRepository.save(Inscripcion.builder().usuario(usuario).curso(curso).build());
        }
    }

    @Transactional
    public InscripcionResponse marcarLeccion(String email, Long cursoId, String leccionId) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
        Inscripcion ins = inscripcionRepository.findByUsuarioAndCurso(usuario, curso)
                .orElseThrow(() -> new RuntimeException("No estás inscripto a este curso"));

        Set<String> completadas = new HashSet<>(parseLecciones(ins.getLeccionesCompletadasJson()));
        completadas.add(leccionId);
        try {
            ins.setLeccionesCompletadasJson(objectMapper.writeValueAsString(completadas));
        } catch (Exception e) {
            log.error("Error serializando lecciones", e);
        }
        return toResponse(inscripcionRepository.save(ins));
    }

    private List<String> parseLecciones(String json) {
        if (json == null || json.isBlank()) return new ArrayList<>();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private InscripcionResponse toResponse(Inscripcion ins) {
        return InscripcionResponse.builder()
                .id(ins.getId())
                .cursoId(ins.getCurso().getId())
                .cursoTitulo(ins.getCurso().getTitulo())
                .cursoImagen(ins.getCurso().getImagen())
                .leccionesCompletadas(parseLecciones(ins.getLeccionesCompletadasJson()))
                .fechaInscripcion(ins.getFechaInscripcion())
                .build();
    }
}
