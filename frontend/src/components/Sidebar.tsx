import './Sidebar.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockSubforums } from '../mocks/mockData';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ position: 'fixed', top: 64, left: 0, zIndex: 1001, display: 'flex', flexDirection: 'row', height: 'calc(100vh - 64px)' }}>
      <nav className={`sidebar${open ? ' open' : ''}`}> 
        {open && (
          <ul>
            {mockSubforums.map((sf) => (
              <li key={sf.id}>
                <button
                  className="sidebar-link"
                  onClick={() => navigate(`/subforum/${sf.name}`)}
                  title={sf.displayName}
                  aria-label={sf.displayName}
                >
                  <img src={sf.iconUrl} alt={sf.displayName} className="sidebar-icon large" />
                </button>
              </li>
            ))}
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
