package mariano.projects.appVillaSanMartin.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity(name = "TicketType")
@Table(name = "ticket_types")
@Data
public class TicketTypeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private MatchEntity match;
    @Column(nullable = false, length = 50)
    private String name;
    @Column(nullable = false)
    private BigDecimal price;
    @Column(name = "total_quantity", nullable = false)
    private int totalQuantity;
    @Column(name = "available_quantity", nullable = false)
    private int availableQuantity;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
