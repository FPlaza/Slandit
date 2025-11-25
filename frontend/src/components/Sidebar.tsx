import './Sidebar.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import type { SubforumInfo } from '../types/subforum.types';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [joinedSubforums, setJoinedSubforums] = useState<SubforumInfo[]>([]);
  const navigate = useNavigate();

  const user = authService.getUser(); // Detectar si el usuario está loggeado

  useEffect(() => {
    // Si NO hay usuario, no intentes cargar subforos
    if (!user) return;

    async function loadSubforums() {
      try {
        const profile = await profileService.getMyProfile();
        setJoinedSubforums(profile.joinedSubforums || []);
      } catch (err) {
        console.error("Error cargando subforos del usuario:", err);
      }
    }

    loadSubforums();
  }, [user]);

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
          <ul>
            {!user ? (
              // ⚠ Usuario NO loggeado
              <p style={{ padding: '12px', opacity: 0.75 }}>
                Para ver tus subforos, inicia sesión.
              </p>
            ) : joinedSubforums.length === 0 ? (
              // Usuario loggeado pero sin subforos
              <p style={{ padding: '12px', opacity: 0.6 }}>
                No estás suscrito a ningún subforo.
              </p>
            ) : (
              // Usuario loggeado con subforos
              joinedSubforums.map((sf) => (
                <li key={sf._id}>
                  <button
                    className="sidebar-link"
                    onClick={() => navigate(`/subforum/${sf.name}`)}
                    title={sf.displayName}
                    aria-label={sf.displayName}
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
          </ul>
        )}
      </nav>

      <button
        className="sidebar-toggle"
        onClick={() => setOpen(!open)}
        style={{
          alignSelf: 'flex-start',
          marginTop: '8px',
          transition: 'left 0.18s',
        }}
      >
        ☰
      </button>
    </div>
  );
}
