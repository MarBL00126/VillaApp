import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

interface Order {
    id: number;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    status: string;
    entryCode?: string;
    qrData?: string;
    ticketType?: {
        name: string;
    };
}

const MAX_RETRIES = 10;
const RETRY_INTERVAL_MS = 2000;

const PaymentSuccessScreen: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const orderId = searchParams.get("orderId");

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [waitingForQr, setWaitingForQr] = useState(false);

    useEffect(() => {
        if (!orderId) {
            setError("No se encontró el identificador de la orden.");
            setLoading(false);
            return;
        }

        let retries = 0;

        const fetchOrder = async (): Promise<void> => {
            try {
                const response = await api.get(`/orders/${orderId}`);
                const fetchedOrder: Order = response.data;
                setOrder(fetchedOrder);

                // Si el pago ya fue confirmado, listo
                if (fetchedOrder.status === "PAID" || fetchedOrder.qrData) {
                    setWaitingForQr(false);
                    setLoading(false);
                    return;
                }

                // Si todavía está pendiente, esperar el webhook (hasta 20 seg)
                if (fetchedOrder.status === "PENDING_PAYMENT" && retries < MAX_RETRIES) {
                    retries++;
                    setWaitingForQr(true);
                    setTimeout(fetchOrder, RETRY_INTERVAL_MS);
                } else {
                    setWaitingForQr(false);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error obteniendo la orden:", err);
                setError("No pudimos obtener los datos de tu compra.");
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div>
                <h2>Procesando compra...</h2>
                <p>Estamos obteniendo los datos de tu entrada.</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div>
                <h2>Ocurrió un problema</h2>
                <p>{error ?? "No se encontró la orden."}</p>
                <button onClick={() => navigate("/")}>Volver al inicio</button>
            </div>
        );
    }

    return (
        <div>
            <h1>¡Pago exitoso! 🎉</h1>
            <p>Tu compra fue registrada correctamente.</p>

            <div>
                <h3>Datos de la entrada</h3>
                <p><strong>Orden:</strong> #{order.id}</p>
                <p><strong>Sector:</strong> {order.ticketType?.name ?? "No especificado"}</p>
                <p><strong>Cantidad:</strong> {order.quantity}</p>
                <p><strong>Código de entrada:</strong> {order.entryCode ?? "Generando..."}</p>
            </div>

            {waitingForQr && !order.qrData && (
                <p>⏳ Confirmando pago, generando QR...</p>
            )}

            {order.qrData && (
                <div>
                    <h3>QR de acceso</h3>
                    <img
                        src={order.qrData}
                        alt="QR de entrada"
                        style={{ width: "250px", height: "250px" }}
                    />
                </div>
            )}

            <button onClick={() => navigate("/")}>Volver al inicio</button>
        </div>
    );
};

export default PaymentSuccessScreen;