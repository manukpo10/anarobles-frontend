package com.anacecilia.backend.config;

import com.anacecilia.backend.entity.Curso;
import com.anacecilia.backend.entity.Producto;
import com.anacecilia.backend.entity.Role;
import com.anacecilia.backend.entity.Usuario;
import com.anacecilia.backend.repository.CursoRepository;
import com.anacecilia.backend.repository.ProductoRepository;
import com.anacecilia.backend.repository.RoleRepository;
import com.anacecilia.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final RoleRepository roleRepository;
    private final UsuarioRepository usuarioRepository;
    private final CursoRepository cursoRepository;
    private final ProductoRepository productoRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        crearRolSiNoExiste(Role.RoleName.ADMIN);
        crearRolSiNoExiste(Role.RoleName.USER);
        
        crearAdminSiNoExiste();
        crearUsuarioTestSiNoExiste();
        crearCursosSiNoExisten();
        crearProductosSiNoExisten();
        
        log.info("Datos iniciales cargados correctamente");
    }
    
    private void crearRolSiNoExiste(Role.RoleName nombre) {
        if (!roleRepository.findByName(nombre).isPresent()) {
            Role role = new Role();
            role.setName(nombre);
            roleRepository.save(role);
            log.info("Rol {} creado", nombre);
        }
    }
    
    private void crearAdminSiNoExiste() {
        if (!usuarioRepository.existsByEmail("admin@anacecilia.art")) {
            Role adminRole = roleRepository.findByName(Role.RoleName.ADMIN)
                    .orElseThrow(() -> new RuntimeException("Rol ADMIN no encontrado"));
            
            Usuario admin = Usuario.builder()
                    .nombre("Ana Cecilia Robles")
                    .email("admin@anacecilia.art")
                    .password(passwordEncoder.encode("admin123"))
                    .role(adminRole)
                    .activo(true)
                    .avatar("/artist-portrait.jpg")
                    .build();
            
            usuarioRepository.save(admin);
            log.info("Usuario admin creado: admin@anacecilia.art / admin123");
        }
    }
    
    private void crearUsuarioTestSiNoExiste() {
        if (!usuarioRepository.existsByEmail("test@anacecilia.art")) {
            Role userRole = roleRepository.findByName(Role.RoleName.USER)
                    .orElseThrow(() -> new RuntimeException("Rol USER no encontrado"));
            
            Usuario testUser = Usuario.builder()
                    .nombre("Usuario Prueba")
                    .email("test@anacecilia.art")
                    .password(passwordEncoder.encode("test123"))
                    .role(userRole)
                    .activo(true)
                    .build();
            
            usuarioRepository.save(testUser);
            log.info("Usuario test creado: test@anacecilia.art / test123");
        }
    }
    
    private void crearCursosSiNoExisten() {
        if (cursoRepository.count() == 0) {
            cursoRepository.save(Curso.builder()
                    .titulo("Pintura al Óleo para Principiantes")
                    .descripcion("Aprende los fundamentos de la pintura al óleo desde cero. Técnicas de mezcla, aplicación y composición básica.")
                    .precio(15000.0)
                    .imagen("/artwork-1.jpg")
                    .categoria("Pintura")
                    .duracion("8 semanas")
                    .nivel("Principiante")
                    .publicado(true)
                    .contenido("Introducción a los materiales| Técnicas de mezcla| Composiciones básicas| Proyectos prácticos")
                    .requisitos("No se requiere experiencia previa")
                    .instructor("Ana Cecilia Robles")
                    .build());
            
            cursoRepository.save(Curso.builder()
                    .titulo("Acuarela: expresionismo floral")
                    .descripcion("Domina la técnica de la acuarela creando composiciones florales únicas y expresivas.")
                    .precio(12000.0)
                    .imagen("/artwork-2.jpg")
                    .categoria("Pintura")
                    .duracion("6 semanas")
                    .nivel("Intermedio")
                    .publicado(true)
                    .contenido("Control del agua| Capas y transparencias| Composición floral| Estilos expresivos")
                    .requisitos("Conocimientos básicos de acuarela")
                    .instructor("Ana Cecilia Robles")
                    .build());
            
            cursoRepository.save(Curso.builder()
                    .titulo("Dibujo artístico avanzado")
                    .descripcion("Perfecciona tus técnicas de dibujo con estudio de anatomía, iluminación y composición.")
                    .precio(18000.0)
                    .imagen("/artwork-3.jpg")
                    .categoria("Dibujo")
                    .duracion("10 semanas")
                    .nivel("Avanzado")
                    .publicado(true)
                    .contenido("Anatomía artística| Luz y sombra| Composiciones complejas| Portafolio profesional")
                    .requisitos("Experiencia previa en dibujo")
                    .instructor("Ana Cecilia Robles")
                    .build());
            
            log.info("Cursos de ejemplo creados");
        }
    }

    private void crearProductosSiNoExisten() {
        if (productoRepository.count() == 0) {
            productoRepository.save(Producto.builder()
                    .nombre("Print Despertar Carmesí")
                    .descripcion("Impresión de alta calidad en papel fine art. Edición limitada de 50 unidades.")
                    .precio(85.0).imagen("/artwork-1.jpg").categoria("Prints")
                    .destacado(true).publicado(true).stock(50).build());
            productoRepository.save(Producto.builder()
                    .nombre("Print Susurros del Mediterráneo")
                    .descripcion("Impresión giclée en papel algodón 310gsm. Incluye certificado de autenticidad.")
                    .precio(95.0).imagen("/artwork-2.jpg").categoria("Prints")
                    .destacado(true).publicado(true).stock(50).build());
            productoRepository.save(Producto.builder()
                    .nombre("Cuaderno Artístico")
                    .descripcion("Cuaderno de 120 páginas con portada ilustrada. Papel premium 120gsm.")
                    .precio(25.0).imagen("/product-notebook.jpg").categoria("Papelería")
                    .destacado(true).publicado(true).stock(100).build());
            productoRepository.save(Producto.builder()
                    .nombre("Set de Postales")
                    .descripcion("Colección de 8 postales con las obras más emblemáticas.")
                    .precio(18.0).imagen("/product-postcards.jpg").categoria("Papelería")
                    .destacado(false).publicado(true).stock(80).build());
            productoRepository.save(Producto.builder()
                    .nombre("Tote Bag Nebulosa")
                    .descripcion("Bolsa de algodón orgánico con diseño exclusivo.")
                    .precio(32.0).imagen("/product-tote.jpg").categoria("Accesorios")
                    .destacado(false).publicado(true).stock(40).build());
            log.info("Productos de ejemplo creados");
        }
    }
}