import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

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
        <div>
            <h1>Comprar entradas</h1>

            {ticketTypes.map((ticketType) => (

                <div
                    key={ticketType.id}
                    onClick={() =>
                        setSelectedTicketType(ticketType)
                    }
                >

                    <h2>{ticketType.name}</h2>

                    <p>
                        Precio: ${ticketType.price}
                    </p>

                    <p>
                        Disponibles: {ticketType.availableQuantity}
                    </p>

                </div>
            ))}

            {selectedTicketType && (
                <div>

                    <h3>
                        Sector seleccionado:
                        {" "}
                        {selectedTicketType.name}
                    </h3>

                    <label>
                        Cantidad:
                    </label>

                    <input
                        type="number"
                        min="1"
                        max={selectedTicketType.availableQuantity}
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(Number(e.target.value))
                        }
                    />

                    <button
                        onClick={handleReserve}
                        disabled={loading}
                    >
                        {loading
                            ? "Procesando..."
                            : "Reservar"}
                    </button>

                </div>
            )}
        </div>
    );
}