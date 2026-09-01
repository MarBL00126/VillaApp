import { useState } from "react";
import api from "../services/api";

interface ValidationResponse {
    valid: boolean;
    reason?: string;
    holder?: string;
    sector?: string;
}

export default function QrValidatorScreen() {
    const [entryCode, setEntryCode] = useState("");
    const [result, setResult] = useState<ValidationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleValidate = async () => {
        if (!entryCode.trim()) {
            setError("Ingresá un código de entrada.");
            setResult(null);
            return;
        }

        setLoading(true);
        setError("");        // ← limpiar error anterior, no poner uno nuevo
        setResult(null);

        try {
            const response = await api.post("/orders/validate-qr", {
                entryCode: entryCode.trim(),
            });

            setResult(response.data);
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosErr = err as { response?: { data?: { reason?: string } } };
                setError(axiosErr.response?.data?.reason || "Error al validar la entrada.");
            } else {
                setError("No se pudo validar la entrada.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setEntryCode("");
        setResult(null);
        setError("");
    };

    return (
        <div
            style={{
                maxWidth: "600px",
                margin: "40px auto",
                padding: "24px",
            }}
        >
            <h1>Validar entrada</h1>

            <p>
                Ingresá el código de la entrada para verificar si puede utilizarse.
            </p>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                <label htmlFor="entryCode">Código de entrada</label>

                <input
                    id="entryCode"
                    type="text"
                    value={entryCode}
                    onChange={(e) => setEntryCode(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleValidate();
                        }
                    }}
                    placeholder="Ej: a3f7b2c1-..."
                    disabled={loading}
                />

                <button
                    type="button"
                    onClick={handleValidate}
                    disabled={loading}
                >
                    {loading ? "Validando..." : "Validar"}
                </button>

                {result && (
                    <div
                        style={{
                            marginTop: "20px",
                            padding: "20px",
                            border: "1px solid",
                            borderRadius: "8px",
                        }}
                    >
                        {result.valid ? (
                            <>
                                <h2>✅ Entrada válida</h2>

                                <p>
                                    <strong>Titular:</strong>{" "}
                                    {result.holder || "No informado"}
                                </p>

                                <p>
                                    <strong>Sector:</strong>{" "}
                                    {result.sector || "No informado"}
                                </p>
                            </>
                        ) : (
                            <>
                                <h2>❌ Entrada inválida</h2>

                                <p>
                                    <strong>Motivo:</strong>{" "}
                                    {result.reason || "Entrada no válida"}
                                </p>
                            </>
                        )}
                    </div>
                )}

                {error && (
                    <div
                        style={{
                            marginTop: "20px",
                            padding: "16px",
                            border: "1px solid red",
                            borderRadius: "8px",
                            color: "red",
                        }}
                    >
                        ❌ {error}
                    </div>
                )}

                {(result || error) && (
                    <button type="button" onClick={handleClear}>
                        Limpiar
                    </button>
                )}
            </div>
        </div>
    );
}