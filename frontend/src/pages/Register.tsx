import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../styles/Register.css";

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (password !== confirm) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            setLoading(true);

            // Llamada al backend
            await authService.register(email, username, password);

            // Redirigir al login o home
            navigate("/login");

        } catch (err: any) {
            console.error(err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Error al registrarse. Intenta nuevamente.");
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="register-page">
            <div className="register-card">
                <h2>Regístrate</h2>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Nombre de usuario"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Contraseña"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Confirmar contraseña"
                            required
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                    </div>

                    {error && <p className="register-error">{error}</p>}

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? "Registrando..." : "REGISTRARSE"}
                    </button>
                </form>
            </div>

            <div className="register-links">
                <a onClick={() => navigate("/login")}>¿Ya tienes cuenta?</a>
                <a onClick={() => navigate("/")}>Permanecer desconectado</a>
            </div>
        </div>
    );
}

export default Register;
