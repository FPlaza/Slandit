import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { postService } from '../services/postService';
import { authService } from '../services/authService';
import type { Post } from '../types/post.types';

function Feed() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        // Resetear a 'cargando' visualmente cuando cambiamos de usuario
        if (mounted) setPosts(null); 
        
        let data: Post[] = [];
        const token = authService.getToken();

        if (token) {
           const myFeed = await postService.getMyFeed();
           if (myFeed && myFeed.length > 0) {
             data = myFeed;
           } else {
             data = await postService.getHotPosts();
           }
        } else {
           data = await postService.getHotPosts();
        }

        if (mounted) setPosts(data);
      } catch (err) {
        console.error("Error cargando feed:", err);
        if (mounted) setPosts([]);
      }
    };

    load();

    const handleAuthChange = () => load();
    window.addEventListener('auth-changed', handleAuthChange);

    return () => {
      mounted = false;
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);


  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        if (!detail) return;

        const updatedId = detail._id || detail.id;
        if (!updatedId) return;

        setPosts((prev) => {
          if (!prev) return prev;
          
          return prev.map((p) => {
            if (p._id === updatedId) {
              return {
                ...p,
                voteScore: typeof detail.voteScore === 'number' ? detail.voteScore : p.voteScore,
                upvotedBy: detail.upvotedBy || p.upvotedBy,
                downvotedBy: detail.downvotedBy || p.downvotedBy,
                commentCount: typeof detail.commentCount === 'number' ? detail.commentCount : p.commentCount
              };
            }
            return p;
          });
        });
      } catch (err) {
        console.error(err);
      }
    };

    window.addEventListener('post-updated', handler as EventListener);
    return () => window.removeEventListener('post-updated', handler as EventListener);
  }, []);

  useEffect(() => {
    const delHandler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        const deletedId = detail?._id || detail?.id;
        
        if (!deletedId) return;
        
        setPosts((prev) => {
          if (!prev) return prev;
          return prev.filter(p => p._id !== deletedId);
        });
      } catch (err) {
      }
    };

    window.addEventListener('post-deleted', delHandler as EventListener);
    return () => window.removeEventListener('post-deleted', delHandler as EventListener);
  }, []);

  if (posts === null) {
    return <main style={{ padding: '1.5rem', minHeight: 'calc(100vh - 64px)', width: '100%', textAlign: 'center', color: 'var(--muted-text)' }}>Cargando...</main>;
  }

  return (
    <main style={{ padding: '1.5rem', minHeight: 'calc(100vh - 64px)', width: '100%' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted-text)' }}>
                <p>No hay publicaciones para mostrar.</p>
                {!authService.getToken() && <p>Inicia sesión o únete a una comunidad para ver contenido.</p>}
            </div>
        ) : (
            posts.map((p) => (
              <PostCard key={p._id} post={p} />
            ))
        )}
        
      </div>
    </main>
  );
}

export default Feed;