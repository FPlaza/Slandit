import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { mockPosts } from '../mocks/mockData';
import { postService } from '../services/postService';
import type { Post as ApiPost } from '../types/post.types';

type UiPost = {
  id: string;
  title: string;
  content: string;
  author: { id: string; username: string; displayName?: string; avatarUrl?: string };
  subforum: { id: string; name: string; displayName?: string };
  voteScore: number;
  commentCount: number;
  createdAt: string;
};

function mapApiPostToUi(p: ApiPost): UiPost {
  return {
    id: p._id,
    title: p.title,
    content: p.content,
    author: {
      id: (p.authorId as any)?._id || (p.authorId as any)?.id || 'unknown',
      username: (p.authorId as any)?.username || 'unknown',
      displayName: (p.authorId as any)?.displayName || (p.authorId as any)?.username || 'Usuario',
      avatarUrl: (p.authorId as any)?.avatarUrl || '/icons/default.png',
    },
    subforum: {
      id: (p.subforumId as any)?._id || (p.subforumId as any)?.id || 'unknown',
      name: (p.subforumId as any)?.name || 'general',
      displayName: (p.subforumId as any)?.displayName || (p.subforumId as any)?.name || 'General',
    },
    voteScore: p.voteScore,
    commentCount: p.commentCount,
    createdAt: p.createdAt,
  };
}

function Feed() {
  const [posts, setPosts] = useState<UiPost[] | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // Intentamos obtener el feed del backend (requiere token). Si no hay token
        // o la respuesta está vacía, caemos de regreso a los mockData para desarrollo.
        const apiPosts: ApiPost[] = await postService.getMyFeed();

        if (!mounted) return;

        if (apiPosts && apiPosts.length > 0) {
          const ui = apiPosts.map(mapApiPostToUi).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setPosts(ui);
        } else {
          // Si no hay posts privados, intentamos obtener posts públicos recientes
          const recent = await postService.getRecentPosts();
          if (recent && recent.length > 0) {
            const uiRecent = recent.map(mapApiPostToUi).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setPosts(uiRecent);
            return;
          }

          // Fallback a datos mock si la API devuelve vacío
          const ui = [...mockPosts].map((m) => ({
            id: m.id,
            title: m.title,
            content: m.content,
            author: { id: m.author.id, username: m.author.username, displayName: m.author.displayName, avatarUrl: m.author.avatarUrl },
            subforum: { id: m.subforum.id, name: m.subforum.name, displayName: m.subforum.displayName },
            voteScore: m.voteScore,
            commentCount: m.commentCount,
            createdAt: m.createdAt,
          })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setPosts(ui);
        }
      } catch (err) {
        // En caso de error (p. ej. sin token o CORS), usamos mock como fallback
        const ui = [...mockPosts].map((m) => ({
          id: m.id,
          title: m.title,
          content: m.content,
          author: { id: m.author.id, username: m.author.username, displayName: m.author.displayName, avatarUrl: m.author.avatarUrl },
          subforum: { id: m.subforum.id, name: m.subforum.name, displayName: m.subforum.displayName },
          voteScore: m.voteScore,
          commentCount: m.commentCount,
          createdAt: m.createdAt,
        })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setPosts(ui);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // Escuchamos post-updated para sincronizar el array de posts en el feed principal
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
            if (p.id === updatedId || p.id === (detail._id || detail.id)) {
              return {
                ...p,
                voteScore: typeof detail.voteScore === 'number' ? detail.voteScore : p.voteScore,
                // keep other arrays if provided
                // @ts-ignore
                upvotedBy: detail.upvotedBy || (p as any).upvotedBy,
                // @ts-ignore
                downvotedBy: detail.downvotedBy || (p as any).downvotedBy,
              } as UiPost;
            }
            return p;
          });
        });
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('post-updated', handler as EventListener);
    return () => window.removeEventListener('post-updated', handler as EventListener);
  }, []);

  // Escuchamos post-deleted para remover posts del feed cuando se borran
  useEffect(() => {
    const delHandler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        if (!detail || !detail.id) return;
        setPosts((prev) => {
          if (!prev) return prev;
          return prev.filter(p => p.id !== detail.id);
        });
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('post-deleted', delHandler as EventListener);
    return () => window.removeEventListener('post-deleted', delHandler as EventListener);
  }, []);

  if (posts === null) {
    return <main style={{ padding: '1.5rem', minHeight: 'calc(100vh - 64px)', width: '100%' }}>Cargando...</main>;
  }

  return (
    <main style={{ padding: '1.5rem', minHeight: 'calc(100vh - 64px)', width: '100%' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {posts.map((p) => (
          <PostCard key={p.id} post={p as any} />
        ))}
      </div>
    </main>
  );
}

export default Feed;
