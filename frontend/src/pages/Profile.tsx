import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { mockProfile, mockPosts, mockProfiles } from '../mocks/mockData';
import PostCard from '../components/PostCard';

function Profile() {
  const { username } = useParams();

  // usar username de la ruta; si no hay, mostrar el perfil mock por defecto
  // alias map: trata ciertos nombres legibles como alias de branquito
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
    <main style={{ padding: '1.5rem', minHeight: 'calc(100vh - 64px)', width: '100%' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <section style={{ display: 'flex', gap: 20, alignItems: 'center', padding: 20, borderRadius: 12, background: 'var(--card-bg)', boxShadow: 'var(--card-shadow)', border: 'var(--card-border-width) solid var(--card-border)' }}>
          <img
            src={profile.avatarUrl || '/icons/surprisedrudo.png'}
            alt={profile.displayName || username}
            style={{ width: 120, height: 120, borderRadius: 12, objectFit: 'cover', boxShadow: 'var(--card-shadow)' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 22, color: 'var(--card-title)' }}>{profile.displayName || username}</h2>
            <div style={{ color: 'var(--muted-text)', marginTop: 6 }}>@{profile.username}</div>
            <p style={{ marginTop: 12, maxWidth: 720, color: 'var(--card-text)', lineHeight: 1.5 }}>{profile.bio || 'Sin descripción.'}</p>
          </div>
        </section>

        <section>
          <h3 style={{ margin: '8px 0' }}>Publicaciones recientes</h3>
          {posts.length === 0 ? (
            <div style={{ color: 'var(--muted-text)' }}>No hay publicaciones públicas de este usuario (mock).</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
