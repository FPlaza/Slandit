import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { postService } from '../services/postService';
import { authService } from '../services/authService';
import type { Post } from '../types/post.types';

function Feed() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  // 1. Carga inicial del Feed
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        let data: Post[] = [];
        
        const token = authService.getToken();

        if (token) {
           // A. Usuario Logueado: Cargar Feed Personalizado (Suscripciones)
           const myFeed = await postService.getMyFeed();
           
           // Si el feed personalizado viene vacío (no sigue a nadie),
           // podrías optar por cargar el Hot Feed como fallback.
           if (myFeed && myFeed.length > 0) {
             data = myFeed;
           } else {
             // Fallback opcional: Hot Posts si no sigue a nadie
             data = await postService.getHotPosts();
           }

        } else {
           // B. Invitado: Cargar Hot Posts (Redis)
           data = await postService.getHotPosts();
        }

        if (mounted) {
           setPosts(data);
        }
      } catch (err) {
        console.error("Error cargando feed:", err);
        if (mounted) setPosts([]);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // 2. Sincronización en tiempo real (Votos)
  // Escucha el evento 'post-updated' que emite PostCard al votar
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        if (!detail) return;

        // El ID puede venir como _id (backend) o id (frontend legado)
        const updatedId = detail._id || detail.id;
        if (!updatedId) return;

        setPosts((prev) => {
          if (!prev) return prev;
          
          return prev.map((p) => {
            // Encontramos el post que cambió
            if (p._id === updatedId) {
              return {
                ...p,
                // Actualizamos solo lo que cambió
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

  // 3. Sincronización de Borrado
  // Escucha el evento 'post-deleted'
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
        // ignore
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