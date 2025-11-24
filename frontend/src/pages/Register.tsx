import '../styles/Register.css';

function Register() {
    return (
        <div className="register-page">
            <div className="register-card">
                <h2>Regístrate</h2>
                <form>
                    <div className="input-group">
                        <input type="text" id="username" placeholder="Nombre de usuario" required />
                    </div>
                    <div className="input-group">
                        <input type="password" id="password" placeholder="Contraseña" required />
                    </div>
                    <div className="input-group">
                        <input type="password" id="confirm-password" placeholder="Confirmar Contraseña" required />
                    </div>

                    <button type="submit" className="register-button">REGISTRARSE</button>
                </form>
            </div>

            <div className="register-links">
                <a href="#">¿Ya tienes una cuenta?</a>
                <a href="#">Permanecer desconectado</a>
            </div>
        </div>
    );
}

export default Register;
