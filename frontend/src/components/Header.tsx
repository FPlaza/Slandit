import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MdSearch, MdNotifications, MdPerson, MdHome, MdClose } from 'react-icons/md';
import ThemeToggle from './ThemeToggle';
import { authService } from '../services/authService';
import { searchService } from '../services/searchService';
import type { SearchResults } from '../types/search.types';
import LogoSlandit from '../assets/LogoSlandit.png';
import { notificationService } from '../services/notificationsService';

export default function Header() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [user, setUser] = useState<any>(authService.getUser());
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateUser = () => {
      setUser(authService.getUser());
    };

    window.addEventListener("auth-changed", updateUser);
    return () => window.removeEventListener("auth-changed", updateUser);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchService.search(query);
        setResults(data);
      } catch (error) {
        console.error("Error buscando:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.count);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
       setQuery('');
       setResults(null);
    }
  };

  const handleNavigate = (path: string) => {
      navigate(path);
      setShowSearch(false);
      setQuery('');
  };

  const handleNotificationsToggle = async () => {
    if (!showNotifications) {
      try {
        const list = await notificationService.getMyNotifications();
        setNotifications(list);
      } catch (err) {
        console.error(err);
      }
    }
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.read) {
      notificationService.markAsRead(notif._id);
      setUnreadCount((prev) => Math.max(0, prev - 1)); 
    }

    setShowNotifications(false);

    if (notif.resourceType === 'Post' && notif.resourceId) {
      navigate(`/posts/${notif.resourceId}`);
    }

    if (notif.type === 'SUBFORUM_UNLOCKED') {
        navigate(`/profile/${user.username}`);
    }
  };

  const handleProfile = () => {
    navigate(`/profile/${user.username}`);
  };

  return (
    <header className="header-basic">
      <div
        className="header-inner"
        style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}
      >
        {/* logo */}
        <img
          src={LogoSlandit}
          alt="Slandit"
          style={{ height: '42px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />

        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Slandit
        </span>

        <span
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => navigate('/')}
        >
          <MdHome size={26} />
        </span>
      </div>

      <nav className="header-nav-icons">
        {/* buscar siempre visible */}
        <button className="icon-btn" title="Buscar" onClick={handleSearch}>
          {showSearch ? <MdClose size={24} /> : <MdSearch size={24} />}
        </button>

        {user ? (
          <>
            {/* notis */}
            <div className="notification-wrapper" style={{ position: 'relative' }}>
              
              <button
                className="icon-btn"
                title="Notificaciones"
                onClick={handleNotificationsToggle} // <-- Usamos la nueva función
                style={{ position: 'relative' }} // Para posicionar la burbuja
              >
                <MdNotifications size={24} />
                
                {/* si hay notis */}
                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* menu desplegable */}
              {showNotifications && (
                <div className="notifications-dropdown">
                  <h4 className="notif-header">Notificaciones</h4>
                  
                  {notifications.length === 0 ? (
                    <p className="notif-empty">No tienes notificaciones.</p>
                  ) : (
                    <ul className="notif-list">
                      {notifications.map((notif) => (
                        <li 
                          key={notif._id} 
                          className={`notif-item ${!notif.read ? 'unread' : ''}`}
                          onClick={() => handleNotificationClick(notif)}
                        >
                          <p className="notif-content">{notif.content}</p>
                          <small className="notif-date">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </small>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* profile */}
            <button
              className="icon-btn"
              title="Perfil"
              onClick={handleProfile}
            >
              <MdPerson size={24} />
            </button>
          </>
        ) : (
          <>
            {/* boton pa iniciar */}
            <button
              className="login-btn"
              onClick={() => navigate('/login')}
            >
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
            placeholder="Buscar subforos o usuarios..."
            className="search-input"
            autoFocus
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* aqui los resultados de busquedas */}
          {(results || isSearching) && (
            <div className="search-results-dropdown">
                
                {isSearching && <div className="search-item-loading" style={{padding: 10, color: 'var(--muted-text)'}}>Buscando...</div>}

                {/* solo pa subforos */}
                {results?.subforums && results.subforums.length > 0 && (
                    <div className="search-section">
                        <h4 style={{padding: '8px 12px', margin: 0, fontSize: '0.85rem', color: 'var(--muted-text)', background: 'rgba(0,0,0,0.05)'}}>Comunidades</h4>
                        {results.subforums.map(sub => (
                            <div 
                                key={sub._id} 
                                className="search-result-item"
                                onClick={() => handleNavigate(`/subforum/${sub._id}`)}
                                style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', cursor: 'pointer'}}
                            >
                                <img src={sub.icon || '/icons/default.png'} alt="" style={{width: 32, height: 32, borderRadius: 6, objectFit: 'cover'}}/>
                                <div>
                                    <span style={{fontWeight: 'bold', display: 'block'}}>r/{sub.name}</span>
                                    <span style={{fontSize: '0.8rem', color: 'var(--muted-text)'}}>{sub.displayName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* solo pa usuarios */}
                {results?.users && results.users.length > 0 && (
                    <div className="search-section">
                        <h4 style={{padding: '8px 12px', margin: 0, fontSize: '0.85rem', color: 'var(--muted-text)', background: 'rgba(0,0,0,0.05)'}}>Usuarios</h4>
                        {results.users.map(u => (
                            <div 
                                key={u._id} 
                                className="search-result-item"
                                onClick={() => handleNavigate(user?.username === u.username ? `/profile/${u.username}` : `/guest-profile/${u.username}`)}
                                style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', cursor: 'pointer'}}
                            >
                                <img src={u.avatarUrl || '/icons/surprisedrudo.png'} alt="" style={{width: 32, height: 32, borderRadius: '50%', objectFit: 'cover'}}/>
                                <span style={{fontWeight: 'bold'}}>@{u.username}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* si es q no encuentra nada */}
                {!isSearching && results && results.subforums.length === 0 && results.users.length === 0 && (
                    <div style={{padding: 20, textAlign: 'center', color: 'var(--muted-text)'}}>No se encontraron resultados</div>
                )}
            </div>
          )}
          {/* fin de la funcion */}

        </div>
      )}
    </header>
  );
}
