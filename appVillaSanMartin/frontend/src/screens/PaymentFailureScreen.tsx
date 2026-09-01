import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const PaymentFailureScreen: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const orderId = searchParams.get("orderId");
    const [retrying, setRetrying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRetry = async () => {
        if (!orderId) {
            setError("No se encontró el identificador de la orden.");
            return;
        }

        try {
            setRetrying(true);
            const response = await api.post(`/orders/${orderId}/pay`);
            const initPoint = response.data.initPoint;

            if (!initPoint) {
                throw new Error("No se obtuvo el enlace de pago.");
            }

            window.location.href = initPoint;
        } catch (err) {
            console.error("Error al reintentar el pago:", err);
            setError("No pudimos reiniciar el pago. Intentá de nuevo más tarde.");
            setRetrying(false);
        }
    };

    return (
        <div>
            <h1>❌ El pago no se completó</h1>

            <p>
                Tu pago fue rechazado o cancelado. No se realizó ningún cobro.
            </p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div>
                {orderId ? (
                    <button onClick={handleRetry} disabled={retrying}>
                        {retrying ? "Redirigiendo..." : "Reintentar pago"}
                    </button>
                ) : (
                    <p>No se puede reintentar: falta el ID de orden.</p>
                )}

                <button onClick={() => navigate("/fixture")} style={{ marginLeft: "1rem" }}>
                    Volver al fixture
                </button>
            </div>
        </div>
    );
};

export default PaymentFailureScreen;