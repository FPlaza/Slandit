import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { token, setToken } = useAuth();

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Bienvenido al Home</h1>

            <p>Tu token actual es:</p>
            <pre>{token}</pre>

            <button onClick={logout}>
                Cerrar sesión
            </button>
        </div>
    );
}
