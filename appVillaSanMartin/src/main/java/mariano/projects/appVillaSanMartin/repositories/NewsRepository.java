package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.NewsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface NewsRepository extends JpaRepository<NewsEntity, Integer> {
    List<NewsEntity> findByFeaturedTrueOrderByPublishedAtDesc();
    List<NewsEntity> findByCategoryIdOrderByPublishedAtDesc(Integer categoryId);
    List<NewsEntity> findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(String title, String summary);
    Page<NewsEntity> findByCategoryIdOrderByPublishedAtDesc(Integer categoryId, Pageable pageable);
    Page<NewsEntity> findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(String title, String summary, Pageable pageable);
}
