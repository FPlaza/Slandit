import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MdSearch, MdNotifications, MdPerson, MdHome } from 'react-icons/md';

export default function Header() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = () => {
    setShowSearch(!showSearch);
    // TBD: Colocar la logica pa ir navegando entre subforos
  };

  const handleNotifications = () => {
    alert('Notificaciones: Esta funcionalidad estará disponible próximamente');
    // TBD: Sistema de notificaciones??? tanto para msg, datos sobre publicacion subida, etc etc
  };

  const handleProfile = () => {
    navigate('/profile/usuario');
  };

  return (
    <header className="header-basic">
      <div className="header-inner" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Slandit</span>
        <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
          <MdHome size={26} />
        </span>
      </div>
      <nav className="header-nav-icons">
        <button className="icon-btn" title="Buscar" onClick={handleSearch}>
          <MdSearch size={24} />
        </button>
        <button className="icon-btn" title="Notificaciones" onClick={handleNotifications}>
          <MdNotifications size={24} />
        </button>
        <button className="icon-btn" title="Perfil" onClick={handleProfile}>
          <MdPerson size={24} />
        </button>
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
