import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { mockSubforums, mockPosts, mockProfile, addMockPost, makeId } from '../mocks/mockData';
import SubforumPostCard from '../components/SubforumPostCard';

export default function Subforum() {
  const { id } = useParams();
  const sub = mockSubforums.find((s) => s.name === id || s.id === id) ?? mockSubforums[0];

  const [posts, setPosts] = useState(() => mockPosts.filter((p) => p.subforum.id === sub.id || p.subforum.name === sub.name).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const onChange = () => setPosts(mockPosts.filter((p) => p.subforum.id === sub.id || p.subforum.name === sub.name).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    window.addEventListener('mockPostsChanged', onChange as EventListener);
    // run once immediately so switching subforums updates the list right away
    onChange();
    return () => window.removeEventListener('mockPostsChanged', onChange as EventListener);
  }, [sub.id, sub.name]);

  const openCreate = () => setCreating(true);
  const closeCreate = () => {
    setCreating(false);
    setTitle('');
    setContent('');
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    const newPost = {
      id: makeId(),
      title: title.trim(),
      content: content.trim() || '',
      author: mockProfile,
      subforum: { id: sub.id, name: sub.name, displayName: sub.displayName },
      voteScore: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
    };
    addMockPost(newPost as any);
    closeCreate();
  };

  return (
    <main style={{ padding: 20, maxWidth: 980, margin: '0 auto' }}>
      <header style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18, justifyContent: 'space-between' }}>
        <img src={sub.iconUrl ?? '/icons/general.png'} alt={sub.displayName} style={{ width: 72, height: 72, borderRadius: 12 }} />
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flex: 1 }}>
          <div>
            <h1 style={{ margin: 0 }}>{sub.displayName}</h1>
            <p style={{ margin: '6px 0', color: 'var(--muted-text)' }}>{sub.description}</p>
          </div>
        </div>
        <div>
          <button className="icon-btn" onClick={openCreate} style={{ padding: '8px 12px', borderRadius: 8 }}>Crear publicación</button>
        </div>
      </header>

      <section style={{ display: 'grid', gap: 12 }}>
        {posts.map((p) => (
          <SubforumPostCard key={p.id} post={p} />
        ))}
      </section>

      {creating && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
          <div style={{ width: 680, background: 'var(--card-bg)', padding: 18, borderRadius: 10, border: 'var(--card-border-width) solid var(--card-border)' }}>
            <h3>Crear publicación en {sub.displayName}</h3>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" style={{ width: '100%', padding: 8, margin: '8px 0' }} />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Contenido" style={{ width: '100%', minHeight: 120, padding: 8 }} />
            <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={closeCreate} className="icon-btn">Cancelar</button>
              <button onClick={handleCreate} className="icon-btn" style={{ background: 'var(--accent)', color: '#fff' }}>Publicar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
