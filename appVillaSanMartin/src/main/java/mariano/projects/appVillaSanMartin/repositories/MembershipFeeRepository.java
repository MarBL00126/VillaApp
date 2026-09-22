package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.MembershipFeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface MembershipFeeRepository extends JpaRepository<MembershipFeeEntity, Integer> {
    List<MembershipFeeEntity> findByMembership_Id(int membershipId);
    List<MembershipFeeEntity> findByMembership_IdAndStatusIn(int membershipId, List<String> statuses);
    Optional<MembershipFeeEntity> findByMembership_IdAndMonthAndYear(int membershipId, int month, int year);
}
