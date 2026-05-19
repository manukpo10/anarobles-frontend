package com.anacecilia.backend.service;

import com.anacecilia.backend.dto.ProductoRequest;
import com.anacecilia.backend.dto.ProductoResponse;
import com.anacecilia.backend.entity.Producto;
import com.anacecilia.backend.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    public List<ProductoResponse> listarPublicados() {
        return productoRepository.findByPublicadoTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ProductoResponse> listarTodos() {
        return productoRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductoResponse obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        if (!producto.getPublicado()) {
            throw new RuntimeException("Producto no encontrado");
        }
        return toResponse(producto);
    }

    public ProductoResponse obtenerPorIdAdmin(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        return toResponse(producto);
    }

    @Transactional
    public ProductoResponse crear(ProductoRequest request) {
        Producto producto = Producto.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .precio(request.getPrecio())
                .imagen(request.getImagen())
                .categoria(request.getCategoria())
                .destacado(request.getDestacado() != null ? request.getDestacado() : false)
                .publicado(request.getPublicado() != null ? request.getPublicado() : true)
                .stock(request.getStock())
                .build();
        return toResponse(productoRepository.save(producto));
    }

    @Transactional
    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setImagen(request.getImagen());
        producto.setCategoria(request.getCategoria());
        if (request.getDestacado() != null) producto.setDestacado(request.getDestacado());
        if (request.getPublicado() != null) producto.setPublicado(request.getPublicado());
        producto.setStock(request.getStock());
        return toResponse(productoRepository.save(producto));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }
        productoRepository.deleteById(id);
    }

    private ProductoResponse toResponse(Producto p) {
        return ProductoResponse.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .descripcion(p.getDescripcion())
                .precio(p.getPrecio())
                .imagen(p.getImagen())
                .categoria(p.getCategoria())
                .destacado(p.getDestacado())
                .publicado(p.getPublicado())
                .stock(p.getStock())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
