import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

interface Order {
    id: number;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    status: string;
    entryCode?: string;
    qrData?: string;

    reservation?: {
        expiresAt: string;
    };

    ticketType?: {
        name: string;
    };
}

export default function OrderScreen() {

    const { id } = useParams();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(0);

    // ─────────────────────────────────────────────
    // Cargar orden
    // ─────────────────────────────────────────────

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {

        try {

            const response = await api.get(`/orders/${id}`);

            setOrder(response.data);

        } catch (error) {

            console.error(error);
            alert("No se pudo cargar la orden");

        } finally {

            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────
    // Countdown de la reserva
    // ─────────────────────────────────────────────

    useEffect(() => {

        if (
            !order ||
            order.status !== "PENDING_PAYMENT" ||
            !order.reservation?.expiresAt
        ) {
            return;
        }

        const updateCountdown = () => {

            const expiration =
                new Date(
                    order.reservation!.expiresAt
                ).getTime();

            const now = Date.now();

            const remaining = Math.max(
                0,
                Math.floor(
                    (expiration - now) / 1000
                )
            );

            setRemainingSeconds(remaining);
        };

        // Ejecutar inmediatamente
        updateCountdown();

        // Actualizar cada segundo
        const interval = setInterval(
            updateCountdown,
            1000
        );

        return () => clearInterval(interval);

    }, [order]);

    // ─────────────────────────────────────────────
    // Confirmar pago
    // ─────────────────────────────────────────────

    const handlePayment = async () => {

    if (!order) {
        return;
    }

    try {

        setPaying(true);

        const response = await api.post(
            `/orders/${order.id}/pay`
        );

        const initPoint = response.data.initPoint;

        if (!initPoint) {
            throw new Error("Mercado Pago no devolvió initPoint");
        }

        window.location.href = initPoint;

    } catch (error) {

        console.error(error);
        alert("No se pudo iniciar el pago con Mercado Pago");

        setPaying(false);
    }
};

    // ─────────────────────────────────────────────
    // Loading
    // ─────────────────────────────────────────────

    if (loading) {
        return <p>Cargando orden...</p>;
    }

    // ─────────────────────────────────────────────
    // Orden inexistente
    // ─────────────────────────────────────────────

    if (!order) {
        return <p>Orden no encontrada.</p>;
    }

    // ─────────────────────────────────────────────
    // Formatear countdown
    // ─────────────────────────────────────────────

    const minutes = Math.floor(
        remainingSeconds / 60
    );

    const seconds = remainingSeconds % 60;

    const formattedTime =
        `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;

    // ─────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────

    return (
        <div>

            <h1>Orden #{order.id}</h1>

            <p>
                Estado: {order.status}
            </p>

            <p>
                Sector: {order.ticketType?.name}
            </p>

            <p>
                Cantidad: {order.quantity}
            </p>

            <p>
                Precio unitario: ${order.unitPrice}
            </p>

            <h2>
                Total: ${order.totalAmount}
            </h2>

            {/* ─────────────────────────────── */}
            {/* PAGO PENDIENTE */}
            {/* ─────────────────────────────── */}

            {order.status === "PENDING_PAYMENT" && (

                <div>

                    <h3>
                        Tiempo restante
                    </h3>

                    <p>
                        {formattedTime}
                    </p>

                    {remainingSeconds > 0 ? (

                        <button
                        onClick={handlePayment}
                        disabled={paying}>
                            {paying
                            ? "Redirigiendo..."
                            : "Pagar con Mercado Pago"}
                        </button>

                    ) : (

                        <p>
                            La reserva expiró.
                        </p>

                    )}

                </div>
            )}

            {/* ─────────────────────────────── */}
            {/* PAGO CONFIRMADO */}
            {/* ─────────────────────────────── */}

            {order.status === "PAID" && (

                <div>

                    <h2>
                        ¡Compra confirmada!
                    </h2>

                    <p>
                        Presentá este QR en el ingreso.
                    </p>

                    {order.qrData && (

                        <img
                            src={order.qrData}
                            alt="QR de entrada"
                            width={300}
                            height={300}
                        />

                    )}

                    <p>
                        Código:{" "}
                        {order.entryCode}
                    </p>

                </div>
            )}

            {/* ─────────────────────────────── */}
            {/* ENTRADA UTILIZADA */}
            {/* ─────────────────────────────── */}

            {order.status === "USED" && (

                <div>

                    <h2>
                        Entrada utilizada
                    </h2>

                    <p>
                        Este QR ya fue utilizado.
                    </p>

                </div>
            )}

            {/* ─────────────────────────────── */}
            {/* ORDEN CANCELADA */}
            {/* ─────────────────────────────── */}

            {order.status === "CANCELLED" && (

                <div>

                    <h2>
                        Orden cancelada
                    </h2>

                    <p>
                        Esta orden fue cancelada.
                    </p>

                </div>
            )}

            {/* ─────────────────────────────── */}
            {/* ORDEN EXPIRADA */}
            {/* ─────────────────────────────── */}

            {order.status === "EXPIRED" && (

                <div>

                    <h2>
                        Reserva expirada
                    </h2>

                    <p>
                        El tiempo para realizar el pago
                        terminó.
                    </p>

                </div>
            )}

        </div>
    );
}