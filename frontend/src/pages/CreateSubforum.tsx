import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subforumService } from '../services/subforumService';
import { imageService } from '../services/imageService';// Asegúrate de tener este servicio creado
import { authService } from '../services/authService';
import '../styles/CreateSubforum.css'; // (Te doy el CSS abajo)

export default function CreateSubforum() {
  const navigate = useNavigate();
  const user = authService.getUser();

  // Estados del formulario
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  
  // Estados para archivos
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  
  // Previsualización de imágenes
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Manejar cambio de nombre (Slug automático)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permite letras, números y guiones bajos/medios
    const val = e.target.value.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setName(val);
  };

  // Manejar selección de imágenes y preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'icon' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'icon') {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    } else {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Debes iniciar sesión');
    setLoading(true);
    setError('');

    try {
      let iconUrl = '';
      let bannerUrl = '';

      // 1. Subir imágenes si existen
      if (iconFile) {
        const url = await imageService.uploadImage(iconFile, 'icons');
        if (url) iconUrl = url;
      }
      
      if (bannerFile) {
        const url = await imageService.uploadImage(bannerFile, 'banners');
        if (url) bannerUrl = url;
      }

      // 2. Crear Subforo
      const newSubforum = await subforumService.createSubforum({
        name,
        displayName,
        description,
        icon: iconUrl,
        banner: bannerUrl
      });

      // 3. Actualizar Sidebar (disparar evento) y Navegar
      window.dispatchEvent(new Event("auth-changed")); 
      navigate(`/subforum/${newSubforum._id}`);

    } catch (err: any) {
      console.error(err);
      // Intentar leer el mensaje del backend
      const msg = err.response?.data?.message || 'Error al crear la comunidad. Intenta otro nombre.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="create-subforum-container" style={{textAlign: 'center', marginTop: 50}}>
        <h2>Acceso Denegado</h2>
        <p>Necesitas iniciar sesión para crear una comunidad.</p>
        <button onClick={() => navigate('/login')} className="submit-btn">Ir al Login</button>
      </div>
    );
  }

  return (
    <main className="create-subforum-container">
      <div className="create-card">
        <h1 className="create-title">Crear un Subforo</h1>
        <p className="create-subtitle">Construye un nuevo hogar para discusiones y memes.</p>
        
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="create-form">
          
          {/* Nombre y Slug */}
          <div className="form-group">
            <label>Nombre del subforo <span className="required">*</span></label>
            <div className="input-prefix-wrapper">
              <span className="prefix">s/</span>
              <input 
                type="text" 
                value={name} 
                onChange={handleNameChange}
                placeholder="ej: programacion" 
                required 
                maxLength={30}
              />
            </div>
            <small>Este será el link único de tu subforo. No se puede cambiar después.</small>
          </div>

          {/* Display Name */}
          <div className="form-group">
            <label>Título Visible <span className="required">*</span></label>
            <input 
              type="text" 
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="ej: Programadores de Chile"
              required
              maxLength={100}
            />
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label>Descripción</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="¿De qué se trata este lugar?"
              rows={4}
            />
          </div>

          {/* SECCIÓN DE IMÁGENES */}
          <div className="images-section">
            
            {/* Icono */}
            <div className="image-upload-box">
              <label>Ícono</label>
              <div 
                className="image-preview icon-preview" 
                style={{ backgroundImage: iconPreview ? `url(${iconPreview})` : 'none' }}
              >
                {!iconPreview && <span>📷</span>}
              </div>
              <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'icon')} />
            </div>

            {/* Banner */}
            <div className="image-upload-box">
              <label>Banner</label>
              <div 
                className="image-preview banner-preview"
                style={{ backgroundImage: bannerPreview ? `url(${bannerPreview})` : 'none' }}
              >
                {!bannerPreview && <span>🖼️ Subir Banner</span>}
              </div>
              <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'banner')} />
            </div>

          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancelar</button>
            <button type="submit" className="submit-btn" disabled={loading || !name || !displayName}>
              {loading ? 'Creando...' : 'Crear Subforo'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}