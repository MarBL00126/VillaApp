package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.BenefitEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface BenefitRepository extends JpaRepository<BenefitEntity, Integer> {
    List<BenefitEntity> findByActiveTrue();
}
