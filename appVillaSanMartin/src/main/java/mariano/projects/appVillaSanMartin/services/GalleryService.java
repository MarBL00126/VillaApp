package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@Service
@RequiredArgsConstructor
public class GalleryService {
    private final GalleryRepository galleryRepo;
    private final PhotoRepository photoRepo;
    public List<GalleryEntity> getAll() { return galleryRepo.findAllByOrderByEventDateDesc(); }
    public GalleryEntity getById(int id) { return galleryRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)); }
    public List<PhotoEntity> getPhotos(int galleryId) { return photoRepo.findByGalleryIdOrderBySortOrder(galleryId); }
}
