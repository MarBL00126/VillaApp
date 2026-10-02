package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.VideoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface VideoRepository extends JpaRepository<VideoEntity, Integer> {
    List<VideoEntity> findByTypeOrderByPublishedAtDesc(String type);
    List<VideoEntity> findAllByOrderByPublishedAtDesc();
    Page<VideoEntity> findByTypeOrderByPublishedAtDesc(String type, Pageable pageable);
    Page<VideoEntity> findAllByOrderByPublishedAtDesc(Pageable pageable);
}
