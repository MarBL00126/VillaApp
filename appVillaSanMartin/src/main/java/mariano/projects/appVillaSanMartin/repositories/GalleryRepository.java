package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.GalleryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface GalleryRepository extends JpaRepository<GalleryEntity, Integer> {
    List<GalleryEntity> findAllByOrderByEventDateDesc();
    Page<GalleryEntity> findAllByOrderByEventDateDesc(Pageable pageable);
}
