import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { mockProfile, mockPosts, mockProfiles } from '../mocks/mockData';
import PostCard from '../components/PostCard';
import { useState } from 'react';
import '../styles/Profile.css';

function Profile() {
  const { username } = useParams();

  const aliasMap: Record<string, string> = {
    usuario: mockProfile.username,
    branquito: mockProfile.username,
    branco: mockProfile.username,
  };

  const effectiveUsername = (username && (aliasMap[username.toLowerCase()] ?? username)) ?? mockProfile.username;

  const profile = useMemo(() => {
    const target = (effectiveUsername || '').toLowerCase();

    // Preferir perfiles 'en la base de datos' (mockProfiles)
    const fromProfiles = mockProfiles.find((u) => {
      const uu = (u.username || '').toLowerCase();
      const ud = (u.displayName || '').toLowerCase();
      return uu === target || ud === target;
    });
    if (fromProfiles) return fromProfiles;

    // Si no hay en mockProfiles, intentar encontrar autor a través de posts
    const found = mockPosts.find((p) => {
      const au = (p.author.username || '').toLowerCase();
      const ad = (p.author.displayName || '').toLowerCase();
      return au === target || ad === target;
    });
    if (found) return found.author;

    // fallback: si es el perfil mock, devolver mockProfile tal cual
    if (effectiveUsername === mockProfile.username) return mockProfile;

    // fallback genérico: crear perfil temporal basado en el parámetro
    return {
      id: 'unknown',
      username: effectiveUsername,
      displayName: effectiveUsername,
      avatarUrl: '/icons/surprisedrudo.png',
      bio: '',
    };
  }, [effectiveUsername]);

  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const [newAvatar, setNewAvatar] = useState(profile.avatarUrl);
  const [newBio, setNewBio] = useState(profile.bio);


  const posts = useMemo(() => {
    const target = (effectiveUsername || '').toLowerCase();
    return mockPosts
      .filter((p) => {
        const au = (p.author.username || '').toLowerCase();
        const ad = (p.author.displayName || '').toLowerCase();
        return au === target || ad === target;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [effectiveUsername]);

  return (
    <main className="profile-main">
      <div className="profile-wrapper">

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
                  <button onClick={() => setIsEditingAvatar(false)}>Guardar</button>
                </div>
              </div>
            )}
          </div>

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
                    <button onClick={() => setIsEditingBio(false)}>Guardar</button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        <section className="profile-buttons">
          <button type="button" className="historial-button">
            Historial
          </button>
        </section>


        <section>
          <h3 className="posts-title">Publicaciones recientes</h3>

          {posts.length === 0 ? (
            <div className="posts-empty">
              No hay publicaciones públicas de este usuario (mock).
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
    </main>
  );

}

export default Profile;
