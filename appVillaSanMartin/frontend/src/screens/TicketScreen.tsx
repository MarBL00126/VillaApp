import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { theme } from "../theme";

interface TicketType {
    id: number;
    name: string;
    price: number;
    availableQuantity: number;
}

export default function TicketScreen() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
    const [selectedTicketType, setSelectedTicketType] =
        useState<TicketType | null>(null);

    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadTicketTypes();
    }, [id]);

    const loadTicketTypes = async () => {
        try {
            const response = await api.get(
                `/matches/${id}/ticket-types`
            );

            setTicketTypes(response.data);

        } catch (error) {
            console.error(error);
            alert("No se pudieron cargar los tipos de entrada");
        } finally {
            setLoaded(true);
        }
    };

    const handleReserve = async () => {

        if (!selectedTicketType) {
            alert("Seleccioná un sector");
            return;
        }

        if (quantity < 1) {
            alert("La cantidad debe ser mayor a 0");
            return;
        }

        if (quantity > selectedTicketType.availableQuantity) {
            alert("No hay suficiente stock");
            return;
        }

        try {

            setLoading(true);

            // 1. Crear reserva
            const reservationResponse = await api.post(
                "/reservations",
                {
                    ticketTypeId: selectedTicketType.id,
                    quantity: quantity
                }
            );

            const reservation = reservationResponse.data;

            // 2. Crear orden de compra
            const orderResponse = await api.post(
                `/orders?reservationId=${reservation.id}`
            );

            const order = orderResponse.data;

            // 3. Ir a la orden
            navigate(`/orders/${order.id}`);

        } catch (error) {

            console.error(error);
            alert("No se pudo crear la compra");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Comprar entradas</h1>

            {loaded && ticketTypes.length === 0 && (
                <p style={styles.muted}>No hay entradas disponibles para este partido.</p>
            )}

            <div style={styles.list}>
                {ticketTypes.map((ticketType) => {
                    const selected = selectedTicketType?.id === ticketType.id;
                    return (
                        <div
                            key={ticketType.id}
                            style={{
                                ...styles.card,
                                ...(selected ? styles.cardSelected : {}),
                            }}
                            onClick={() => setSelectedTicketType(ticketType)}
                        >
                            <h2 style={styles.cardTitle}>{ticketType.name}</h2>
                            <p style={styles.price}>${ticketType.price}</p>
                            <p style={styles.muted}>
                                Disponibles: {ticketType.availableQuantity}
                            </p>
                        </div>
                    );
                })}
            </div>

            {selectedTicketType && (
                <div style={styles.form}>
                    <h3 style={styles.formTitle}>
                        Sector seleccionado: {selectedTicketType.name}
                    </h3>

                    <div style={styles.field}>
                        <label style={styles.label} htmlFor="quantity">
                            Cantidad
                        </label>
                        <input
                            id="quantity"
                            style={styles.input}
                            type="number"
                            min="1"
                            max={selectedTicketType.availableQuantity}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>

                    <button
                        style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
                        onClick={handleReserve}
                        disabled={loading}
                    >
                        {loading ? "Procesando..." : "Reservar"}
                    </button>
                </div>
            )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        maxWidth: '640px',
        margin: '0 auto',
        padding: '1rem',
    },
    title: {
        color: theme.colors.primary,
        fontSize: theme.fontSizes.xxl,
        fontWeight: 700,
        margin: '0 0 1rem',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    card: {
        backgroundColor: theme.colors.surface,
        border: `2px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.card,
        padding: '1rem',
        cursor: 'pointer',
    },
    cardSelected: {
        borderColor: theme.colors.secondary,
    },
    cardTitle: {
        color: theme.colors.text,
        fontSize: theme.fontSizes.lg,
        fontWeight: 700,
        margin: 0,
    },
    price: {
        color: theme.colors.primary,
        fontSize: theme.fontSizes.xl,
        fontWeight: 700,
        margin: '0.25rem 0',
    },
    muted: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSizes.sm,
        margin: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.card,
        padding: '1.25rem',
        marginTop: '1.25rem',
    },
    formTitle: {
        color: theme.colors.primary,
        fontSize: theme.fontSizes.lg,
        fontWeight: 700,
        margin: 0,
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
    },
    label: {
        fontSize: theme.fontSizes.sm,
        fontWeight: 600,
        color: theme.colors.text,
    },
    input: {
        padding: '0.75rem 1rem',
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${theme.colors.border}`,
        fontSize: theme.fontSizes.md,
        outline: 'none',
        color: theme.colors.text,
    },
    button: {
        backgroundColor: theme.colors.secondary,
        color: theme.colors.primary,
        fontWeight: 700,
        fontSize: theme.fontSizes.md,
        border: 'none',
        borderRadius: theme.borderRadius.md,
        padding: '0.875rem',
        cursor: 'pointer',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
};