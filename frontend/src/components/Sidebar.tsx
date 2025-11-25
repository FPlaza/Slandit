import './Sidebar.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/profileService';
import type { SubforumInfo } from '../types/subforum.types';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [joinedSubforums, setJoinedSubforums] = useState<SubforumInfo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSubforums() {
      try {
        const profile = await profileService.getMyProfile();
        setJoinedSubforums(profile.joinedSubforums || []);
      } catch (err) {
        console.error("Error cargando subforos del usuario:", err);
      }
    }

    loadSubforums();
  }, []);

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
            {joinedSubforums.length === 0 ? (
              <p style={{ padding: '12px', opacity: 0.6 }}>
                No estás suscrito a ningún subforo.
              </p>
            ) : (
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
