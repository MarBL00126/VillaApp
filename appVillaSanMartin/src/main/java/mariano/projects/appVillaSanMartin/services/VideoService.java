package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.VideoEntity;
import mariano.projects.appVillaSanMartin.repositories.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@Service
@RequiredArgsConstructor
public class VideoService {
    private final VideoRepository videoRepo;
    public List<VideoEntity> getAll() { return videoRepo.findAllByOrderByPublishedAtDesc(); }
    public List<VideoEntity> getByType(String type) { return videoRepo.findByTypeOrderByPublishedAtDesc(type); }
    public VideoEntity getById(int id) { return videoRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)); }
}
