package mariano.projects.appVillaSanMartin.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mariano.projects.appVillaSanMartin.entities.ReservationEntity;
import mariano.projects.appVillaSanMartin.entities.ReservationStatus;
import mariano.projects.appVillaSanMartin.entities.TicketTypeEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.repositories.ReservationRepository;
import mariano.projects.appVillaSanMartin.repositories.TicketTypeRepository;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final TicketTypeRepository ticketTypeRepository;

    public ReservationService(
            ReservationRepository reservationRepository,
            TicketTypeRepository ticketTypeRepository) {

        this.reservationRepository = reservationRepository;
        this.ticketTypeRepository = ticketTypeRepository;
    }

    @Transactional
    public ReservationEntity createReservation(
            UserEntity user,
            int ticketTypeId,
            int quantity) {

        if (quantity <= 0) {
            throw new RuntimeException(
                    "La cantidad debe ser mayor a 0");
        }

        TicketTypeEntity ticketType = ticketTypeRepository
                .findByIdWithLock(ticketTypeId)
                .orElseThrow(() -> new RuntimeException(
                        "Tipo de entrada no encontrado"));

        if (ticketType.getAvailableQuantity() < quantity) {
            throw new RuntimeException(
                    "No hay suficientes entradas disponibles");
        }

        ticketType.setAvailableQuantity(
                ticketType.getAvailableQuantity() - quantity);

        ticketTypeRepository.save(ticketType);

        ReservationEntity reservation = new ReservationEntity();

        reservation.setUser(user);
        reservation.setTicketType(ticketType);
        reservation.setQuantity(quantity);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setExpiresAt(
                LocalDateTime.now().plusMinutes(15));

        return reservationRepository.save(reservation);
    }

    public List<ReservationEntity> getByUserId(int userId) {
        return reservationRepository.findByUserId(userId);
    }

    @Transactional
    public void cancelReservation(int reservationId, int userId) {

        ReservationEntity reservation = reservationRepository
                .findById(reservationId)
                .orElseThrow(() -> new RuntimeException(
                        "Reserva no encontrada"));

        if (reservation.getUser().getId() != userId) {
            throw new RuntimeException(
                    "No tenés permiso para cancelar esta reserva");
        }

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new RuntimeException(
                    "La reserva no puede ser cancelada");
        }

        TicketTypeEntity ticketType = reservation.getTicketType();

        ticketType.setAvailableQuantity(
                ticketType.getAvailableQuantity()
                        + reservation.getQuantity());

        ticketTypeRepository.save(ticketType);

        reservation.setStatus(ReservationStatus.CANCELLED);

        reservationRepository.save(reservation);
    }

    @Transactional
    @Scheduled(fixedRate = 60000, initialDelay = 30000)
    public void expireReservations() {

        LocalDateTime now = LocalDateTime.now();

        List<ReservationEntity> expiredReservations = reservationRepository
                .findByStatusAndExpiresAtBefore(
                        ReservationStatus.PENDING,
                        now);

        for (ReservationEntity reservation : expiredReservations) {

            TicketTypeEntity ticketType = reservation.getTicketType();

            ticketType.setAvailableQuantity(
                    ticketType.getAvailableQuantity()
                            + reservation.getQuantity());

            ticketTypeRepository.save(ticketType);

            reservation.setStatus(
                    ReservationStatus.EXPIRED);

            reservationRepository.save(reservation);
        }
    }
}