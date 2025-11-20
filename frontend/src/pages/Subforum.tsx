import { useParams } from 'react-router-dom';
import { mockSubforums, mockPosts } from '../mocks/mockData';
import SubforumPostCard from '../components/SubforumPostCard';

export default function Subforum() {
  const { id } = useParams();
  const sub = mockSubforums.find((s) => s.name === id || s.id === id) ?? mockSubforums[0];

  const posts = mockPosts.filter((p) => p.subforum.id === sub.id || p.subforum.name === sub.name);

  return (
    <main style={{ padding: 20, maxWidth: 980, margin: '0 auto' }}>
      <header style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
        <img src={sub.iconUrl ?? '/icons/general.png'} alt={sub.displayName} style={{ width: 72, height: 72, borderRadius: 12 }} />
        <div>
          <h1 style={{ margin: 0 }}>{sub.displayName}</h1>
          <p style={{ margin: '6px 0', color: 'var(--muted-text)' }}>{sub.description}</p>
        </div>
      </header>

      <section style={{ display: 'grid', gap: 12 }}>
        {posts.map((p) => (
          <SubforumPostCard key={p.id} post={p} />
        ))}
      </section>
    </main>
  );
}
