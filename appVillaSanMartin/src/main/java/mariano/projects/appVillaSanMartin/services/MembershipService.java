package mariano.projects.appVillaSanMartin.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.MembershipEntity;
import mariano.projects.appVillaSanMartin.entities.MembershipFeeEntity;
import mariano.projects.appVillaSanMartin.entities.MembershipTypeEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.dto.DigitalCardDto;
import mariano.projects.appVillaSanMartin.models.dto.MembershipDto;
import mariano.projects.appVillaSanMartin.models.dto.MembershipTypeDto;
import mariano.projects.appVillaSanMartin.repositories.MembershipFeeRepository;
import mariano.projects.appVillaSanMartin.repositories.MembershipRepository;
import mariano.projects.appVillaSanMartin.repositories.MembershipTypeRepository;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;

@Service
@RequiredArgsConstructor
public class MembershipService {
    private final MembershipTypeRepository membershipTypeRepo;
    private final MembershipRepository membershipRepo;
    private final MembershipFeeRepository feeRepo;
    private final UserRepository userRepo;

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "membership-types")
    public List<MembershipTypeDto> getTypes() {
        return membershipTypeRepo.findByActiveTrue().stream()
                .map(MembershipTypeDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<MembershipDto> findMyMembership(int userId) {
        return membershipRepo.findByUser_Id(userId)
                .map(MembershipDto::from);
    }

    public boolean isMember(int userId) {
        return membershipRepo.existsByUser_Id(userId);
    }

    public boolean isActiveMember(int userId) {
        return membershipRepo.findByUser_Id(userId)
                .map(m -> "ACTIVE".equals(m.getStatus()))
                .orElse(false);
    }

    @Transactional
    public MembershipDto signup(int userId, int membershipTypeId) {
        if (isMember(userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya sos socio");
        }

        MembershipTypeEntity type = membershipTypeRepo.findById(membershipTypeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

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

        return MembershipDto.from(membership);
    }

    @Transactional
    public MembershipDto cancel(int userId) {
        MembershipEntity membership = getMembershipEntity(userId);
        membership.setStatus("CANCELLED");
        membership.setExpiresAt(LocalDateTime.now());
        return MembershipDto.from(membershipRepo.save(membership));
    }

    @Transactional(readOnly = true)
    public MembershipDto getMemberByNumber(String memberNumber) {
        return MembershipDto.from(membershipRepo.findByMemberNumber(memberNumber)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
    }

    @Transactional(readOnly = true)
    public DigitalCardDto getDigitalCard(int userId) {
        return DigitalCardDto.from(getMembershipEntity(userId));
    }

    private MembershipEntity getMembershipEntity(int userId) {
        return membershipRepo.findByUser_Id(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}
