package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.MembershipEntity;
import mariano.projects.appVillaSanMartin.entities.MembershipTypeEntity;
import mariano.projects.appVillaSanMartin.entities.MembershipFeeEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.repositories.MembershipRepository;
import mariano.projects.appVillaSanMartin.repositories.MembershipTypeRepository;
import mariano.projects.appVillaSanMartin.repositories.MembershipFeeRepository;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
@Service
@RequiredArgsConstructor
public class MembershipService {
    private final MembershipTypeRepository membershipTypeRepo;
    private final MembershipRepository membershipRepo;
    private final MembershipFeeRepository feeRepo;
    private final UserRepository userRepo;
    public List<MembershipTypeEntity> getTypes() {
        return membershipTypeRepo.findByActiveTrue();
    }
    public MembershipEntity getMyMembership(int userId) {
        return membershipRepo.findByUser_Id(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    public Optional<MembershipEntity> findMyMembership(int userId) {
        return membershipRepo.findByUser_Id(userId);
    }
    public boolean isMember(int userId) {
        return membershipRepo.existsByUser_Id(userId);
    }
    public boolean isActiveMember(int userId) {
        return membershipRepo.findByUser_Id(userId).map(m -> "ACTIVE".equals(m.getStatus())).orElse(false);
    }
    public MembershipEntity signup(int userId, int membershipTypeId) {
        if (isMember(userId)) throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya sos socio");
        MembershipTypeEntity type = membershipTypeRepo.findById(membershipTypeId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        String memberNumber = "VSM" + LocalDate.now().getYear() + String.format("%04d", new Random().nextInt(10000));
        MembershipEntity membership = new MembershipEntity();
        membership.setUser(user);
        membership.setMembershipType(type);
        membership.setStatus("ACTIVE");
        membership.setMemberNumber(memberNumber);
        membership.setJoinedAt(LocalDateTime.now());
        membershipRepo.save(membership);
        
        MembershipFeeEntity fee = new MembershipFeeEntity();
        fee.setMembership(membership);
        fee.setMonth(LocalDate.now().getMonthValue());
        fee.setYear(LocalDate.now().getYear());
        fee.setAmount(type.getMonthlyFee());
        fee.setStatus("PENDING");
        fee.setDueDate(YearMonth.now().atEndOfMonth());
        feeRepo.save(fee);
        return membership;
    }
    public MembershipEntity cancel(int userId) {
        MembershipEntity membership = getMyMembership(userId);
        membership.setStatus("CANCELLED");
        membership.setExpiresAt(LocalDateTime.now());
        return membershipRepo.save(membership);
    }
    public MembershipEntity getMemberByNumber(String memberNumber) {
        return membershipRepo.findByMemberNumber(memberNumber).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    public Map<String, Object> getDigitalCard(int userId) {
        MembershipEntity m = getMyMembership(userId);
        return Map.of(
            "memberNumber", m.getMemberNumber(),
            "fullName", m.getFullName(),
            "name", m.getUser().getName(),
            "surname", m.getUser().getSurname(),
            "type", Map.of("name", m.getMembershipType().getName()),
            "typeName", m.getMembershipType().getName(),
            "status", m.getStatus(),
            "joinedAt", m.getJoinedAt()
        );
    }
}
