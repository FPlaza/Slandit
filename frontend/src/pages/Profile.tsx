import { useEffect, useState } from 'react';
import { profileService } from '../services/profileService';
import PostCard from '../components/PostCard';
import { mockPosts } from '../mocks/mockData';
import '../styles/Profile.css';

function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estado para edición
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const [newAvatar, setNewAvatar] = useState('');
  const [newBio, setNewBio] = useState('');

  // Cargar MI perfil real
  useEffect(() => {
    async function loadProfile() {
      try {
        const p = await profileService.getMyProfile();
        setProfile(p);
        setNewAvatar(p.avatarUrl || '');
        setNewBio(p.bio || '');
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return <div className="loading">Cargando perfil...</div>;
  }

  if (!profile) {
    return <div className="error">No se pudo cargar tu perfil.</div>;
  }

  // Posts mock: opcional
  const posts = mockPosts.filter(
    (p) => p.author.username.toLowerCase() === profile.username.toLowerCase()
  );

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
            >
              ✏️
            </button>

            {isEditingAvatar && (
              <div className="avatar-edit-popup">
                <label>
                  Nueva URL de avatar:
                  <input
                    type="text"
                    value={newAvatar}
                    onChange={(e) => setNewAvatar(e.target.value)}
                  />
                </label>

                <div className="popup-actions">
                  <button onClick={() => setIsEditingAvatar(false)}>Cancelar</button>
                  <button
                    onClick={async () => {
                      await profileService.updateMyProfile({ avatarUrl: newAvatar });
                      setProfile({ ...profile, avatarUrl: newAvatar });
                      setIsEditingAvatar(false);
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* EL ENVOLTORIO FLEX PARA INFO + DIVISAS */}
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
                          await profileService.updateMyProfile({ bio: newBio });
                          setProfile({ ...profile, bio: newBio });
                          setIsEditingBio(false);
                        }}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECCIÓN DE DIVISAS: DEBE IR AQUÍ para estar AL LADO de profile-info */}
            <section className="currency-section">
              <div className="currency-item">
                <h2>Divisas Actuales</h2>
                {/* Corregir posible error: usar optional chaining o valor por defecto */}
                <strong>{profile.currency || '0'}</strong>
              </div>
            </section>

          </div> {/* CIERRE de .profile-details-wrapper */}

        </section> {/* CIERRE de .profile-card */}

        {/* BOTONES (Fuera de profile-card, como estaba) */}
        <section className="profile-buttons">
          <button type="button" className="historial-button">
            Historial
          </button>
        </section>

        {/* POSTS */}
        <section>
          <h3 className="posts-title">Publicaciones recientes</h3>

          {posts.length === 0 ? (
            <div className="posts-empty">
              No hay publicaciones públicas.
            </div>
          ) : (
            <div className="posts-list">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </section>

      </div>
    </main >
  );
}

export default Profile;