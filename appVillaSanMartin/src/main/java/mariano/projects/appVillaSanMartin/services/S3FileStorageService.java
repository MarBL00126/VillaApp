package mariano.projects.appVillaSanMartin.services;

import java.io.IOException;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Service
@ConditionalOnBean(S3Client.class)
public class S3FileStorageService implements FileStorageService {
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp", "gif");

    private final S3Client s3Client;
    private final String bucketName;
    private final String publicUrl;

    public S3FileStorageService(
            S3Client s3Client,
            @Value("${storage.bucket}") String bucketName,
            @Value("${storage.public-url}") String publicUrl) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
        this.publicUrl = publicUrl.replaceAll("/+$", "");
    }

    @Override
    public StoredFile upload(MultipartFile file, String target) {
        String extension = extensionOf(file.getOriginalFilename());
        String cleanTarget = sanitizeTarget(target);
        String filename = UUID.randomUUID() + "." + extension;
        String key = cleanTarget + "/" + filename;

        PutObjectRequest.Builder requestBuilder = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .contentLength(file.getSize());

        PutObjectRequest request = requestBuilder.build();

        try {
            s3Client.putObject(
                    request,
                    RequestBody.fromInputStream(
                            file.getInputStream(),
                            file.getSize()
                    )
            );

            return new StoredFile(publicUrl + "/" + key, filename);
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "No se pudo leer la imagen",
                    e
            );
        } catch (S3Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "No se pudo guardar la imagen",
                    e
            );
        }
    }

    private String extensionOf(String originalFilename) {
        if (originalFilename == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nombre de archivo requerido"
            );
        }
        int dot = originalFilename.lastIndexOf('.');
        if (dot < 0 || dot == originalFilename.length() - 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Extension de imagen requerida");
        }

        String extension = originalFilename.substring(dot + 1).toLowerCase(Locale.ROOT);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Formato de imagen no permitido"
            );
        }
        return extension;
    }

    private String sanitizeTarget(String target) {
        String clean = target == null ? "general" : target.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9-]", "-");
        clean = clean.replaceAll("-+", "-").replaceAll("^-|-$", "");
        return clean.isBlank() ? "general" : clean;
    }
}
