import { useEffect, useState } from 'react';
import { profileService } from '../services/profileService';
import { imageService } from '../services/imageService'; // <-- Importar
import { postService } from '../services/postService'; // <-- Importar
import PostCard from '../components/PostCard';
// 1. BORRAR import { mockPosts }
import type { Profile as ProfileType } from '../types/profile.types';
import type { Post } from '../types/post.types'; // <-- Usar tipo REAL
import '../styles/Profile.css';

function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  // 2. Cambiar estado de posts para usar el tipo real
  const [posts, setPosts] = useState<Post[]>([]); 
  const [loading, setLoading] = useState(true);

  // Estados para edición
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const [newAvatar, setNewAvatar] = useState('');
  const [newBio, setNewBio] = useState('');

  // Estados para subida de imagen
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [savingAvatar, setSavingAvatar] = useState(false);

  // Cargar MI perfil real y MIS posts reales
  useEffect(() => {
    async function loadData() {
      try {
        // A. Obtener Perfil
        const p = await profileService.getMyProfile();
        setProfile(p);
        setNewAvatar(p.avatarUrl || '');
        setNewBio(p.bio || '');

        // B. Obtener Posts del Usuario (Usando el ID del perfil)
        // Usamos p._id (el UUID de Postgres)
        const userPosts = await postService.getPostsByUser(p._id);
        setPosts(userPosts);

      } catch (err) {
        console.error("Error cargando perfil o posts:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div className="loading">Cargando perfil...</div>;
  }

  if (!profile) {
    return <div className="error">No se pudo cargar tu perfil.</div>;
  }

  return (
    <main className="profile-main">
      <div className="profile-wrapper">

        {/* CARD DEL PERFIL */}
        <section className="profile-card">

          <div className="avatar-container">
            <img
              src={newAvatar || '/icons/surprisedrudo.png'}
              alt={profile.username}
              className="profile-avatar"
            />

            <button
              className="avatar-edit-btn"
              onClick={() => setIsEditingAvatar(true)}
              title="Cambiar avatar"
            >
              ✏️
            </button>

            {/* POPUP DE EDICIÓN DE AVATAR */}
            {isEditingAvatar && (
              <div className="avatar-edit-popup">
                <label>
                  Subir nueva imagen:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setAvatarFile(file);
                            setNewAvatar(URL.createObjectURL(file)); // Preview
                        }
                    }}
                    style={{ marginTop: 8, width: '100%' }}
                  />
                </label>

                <div className="popup-actions">
                  <button onClick={() => {
                      setIsEditingAvatar(false);
                      setNewAvatar(profile.avatarUrl || ''); // Revertir
                      setAvatarFile(null);
                  }}>
                    Cancelar
                  </button>
                  
                  <button
                    disabled={savingAvatar}
                    onClick={async () => {
                      setSavingAvatar(true);
                      try {
                          let finalUrl = newAvatar;
                          
                          if (avatarFile) {
                              const uploadedUrl = await imageService.uploadImage(avatarFile, 'avatars');
                              if (uploadedUrl) finalUrl = uploadedUrl;
                          }

                          await profileService.updateMyProfile({ avatarUrl: finalUrl });
                          
                          setProfile({ ...profile, avatarUrl: finalUrl });
                          setNewAvatar(finalUrl);
                          setIsEditingAvatar(false);
                          setAvatarFile(null);
                          
                          // Actualizar UI global si es necesario
                          window.dispatchEvent(new Event("auth-changed")); 

                      } catch (error) {
                          console.error("Error:", error);
                          alert("Error al guardar avatar");
                      } finally {
                          setSavingAvatar(false);
                      }
                    }}
                  >
                    {savingAvatar ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* INFO + DIVISAS */}
          <div className="profile-details-wrapper">
            <div className="profile-info">
              <h2 className="profile-username">@{profile.username}</h2>

              <div className="bio-container">
                {!isEditingBio ? (
                  <>
                    <p className="profile-bio">{newBio || 'Sin descripción.'}</p>
                    <button
                      className="bio-edit-btn"
                      onClick={() => setIsEditingBio(true)}
                    >
                      ✏️
                    </button>
                  </>
                ) : (
                  <div className="bio-editor">
                    <textarea
                      value={newBio}
                      onChange={(e) => setNewBio(e.target.value)}
                    />
                    <div className="bio-actions">
                      <button onClick={() => setIsEditingBio(false)}>Cancelar</button>
                      <button
                        onClick={async () => {
                          try {
                            await profileService.updateMyProfile({ bio: newBio });
                            setProfile({ ...profile, bio: newBio });
                            setIsEditingBio(false);
                          } catch(e) { console.error(e); }
                        }}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <section className="currency-section">
              <div className="currency-item">
                <h2>Divisas Actuales</h2>
                <strong>{profile.currency || '0'}</strong>
              </div>
            </section>
          </div> 
        </section>

        <section className="profile-buttons">
          <button type="button" className="historial-button">
            Historial
          </button>
        </section>

        {/* POSTS REALES */}
        <section>
          <h3 className="posts-title">Publicaciones recientes</h3>

          {posts.length === 0 ? (
            <div className="posts-empty">
              Aún no has publicado nada.
            </div>
          ) : (
            <div className="posts-list">
              {posts.map((p) => (
                // 3. AHORA SÍ: 'p' es de tipo 'Post' y tiene '_id'
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          )}
        </section>

      </div>
    </main >
  );
}

export default Profile;