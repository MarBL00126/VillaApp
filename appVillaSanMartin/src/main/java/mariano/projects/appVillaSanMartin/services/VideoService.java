package mariano.projects.appVillaSanMartin.services;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.models.dto.VideoDto;
import mariano.projects.appVillaSanMartin.repositories.VideoRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final VideoRepository videoRepo;

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "videos-page")
    public Page<VideoDto> getAll(Pageable pageable) {
        return videoRepo.findAllByOrderByPublishedAtDesc(pageable).map(VideoDto::from);
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "videos-by-type-page", key = "#type + ':' + #pageable.pageNumber + ':' + #pageable.pageSize")
    public Page<VideoDto> getByType(String type, Pageable pageable) {
        return videoRepo.findByTypeOrderByPublishedAtDesc(type, pageable).map(VideoDto::from);
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "video-detail", key = "#id")
    public VideoDto getById(int id) {
        return VideoDto.from(videoRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
    }
}
