package mariano.projects.appVillaSanMartin.services;

import java.util.List;

import org.springframework.stereotype.Service;

import mariano.projects.appVillaSanMartin.entities.TicketTypeEntity;
import mariano.projects.appVillaSanMartin.repositories.TicketTypeRepository;

@Service
public class TicketTypeService {
    private TicketTypeRepository ticketTypeRepository;

    public TicketTypeService(TicketTypeRepository ticketTypeRepository) {
        this.ticketTypeRepository = ticketTypeRepository;
    }

    public List<TicketTypeEntity> getByMatchId(int matchId) {
        return ticketTypeRepository.findByMatchId(matchId);
    }
}
