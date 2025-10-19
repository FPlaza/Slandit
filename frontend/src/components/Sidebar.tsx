import './Sidebar.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Subforos de ejemplo, puedes reemplazar por datos dinámicos en el futuro
  const subforos = [
    { id: 'silksong', nombre: 'Silksong' },
    { id: 'tecnologia', nombre: 'Tecnología' },
    { id: 'gaming', nombre: 'Gaming' },
    { id: 'offtopic', nombre: 'Offtopic' },
  ];

  return (
    <div style={{ position: 'fixed', top: 64, left: 0, zIndex: 1001, display: 'flex', flexDirection: 'row', height: 'calc(100vh - 64px)' }}>
      <nav className={`sidebar${open ? ' open' : ''}`}> 
        {open && (
          <>
            <h2>Subforos</h2>
            <ul>
              {subforos.map(sf => (
                <li key={sf.id}>
                  <button className="sidebar-link" onClick={() => navigate(`/subforum/${sf.id}`)}>
                    {sf.nombre}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
      <button
        className="sidebar-toggle"
        onClick={() => setOpen(!open)}
        style={{
          alignSelf: 'flex-start',
          marginLeft: open ? '230px' : '20px',
          marginTop: '8px',
          transition: 'margin-left 0.3s',
        }}
      >
        ☰
      </button>
    </div>
  );
}
