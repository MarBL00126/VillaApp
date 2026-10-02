package mariano.projects.appVillaSanMartin.services;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mariano.projects.appVillaSanMartin.models.dto.TicketTypeDto;
import mariano.projects.appVillaSanMartin.repositories.TicketTypeRepository;

@Service
public class TicketTypeService {
    private TicketTypeRepository ticketTypeRepository;

    public TicketTypeService(TicketTypeRepository ticketTypeRepository) {
        this.ticketTypeRepository = ticketTypeRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "ticket-types-by-match", key = "#matchId")
    public List<TicketTypeDto> getByMatchId(int matchId) {
        return ticketTypeRepository.findByMatchId(matchId).stream()
                .map(TicketTypeDto::from)
                .toList();
    }
}
