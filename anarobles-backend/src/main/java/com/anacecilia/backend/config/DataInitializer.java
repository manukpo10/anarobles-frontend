package com.anacecilia.backend.config;

import com.anacecilia.backend.entity.Articulo;
import com.anacecilia.backend.entity.Curso;
import com.anacecilia.backend.entity.Obra;
import com.anacecilia.backend.entity.Producto;
import com.anacecilia.backend.entity.Role;
import com.anacecilia.backend.entity.Usuario;
import com.anacecilia.backend.repository.ArticuloRepository;
import com.anacecilia.backend.repository.CursoRepository;
import com.anacecilia.backend.repository.ObraRepository;
import com.anacecilia.backend.repository.ProductoRepository;
import com.anacecilia.backend.repository.RoleRepository;
import com.anacecilia.backend.repository.UsuarioRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final RoleRepository roleRepository;
    private final UsuarioRepository usuarioRepository;
    private final CursoRepository cursoRepository;
    private final ProductoRepository productoRepository;
    private final ObraRepository obraRepository;
    private final ArticuloRepository articuloRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        crearRolSiNoExiste(Role.RoleName.ADMIN);
        crearRolSiNoExiste(Role.RoleName.USER);

        crearAdminSiNoExiste();
        crearUsuarioTestSiNoExiste();
        crearCursosSiNoExisten();
        crearProductosSiNoExisten();
        crearObrasSiNoExisten();
        crearArticulosSiNoExisten();

        log.info("Datos iniciales cargados correctamente");
    }

    /**
     * Migra los 6 artículos que vivían hardcodeados en lib/articulos.ts. Se leen de
     * seed-articulos.json (generado desde ese mismo archivo) en vez de escribirse como
     * literales Java: el cuerpo de cada artículo es Markdown largo con comillas,
     * backticks y saltos de línea, y escaparlo a mano es una fuente de errores
     * silenciosos en el contenido publicado.
     */
    private void crearArticulosSiNoExisten() {
        if (articuloRepository.count() > 0) return;

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        try (InputStream in = new ClassPathResource("seed-articulos.json").getInputStream()) {
            List<SeedArticulo> semillas = mapper.readValue(in, new TypeReference<List<SeedArticulo>>() {});
            for (SeedArticulo s : semillas) {
                articuloRepository.save(Articulo.builder()
                        .titulo(s.titulo)
                        .slug(s.slug)
                        .subtitulo(s.subtitulo)
                        .resumen(s.resumen)
                        .categoria(s.categoria)
                        .fechaPublicacion(LocalDate.parse(s.fechaPublicacion))
                        .tiempoLectura(s.tiempoLectura)
                        .imagenDestacada(s.imagenDestacada)
                        .imagenDestacadaAlt(s.imagenDestacadaAlt)
                        .contenido(s.contenido)
                        .metaDescripcion(s.metaDescripcion)
                        .palabrasClave(unirSemilla(s.palabrasClave))
                        .relacionados(unirSemilla(s.relacionados))
                        .destacado(Boolean.TRUE.equals(s.destacado))
                        .publicado(true)
                        .build());
            }
            log.info("Artículos iniciales creados: {}", semillas.size());
        } catch (IOException e) {
            // No aborta el arranque: el frontend cae al array estático si /api/articulos
            // viene vacío, así que un seed fallido degrada en vez de romper el sitio.
            log.error("No se pudieron cargar los artículos iniciales desde seed-articulos.json", e);
        }
    }

    private String unirSemilla(List<String> valores) {
        if (valores == null || valores.isEmpty()) return null;
        return String.join(",", valores);
    }

    /** Forma de cada entrada de seed-articulos.json. */
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
    static class SeedArticulo {
        public String titulo;
        public String slug;
        public String subtitulo;
        public String resumen;
        public String categoria;
        public String fechaPublicacion;
        public Integer tiempoLectura;
        public String imagenDestacada;
        public String imagenDestacadaAlt;
        public String contenido;
        public String metaDescripcion;
        public List<String> palabrasClave;
        public List<String> relacionados;
        public Boolean destacado;
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
            log.info("Usuario admin creado: admin@anacecilia.art (contraseña inicial por defecto — cambiarla cuanto antes)");
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
            log.info("Usuario test creado: test@anacecilia.art (contraseña inicial por defecto)");
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

    private void crearObrasSiNoExisten() {
        if (obraRepository.count() == 0) {
            // Transcripción exacta de anarobles-frontend/lib/obras.ts (id/slug, título,
            // categoría, año, técnica, dimensiones, disponibilidad, destacada, imagen,
            // imgW/imgH). precio queda null: lo carga la titular desde el admin. Las
            // imágenes migradas mantienen su ruta estática /galeria/*, no se re-suben a
            // Storage (solo las cargas nuevas desde el admin van a Supabase Storage).

            // ── RETRATOS ──────────────────────────────────────────────────
            obraRepository.save(Obra.builder()
                    .titulo("Ella").slug("ella")
                    .categoria("retratos").anio(2022)
                    .tecnica("Dibujo en grafito").dimensiones("24 × 30 cm")
                    .disponibilidad("consultar").destacada(true)
                    .imagen("/galeria/ella.jpeg").imgW(825).imgH(1123)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Etnia").slug("etnia")
                    .categoria("retratos").anio(2025)
                    .tecnica("Dibujo sobre papel — pastel y grafito").dimensiones("21 × 28 cm")
                    .disponibilidad("disponible").destacada(false)
                    .imagen("/galeria/etnia.jpeg").imgW(535).imgH(753)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Niña").slug("nina")
                    .categoria("retratos").anio(2022)
                    .tecnica("Acuarela").dimensiones("19 × 28 cm")
                    .disponibilidad("consultar").destacada(true)
                    .imagen("/galeria/nina.jpeg").imgW(2339).imgH(3399)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Titana").slug("titana")
                    .categoria("retratos").anio(2021)
                    .tecnica("Dibujo en grafito sobre papel").dimensiones("21 × 28 cm")
                    .disponibilidad("disponible").destacada(false)
                    .imagen("/galeria/titana.jpg").imgW(1440).imgH(2196)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Melpómene").slug("melpomene")
                    .categoria("retratos").anio(2025)
                    .tecnica("Dibujo sobre papel — técnica mixta").dimensiones("21 × 28 cm")
                    .disponibilidad("disponible").destacada(false)
                    .imagen("/galeria/melpomene.jpg").imgW(583).imgH(768)
                    .publicado(true).build());

            // ── NATURALEZA ────────────────────────────────────────────────
            obraRepository.save(Obra.builder()
                    .titulo("Abrazo").slug("abrazo")
                    .categoria("naturaleza").anio(2024)
                    .tecnica("Acuarela sobre papel").dimensiones("25 × 35 cm")
                    .disponibilidad("disponible").destacada(true)
                    .imagen("/galeria/abrazo.jpeg").imgW(720).imgH(1009)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Acuarela bordada floral abstracta").slug("acuarela-bordada-floral")
                    .categoria("naturaleza").anio(2022)
                    .tecnica("Acuarela bordada").dimensiones("21 × 28 cm")
                    .disponibilidad("disponible").destacada(false)
                    .imagen("/galeria/acuarela-bordada-floral.jpeg").imgW(775).imgH(1022)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Amistad").slug("amistad")
                    .categoria("naturaleza").anio(2023)
                    .tecnica("Técnica mixta — acuarela bordada").dimensiones("15 × 21 cm")
                    .disponibilidad("consultar").destacada(false)
                    .imagen("/galeria/amistad.jpg").imgW(563).imgH(846)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Amistad 2").slug("amistad-2")
                    .categoria("naturaleza").anio(2023)
                    .tecnica("Acuarela bordada").dimensiones("15 × 21 cm")
                    .disponibilidad("consultar").destacada(false)
                    .imagen("/galeria/amistad-2.jpg").imgW(578).imgH(876)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Flor de Jacarandá").slug("flor-de-jacaranda")
                    .categoria("naturaleza").anio(2024)
                    .tecnica("Acuarela bordada").dimensiones("14 × 21 cm")
                    .disponibilidad("disponible").destacada(false)
                    .imagen("/galeria/flor-de-jacaranda.jpeg").imgW(654).imgH(959)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Flores azules").slug("flores-azules")
                    .categoria("naturaleza").anio(2021)
                    .tecnica("Acuarela").dimensiones("21 × 28 cm")
                    .disponibilidad("disponible").destacada(false)
                    .imagen("/galeria/flores-azules.jpeg").imgW(616).imgH(912)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Flores naranja").slug("flores-naranja")
                    .categoria("naturaleza").anio(2022)
                    .tecnica("Acuarela").dimensiones("21 × 28 cm")
                    .disponibilidad("disponible").destacada(false)
                    .imagen("/galeria/flores-naranja.jpeg").imgW(512).imgH(716)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Geranios en flor").slug("geranios-en-flor")
                    .categoria("naturaleza").anio(2023)
                    .tecnica("Acuarela").dimensiones("21 × 28 cm")
                    .disponibilidad("consultar").destacada(false)
                    .imagen("/galeria/geranios-en-flor.jpg").imgW(774).imgH(1105)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Lavandas").slug("lavandas")
                    .categoria("naturaleza").anio(2025)
                    .tecnica("Acuarela bordada sobre papel").dimensiones("25 × 35 cm")
                    .disponibilidad("disponible").destacada(false)
                    .imagen("/galeria/lavandas.jpg").imgW(906).imgH(1226)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Mi Jacarandá").slug("mi-jacaranda")
                    .categoria("naturaleza").anio(2024)
                    .tecnica("Acuarela").dimensiones("14 × 21 cm")
                    .disponibilidad("vendida").destacada(false)
                    .imagen("/galeria/mi-jacaranda.jpeg").imgW(747).imgH(1133)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Nido").slug("nido")
                    .categoria("naturaleza").anio(2024)
                    .tecnica("Acuarela").dimensiones("30 × 40 cm")
                    .disponibilidad("vendida").destacada(true)
                    .imagen("/galeria/nido.jpg").imgW(1536).imgH(2048)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Olivo").slug("olivo")
                    .categoria("naturaleza").anio(2025)
                    .tecnica("Acuarela bordada sobre papel").dimensiones("24 × 30 cm")
                    .disponibilidad("consultar").destacada(false)
                    .imagen("/galeria/olivo.jpeg").imgW(882).imgH(1106)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Otoño").slug("otono")
                    .categoria("naturaleza").anio(2025)
                    .tecnica("Acuarela bordada").dimensiones("15 × 21 cm")
                    .disponibilidad("disponible").destacada(false)
                    .imagen("/galeria/otono.jpeg").imgW(706).imgH(1057)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Pétalos de rosa").slug("petalos-de-rosa")
                    .categoria("naturaleza").anio(2024)
                    .tecnica("Acuarela").dimensiones("14 × 14 cm")
                    .disponibilidad("vendida").destacada(false)
                    .imagen("/galeria/petalos-de-rosa.jpeg").imgW(1254).imgH(1280)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Santa Rita").slug("santa-rita")
                    .categoria("naturaleza").anio(2020)
                    .tecnica("Acuarela sobre papel").dimensiones("21 × 28 cm")
                    .disponibilidad("disponible").destacada(false)
                    .imagen("/galeria/santa-rita.jpeg").imgW(764).imgH(1116)
                    .publicado(true).build());
            obraRepository.save(Obra.builder()
                    .titulo("Sin detalle en las hojas").slug("sin-detalle-en-las-hojas")
                    .categoria("naturaleza").anio(2025)
                    .tecnica("Acuarela y pastel").dimensiones("14 × 21 cm")
                    .disponibilidad("disponible").destacada(false)
                    .imagen("/galeria/sin-detalle-en-las-hojas.jpg").imgW(686).imgH(1066)
                    .publicado(true).build());

            log.info("Obras de ejemplo creadas");
        }
    }
}