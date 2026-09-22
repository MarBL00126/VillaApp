package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.MembershipTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface MembershipTypeRepository extends JpaRepository<MembershipTypeEntity, Integer> {
    List<MembershipTypeEntity> findByActiveTrue();
}
