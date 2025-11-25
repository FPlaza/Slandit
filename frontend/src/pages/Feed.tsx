import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { mockPosts } from '../mocks/mockData';

function Feed() {
  const [posts, setPosts] = useState(() => [...mockPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

  useEffect(() => {
    const onChange = () => setPosts([...mockPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    window.addEventListener('mockPostsChanged', onChange as EventListener);
    return () => window.removeEventListener('mockPostsChanged', onChange as EventListener);
  }, []);

  return (
    <main style={{ padding: '1.5rem', minHeight: 'calc(100vh - 64px)', width: '100%' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </main>
  );
}

export default Feed;
