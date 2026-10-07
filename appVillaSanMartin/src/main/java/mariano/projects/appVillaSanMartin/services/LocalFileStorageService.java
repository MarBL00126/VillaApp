package mariano.projects.appVillaSanMartin.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@ConditionalOnExpression(
        "'${storage.endpoint:}' == '' || '${storage.access-key:}' == '' || '${storage.secret-key:}' == ''"
                + " || '${storage.bucket:}' == '' || '${storage.public-url:}' == ''"
)
public class LocalFileStorageService implements FileStorageService {
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp", "gif");

    private final Path uploadRoot;
    private final String baseUrl;

    public LocalFileStorageService(
            @Value("${app.upload-dir:uploads}") String uploadDir,
            @Value("${app.base-url:http://localhost:8080}") String baseUrl) {
        this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
        this.baseUrl = baseUrl.replaceAll("/+$", "");
    }

    @Override
    public StoredFile upload(MultipartFile file, String target) {
        String extension = extensionOf(file.getOriginalFilename());
        String cleanTarget = sanitizeTarget(target);
        String filename = UUID.randomUUID() + "." + extension;
        Path targetDir = uploadRoot.resolve(cleanTarget).normalize();
        Path destination = targetDir.resolve(filename).normalize();

        if (!destination.startsWith(uploadRoot)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Destino invalido");
        }

        try {
            Files.createDirectories(targetDir);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo guardar la imagen", ex);
        }

        return new StoredFile(baseUrl + "/uploads/" + cleanTarget + "/" + filename, filename);
    }

    private String extensionOf(String originalFilename) {
        if (originalFilename == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nombre de archivo requerido");
        }
        int dot = originalFilename.lastIndexOf('.');
        if (dot < 0 || dot == originalFilename.length() - 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Extension de imagen requerida");
        }

        String extension = originalFilename.substring(dot + 1).toLowerCase(Locale.ROOT);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato de imagen no permitido");
        }
        return extension;
    }

    private String sanitizeTarget(String target) {
        String clean = target == null ? "general" : target.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9-]", "-");
        clean = clean.replaceAll("-+", "-").replaceAll("^-|-$", "");
        return clean.isBlank() ? "general" : clean;
    }
}
