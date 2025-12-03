import '../styles/Login.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { useState } from 'react';
import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authService.login(usernameOrEmail, password);

      if (response) {
        navigate("/");
      }

    } catch (err: any) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Inicio de Sesión</h2>

        {error && (
          <p style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              id="username"
              placeholder="Email"
              required
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              id="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <a href="#" className="forgot-password-link">¿Olvidaste tu contraseña?</a>

          <button type="submit" className="login-button">INGRESAR</button>
        </form>
      </div>

      <div className="login-links">
        {/* asignamos links */}
        <Link to="/register">¿No tienes una cuenta aún?</Link>
        
        <Link to="/">Permanecer desconectado</Link>
      </div>
    </div>
  );
}

export default Login;