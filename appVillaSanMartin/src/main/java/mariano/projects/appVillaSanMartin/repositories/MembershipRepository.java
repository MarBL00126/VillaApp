package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.MembershipEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface MembershipRepository extends JpaRepository<MembershipEntity, Integer> {
    Optional<MembershipEntity> findByUser_Id(int userId);
    Optional<MembershipEntity> findByMemberNumber(String memberNumber);
    boolean existsByUser_Id(int userId);
}
