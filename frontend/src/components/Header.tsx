import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MdSearch, MdNotifications, MdPerson, MdHome } from 'react-icons/md';
import ThemeToggle from './ThemeToggle';
import { authService } from '../services/authService';
import LogoSlandit from '../assets/LogoSlandit.png';

export default function Header() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const [user, setUser] = useState<any>(null);

  // Se ejecuta una vez y revisa si hay usuario en localStorage
  useEffect(() => {
    const u = authService.getUser();
    setUser(u);
  }, []);

  const handleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleNotifications = () => {
    alert('Notificaciones: Esta funcionalidad estará disponible próximamente');
  };

  const handleProfile = () => {
    navigate('/profile/usuario');
  };

  return (
    <header className="header-basic">
      <div className="header-inner" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <img
          src={LogoSlandit}
          alt="Slandit"
          style={{ height: '42px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Slandit
        </span>

        <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
          <MdHome size={26} />
        </span>
      </div>

      <nav className="header-nav-icons">
        {/* Buscar SIEMPRE visible */}
        <button className="icon-btn" title="Buscar" onClick={handleSearch}>
          <MdSearch size={24} />
        </button>

        {user ? (
          <>
            {/* SI está loggeado → iconos normales */}
            <button className="icon-btn" title="Notificaciones" onClick={handleNotifications}>
              <MdNotifications size={24} />
            </button>

            <button className="icon-btn" title="Perfil" onClick={handleProfile}>
              <MdPerson size={24} />
            </button>
          </>
        ) : (
          <>
            {/* SI NO ESTÁ LOGGEADO → botón de iniciar sesión */}
            <button className="login-btn" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
          </>
        )}

        <ThemeToggle />
      </nav>

      {showSearch && (
        <div className="search-overlay">
          <input
            type="text"
            placeholder="Buscar en Slandit..."
            className="search-input"
            autoFocus
          />
        </div>
      )}
    </header>
  );
}
