package com.anacecilia.backend.service;

import com.anacecilia.backend.dto.CursoRequest;
import com.anacecilia.backend.dto.CursoResponse;
import com.anacecilia.backend.dto.LeccionDto;
import com.anacecilia.backend.dto.ModuloDto;
import com.anacecilia.backend.entity.Curso;
import com.anacecilia.backend.entity.Leccion;
import com.anacecilia.backend.entity.Modulo;
import com.anacecilia.backend.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CursoService {

    private final CursoRepository cursoRepository;

    public List<CursoResponse> listarCursosPublicos() {
        return cursoRepository.findByPublicadoTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<CursoResponse> listarTodosCursos() {
        return cursoRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CursoResponse obtenerCursoPorId(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con ID: " + id));
        if (!curso.getPublicado()) {
            throw new RuntimeException("Curso no encontrado");
        }
        return toResponse(curso);
    }

    public CursoResponse obtenerCursoPorIdAdmin(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con ID: " + id));
        return toResponse(curso);
    }

    @Transactional
    public CursoResponse crearCurso(CursoRequest request) {
        Curso curso = Curso.builder()
                .titulo(request.getTitulo())
                .descripcion(request.getDescripcion())
                .precio(request.getPrecio())
                .imagen(request.getImagen())
                .categoria(request.getCategoria())
                .duracion(request.getDuracion())
                .nivel(request.getNivel())
                .modalidad(request.getModalidad())
                .publicado(request.getPublicado() != null ? request.getPublicado() : false)
                .destacado(request.getDestacado() != null ? request.getDestacado() : false)
                .contenido(request.getContenido())
                .requisitos(request.getRequisitos())
                .instructor(request.getInstructor())
                .introVideoUrl(request.getIntroVideoUrl())
                .build();

        applyModulos(curso, request.getModulos());

        return toResponse(cursoRepository.save(curso));
    }

    @Transactional
    public CursoResponse actualizarCurso(Long id, CursoRequest request) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con ID: " + id));

        curso.setTitulo(request.getTitulo());
        curso.setDescripcion(request.getDescripcion());
        curso.setPrecio(request.getPrecio());
        curso.setImagen(request.getImagen());
        curso.setCategoria(request.getCategoria());
        curso.setDuracion(request.getDuracion());
        curso.setNivel(request.getNivel());
        curso.setModalidad(request.getModalidad());
        if (request.getPublicado() != null) curso.setPublicado(request.getPublicado());
        if (request.getDestacado() != null) curso.setDestacado(request.getDestacado());
        curso.setContenido(request.getContenido());
        curso.setRequisitos(request.getRequisitos());
        curso.setInstructor(request.getInstructor());
        curso.setIntroVideoUrl(request.getIntroVideoUrl());

        if (request.getModulos() != null) {
            curso.getModulos().clear();
            applyModulos(curso, request.getModulos());
        }

        return toResponse(cursoRepository.save(curso));
    }

    @Transactional
    public void eliminarCurso(Long id) {
        if (!cursoRepository.existsById(id)) {
            throw new RuntimeException("Curso no encontrado con ID: " + id);
        }
        cursoRepository.deleteById(id);
    }

    private void applyModulos(Curso curso, List<ModuloDto> modulosDto) {
        if (modulosDto == null) return;
        int mIndex = 0;
        for (ModuloDto md : modulosDto) {
            Modulo modulo = Modulo.builder()
                    .titulo(md.getTitulo())
                    .orden(md.getOrden() != null ? md.getOrden() : mIndex++)
                    .curso(curso)
                    .lecciones(new ArrayList<>())
                    .build();
            int lIndex = 0;
            if (md.getLecciones() != null) {
                for (LeccionDto ld : md.getLecciones()) {
                    Leccion leccion = Leccion.builder()
                            .titulo(ld.getTitulo())
                            .duracion(ld.getDuracion())
                            .tipo(ld.getTipo() != null ? ld.getTipo() : "video")
                            .videoUrl(ld.getVideoUrl())
                            .pdfUrl(ld.getPdfUrl())
                            .quizJson(ld.getQuizJson())
                            .orden(ld.getOrden() != null ? ld.getOrden() : lIndex++)
                            .modulo(modulo)
                            .build();
                    modulo.getLecciones().add(leccion);
                }
            }
            curso.getModulos().add(modulo);
        }
    }

    private CursoResponse toResponse(Curso curso) {
        List<ModuloDto> modulos = curso.getModulos() == null ? new ArrayList<>() :
                curso.getModulos().stream().map(this::toModuloDto).collect(Collectors.toList());

        return CursoResponse.builder()
                .id(curso.getId())
                .titulo(curso.getTitulo())
                .descripcion(curso.getDescripcion())
                .precio(curso.getPrecio())
                .imagen(curso.getImagen())
                .categoria(curso.getCategoria())
                .duracion(curso.getDuracion())
                .nivel(curso.getNivel())
                .modalidad(curso.getModalidad())
                .publicado(curso.getPublicado())
                .destacado(curso.getDestacado())
                .contenido(curso.getContenido())
                .requisitos(curso.getRequisitos())
                .instructor(curso.getInstructor())
                .introVideoUrl(curso.getIntroVideoUrl())
                .createdAt(curso.getCreatedAt())
                .updatedAt(curso.getUpdatedAt())
                .modulos(modulos)
                .build();
    }

    private ModuloDto toModuloDto(Modulo m) {
        List<LeccionDto> lecciones = m.getLecciones() == null ? new ArrayList<>() :
                m.getLecciones().stream().map(l -> LeccionDto.builder()
                        .id(l.getId())
                        .titulo(l.getTitulo())
                        .duracion(l.getDuracion())
                        .tipo(l.getTipo())
                        .videoUrl(l.getVideoUrl())
                        .pdfUrl(l.getPdfUrl())
                        .quizJson(l.getQuizJson())
                        .orden(l.getOrden())
                        .build()).collect(Collectors.toList());
        return ModuloDto.builder()
                .id(m.getId())
                .titulo(m.getTitulo())
                .orden(m.getOrden())
                .lecciones(lecciones)
                .build();
    }
}
