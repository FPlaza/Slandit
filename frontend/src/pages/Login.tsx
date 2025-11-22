import '../styles/Login.css';
import { FaUser, FaLock } from 'react-icons/fa';

function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Inicio de Sesión</h2>
        <form>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input type="text" id="username" placeholder="Nombre de usuario" required />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input type="password" id="password" placeholder="Contraseña" required />
          </div>

          <a href="#" className="forgot-password-link">¿Olvidaste tu contraseña?</a>

          <button type="submit" className="login-button">INGRESAR</button>
        </form>
      </div>

      <div className="login-links">
        <a href="#">¿No tienes una cuenta aún?</a>
        <a href="#">Permanecer desconectado</a>
      </div>
    </div>
  );
}

export default Login;
