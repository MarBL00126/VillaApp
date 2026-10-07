package mariano.projects.appVillaSanMartin.services;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    StoredFile upload(MultipartFile file, String target);

    record StoredFile(String url, String fileName) {
    }
}
