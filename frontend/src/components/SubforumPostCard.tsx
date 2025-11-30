import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types/post.types';
import { postService } from '../services/postService';
import { authService } from '../services/authService';

type Props = { post: Post };

type VoteStatus = 'up' | 'down' | null;

export default function SubforumPostCard({ post }: Props) {
  const [score, setScore] = useState<number>(post.voteScore);
  const [userVote, setUserVote] = useState<VoteStatus>(null);
  const [animate, setAnimate] = useState(false);
  
  const currentUser = authService.getUser();
  const isAuthor = currentUser?.username === post.authorId.username;
  const profileLink = isAuthor 
      ? `/profile/${post.authorId.username}` 
      : `/guest-profile/${post.authorId.username}`;

  useEffect(() => {
    if (!currentUser) {
      setUserVote(null);
      return;
    }

    if (post.upvotedBy.includes(currentUser.id)) {
      setUserVote('up');
    } else if (post.downvotedBy.includes(currentUser.id)) {
      setUserVote('down');
    } else {
      setUserVote(null);
    }
    
    setScore(post.voteScore);
  }, [post._id, currentUser]);

  // Escuchamos eventos globales de post actualizado para sincronizar varias instancias
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        if (!detail) return;

        const updatedId = detail._id || detail.id;
        if (updatedId !== post._id) return;

        if (typeof detail.voteScore === 'number') {
          if (detail.voteScore !== score) {
            setScore(detail.voteScore);
            setAnimate(true);
            setTimeout(() => setAnimate(false), 300);
          } else {
            setScore(detail.voteScore);
          }
        }

        const userId = currentUser?.id;
        if (userId && (detail.upvotedBy || detail.downvotedBy)) {
          if (detail.upvotedBy && detail.upvotedBy.includes(userId)) setUserVote('up');
          else if (detail.downvotedBy && detail.downvotedBy.includes(userId)) setUserVote('down');
          else setUserVote(null);
        }
      } catch (err) {
        // ignoramos aca
      }
    };

    window.addEventListener('post-updated', handler as EventListener);
    return () => window.removeEventListener('post-updated', handler as EventListener);
  }, [post._id, currentUser]);

  const handleUp = async () => {
    if (!currentUser) return alert("Inicia sesión para votar");

    const previousVote = userVote;
    const previousScore = score;
    
    try {
      const updatedPost = await postService.toggleUpvote(post._id);
      
      setScore(updatedPost.voteScore);
      
      if (updatedPost.upvotedBy.includes(currentUser.id)) setUserVote('up');
      else setUserVote(null);

      window.dispatchEvent(new CustomEvent('post-updated', { detail: { ...updatedPost, id: (updatedPost as any)._id || (updatedPost as any).id } }));

    } catch (error) {
      console.error("Error votando:", error);
      setUserVote(previousVote);
      setScore(previousScore);
    }
  };

  const handleDown = async () => {
    if (!currentUser) return alert("Inicia sesión para votar");

    try {
      const updatedPost = await postService.toggleDownvote(post._id);
      
      setScore(updatedPost.voteScore);
      
      if (updatedPost.downvotedBy.includes(currentUser.id)) setUserVote('down');
      else setUserVote(null);

      window.dispatchEvent(new CustomEvent('post-updated', { detail: { ...updatedPost, id: (updatedPost as any)._id || (updatedPost as any).id } }));

    } catch (error) {
      console.error("Error votando:", error);
    }
  };

  // Borrar post (solo visible para el autor)
  const handleDelete = async () => {
    const currentUser = authService.getUser();
    if (!currentUser) return alert('Inicia sesión para eliminar publicaciones');

    if (!confirm('¿Seguro que quieres eliminar esta publicación?')) return;

    try {
      await postService.deletePost(post._id);
      window.dispatchEvent(new CustomEvent('post-deleted', { detail: { id: post._id } }));
    } catch (err) {
      console.error('Error eliminando post:', err);
      alert('No se pudo eliminar la publicación.');
    }
  };

  return (
    <article style={{
      border: 'var(--card-border-width) solid var(--card-border)',
      borderRadius: 12,
      padding: 18,
      display: 'flex',
      gap: 16,
      background: 'var(--card-bg)',
      alignItems: 'flex-start',
      boxShadow: 'var(--card-shadow)'
    }}>
      {/* votos */}
      <div style={{ width: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button 
          className={`vote-btn up ${userVote === 'up' ? 'active' : ''}`} 
          aria-pressed={userVote === 'up'} 
          onClick={handleUp} 
          aria-label="vote up"
          style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.2rem' }}
        >
          ▲
        </button>
        
        <strong style={{ margin: '4px 0', transition: 'transform 200ms ease', transform: animate ? 'scale(1.12)' : 'none' }}>{score}</strong>
        
        <button 
          className={`vote-btn down ${userVote === 'down' ? 'active' : ''}`} 
          aria-pressed={userVote === 'down'} 
          onClick={handleDown} 
          aria-label="vote down"
          style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.2rem' }}
        >
          ▼
        </button>
      </div>

      {/* info del post */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
          
          {/* icon del autor */}
          <Link to={profileLink} style={{ display: 'inline-block' }}>
            <img 
              src={post.authorId.avatarUrl || '/icons/surprisedrudo.png'} 
              alt={post.authorId.username} 
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} 
            />
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 14, color: 'var(--muted-text)' }}>
              {/* link al profile del usuario */}
              por <Link to={profileLink} style={{ color: 'var(--muted-text)', textDecoration: 'none', fontWeight: 500 }}>
                @{post.authorId.username}
              </Link>
            </div>
            
            {/* titulo */}
            <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: 0, color: 'var(--card-title)', fontSize: '1.1rem' }}>{post.title}</h3>
            </Link>
          </div>
        </div>

        <p style={{ margin: '8px 0', color: 'var(--card-text)', lineHeight: 1.5 }}>{post.content}</p>

        {/* footer */}
        <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center', color: 'var(--muted-text)', fontSize: 13 }}>
          <Link to={`/posts/${post._id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
             💬 <span>{post.commentCount} comentarios</span>
          </Link>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
          {/* boton eliminar (solo si es el autor el usuario logeado) */}
          {isAuthor && (
            <button
              onClick={handleDelete}
              style={{ marginLeft: 'auto', padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#e53935', color: '#fff', fontSize: 13 }}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}