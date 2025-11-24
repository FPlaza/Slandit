import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { mockProfile, mockPosts, mockProfiles } from '../mocks/mockData';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();

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
          <img
            src={profile.avatarUrl || '/icons/surprisedrudo.png'}
            alt={profile.displayName || username}
            className="profile-avatar"
          />

          <div className="profile-info">
            <h2 className="profile-username">@{profile.username}</h2>
            <p className="profile-bio">{profile.bio || 'Sin descripción.'}</p>
          </div>
        </section>

        <section className="profile-buttons">
          <button
            type="button"
            className="edit-button"
            onClick={() => navigate('/editar-perfil')}>Editar perfil
          </button>

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
