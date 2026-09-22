package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.CouponEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface CouponRepository extends JpaRepository<CouponEntity, Integer> {
    Optional<CouponEntity> findByCode(String code);
}
