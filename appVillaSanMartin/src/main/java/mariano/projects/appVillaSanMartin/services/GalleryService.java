package mariano.projects.appVillaSanMartin.services;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.models.dto.GalleryDto;
import mariano.projects.appVillaSanMartin.models.dto.PhotoDto;
import mariano.projects.appVillaSanMartin.repositories.GalleryRepository;
import mariano.projects.appVillaSanMartin.repositories.PhotoRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class GalleryService {
    private final GalleryRepository galleryRepo;
    private final PhotoRepository photoRepo;

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "galleries-page")
    public Page<GalleryDto> getAll(Pageable pageable) {
        return galleryRepo.findAllByOrderByEventDateDesc(pageable).map(GalleryDto::from);
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "gallery-detail", key = "#id")
    public GalleryDto getById(int id) {
        return GalleryDto.from(galleryRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "gallery-photos-page", key = "#galleryId + ':' + #pageable.pageNumber + ':' + #pageable.pageSize")
    public Page<PhotoDto> getPhotos(int galleryId, Pageable pageable) {
        return photoRepo.findByGalleryIdOrderBySortOrder(galleryId, pageable).map(PhotoDto::from);
    }
}
