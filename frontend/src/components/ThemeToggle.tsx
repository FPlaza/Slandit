import React from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title="Cambiar tema"
      className="icon-btn"
      style={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--toggle-bg)',
        color: 'var(--toggle-fg)'
      }}
    >
      {theme === 'dark' ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
    </button>
  );
}
