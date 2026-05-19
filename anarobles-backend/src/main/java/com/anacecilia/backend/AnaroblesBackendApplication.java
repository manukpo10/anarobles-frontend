package com.anacecilia.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AnaroblesBackendApplication {

    public static void main(String[] args) {
        // Cargar .env para desarrollo local y setear como propiedades del sistema
        // Así Spring puede leerlas antes de inicializar el contexto
        try {
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMissing()
                    .load();

            dotenv.entries().forEach(entry -> {
                if (!System.getenv().containsKey(entry.getKey())) {
                    System.setProperty(entry.getKey(), entry.getValue());
                }
            });
        } catch (Exception e) {
            // Ignorar errores - en producción las variables ya están configuradas
        }

        SpringApplication.run(AnaroblesBackendApplication.class, args);
    }
}