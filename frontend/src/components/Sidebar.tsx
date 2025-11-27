import './Sidebar.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import type { SubforumInfo } from '../types/subforum.types';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [joinedSubforums, setJoinedSubforums] = useState<SubforumInfo[]>([]);
  const [user, setUser] = useState<any>(authService.getUser());
  const navigate = useNavigate();

  const loadSubforums = async () => {
    const token = authService.getToken();
    if (!token) {
      setJoinedSubforums([]);
      return;
    }

    try {
      const profile = await profileService.getMyProfile();
      setJoinedSubforums(profile.joinedSubforums || []);
    } catch (err) {
      console.error("Error cargando subforos:", err);
      // Si falla (ej: token expirado), podríamos hacer logout automático
      // authService.logout(); 
    }
  };

  /** 🔥 Detecta login/logout automáticamente */
  useEffect(() => {
    // 1. Cargar al inicio (si hay usuario/token)
    loadSubforums();

    // 2. Suscribirse a cambios de login/logout
    const handleAuthChange = () => {
      const currentUser = authService.getUser();
      setUser(currentUser);
      
      // Si se logueó, cargamos. Si salió, limpiamos.
      if (currentUser) {
        loadSubforums();
      } else {
        setJoinedSubforums([]);
      }
    };

    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, []);


  /** 🚪 Logout */
  const handleLogout = () => {
    authService.logout();
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/"); // opcional: enviar al home
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 64,
        left: 0,
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'row',
        height: 'calc(100vh - 64px)',
      }}
    >
      <nav className={`sidebar${open ? ' open' : ''}`}>
        {open && (
          <>
            <ul style={{ flexGrow: 1 }}>
              {!user ? (
                // 🔸 CASO INVITADO (NO VE EL BOTÓN +)
                <p style={{ padding: '12px', opacity: 0.75 }}>
                  Inicia sesión para ver tus subforos.
                </p>
              ) : (
                // 🔸 CASO LOGUEADO (VE LA LISTA Y EL BOTÓN +)
                <>
                   {joinedSubforums.length === 0 ? (
                      <p style={{ padding: '12px', opacity: 0.6 }}>
                        No estás suscrito a ningún subforo.
                      </p>
                   ) : (
                      joinedSubforums.map((sf) => (
                        <li key={sf._id}>
                          <button
                            className="sidebar-link"
                            onClick={() => navigate(`/subforum/${sf._id}`)}
                            title={sf.displayName}
                          >
                            <img
                              src={sf.icon || '/icons/default.png'}
                              alt={sf.displayName}
                              className="sidebar-icon large"
                            />
                          </button>
                        </li>
                      ))
                   )}

                   {/* ➕ BOTÓN DE CREAR (SOLO AQUÍ DENTRO) */}
                   <li key="create-new" style={{ marginTop: 12, borderTop: '1px solid var(--card-border)', paddingTop: 12 }}>
                     <button
                       className="sidebar-link"
                       onClick={() => navigate('/create-subforum')}
                       title="Crear Comunidad"
                     >
                       <div style={{
                         width: 48,
                         height: 48,
                         borderRadius: 12,
                         background: 'var(--card-bg)',
                         border: '2px dashed var(--muted-text)',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         color: 'var(--muted-text)',
                         fontSize: 24,
                         cursor: 'pointer',
                         transition: 'all 0.2s'
                       }}>
                         +
                       </div>
                     </button>
                   </li>
                </>
              )}
            </ul>

            {/* 🚪 BOTÓN DE CERRAR SESIÓN (solo si hay usuario) */}
            {user && (
              <div className="logout-container">
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}

          </>
        )}
      </nav>

      <button
        className="sidebar-toggle"
        onClick={() => setOpen(!open)}
        style={{ alignSelf: 'flex-start', marginTop: '8px' }}
      >
        ☰
      </button>
    </div>
  );
}