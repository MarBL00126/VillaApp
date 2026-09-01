package mariano.projects.appVillaSanMartin.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "payment_records")
@Data
public class PaymentRecordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private PurchaseOrderEntity purchaseOrder;
    @Column(name = "mp_preference_id", length = 100)
    private String mpPreferenceId;
    @Column(name = "mp_payment_id")
    private Long mpPaymentId;
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    @Column(name = "mp_status", length = 30)
    private String mpStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
