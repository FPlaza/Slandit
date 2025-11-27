import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 1. Importar el tipo REAL (Post) y borrar MockPost
import type { Post } from '../types/post.types'; 
import { postService } from '../services/postService';
import { authService } from '../services/authService';

// 2. Actualizar las Props
type Props = { post: Post };

type VoteStatus = 'up' | 'down' | null;

const PostCard: React.FC<Props> = ({ post }) => {
  const [score, setScore] = useState<number>(post.voteScore);
  const [userVote, setUserVote] = useState<VoteStatus>(null);
  const navigate = useNavigate();
  const currentUser = authService.getUser();

  const isAuthor = currentUser?.username === post.authorId.username;
  const profileLink = isAuthor 
    ? `/profile/${post.authorId.username}` 
    : `/guest-profile/${post.authorId.username}`;

  // 3. Lógica de autor (Usando los campos reales populados)
  // post.authorId es un OBJETO completo gracias a .populate()

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

  const handleUp = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return alert("Inicia sesión para votar");

    try {
      const updated = await postService.toggleUpvote(post._id);
      setScore(updated.voteScore);
      if (updated.upvotedBy.includes(currentUser.id)) setUserVote('up');
      else setUserVote(null);
      window.dispatchEvent(new CustomEvent('post-updated', { 
        detail: updated 
      }));
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };

  const handleDown = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return alert("Inicia sesión para votar");
    try {
      const updated = await postService.toggleDownvote(post._id);
      setScore(updated.voteScore);
      if (updated.downvotedBy.includes(currentUser.id)) setUserVote('down');
      else setUserVote(null);
      window.dispatchEvent(new CustomEvent('post-updated', { 
        detail: updated 
      }));
    } catch (err) {
      console.error('Error downvoting:', err);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!confirm('¿Eliminar publicación?')) return;
      try {
          await postService.deletePost(post._id);
          window.location.reload(); 
      } catch (err) {
          alert('No se pudo eliminar');
      }
  };

  return (
    <article
      style={{
        border: 'var(--card-border-width) solid var(--card-border)',
        borderRadius: 8,
        padding: 16,
        display: 'flex',
        gap: 12,
        background: 'var(--card-bg)',
        minHeight: 120,
        alignItems: 'flex-start',
        cursor: 'pointer',
        marginBottom: 12
      }}
      onClick={() => navigate(`/posts/${post._id}`)}
    >
      {/* VOTOS */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40 }} onClick={e => e.stopPropagation()}>
        <button
          className={`vote-btn up ${userVote === 'up' ? 'active' : ''}`}
          onClick={handleUp}
          style={{background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}
        >
          ▲
        </button>
        <strong style={{ margin: '4px 0' }}>{score}</strong>
        <button
          className={`vote-btn down ${userVote === 'down' ? 'active' : ''}`}
          onClick={handleDown}
          style={{background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}
        >
          ▼
        </button>
      </div>

      {/* CONTENIDO */}
      <div style={{ flex: 1 }}>
        <div
          style={{ fontSize: 12, color: 'var(--muted-text)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={e => e.stopPropagation()}
        >
          {/* 4. USAR DATOS REALES (subforumId.icon, authorId.username, etc.) */}
          <img
            src={post.subforumId.icon || '/icons/default.png'}
            alt=""
            style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'cover' }}
          />
          <Link to={`/subforum/${post.subforumId._id}`} style={{ fontWeight: 'bold', color: 'inherit', textDecoration: 'none' }}>
            r/{post.subforumId.name}
          </Link>

          <span>• por</span>

          <Link to={profileLink} style={{ color: 'var(--muted-text)', textDecoration: 'none' }}>
            @{post.authorId.username}
          </Link>

          {isAuthor && (
              <button 
                onClick={handleDelete}
                style={{marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#e53935'}}
                title="Eliminar post"
              >
                  🗑️
              </button>
          )}
        </div>

        <h3 style={{ margin: '4px 0 8px', fontSize: 18, color: 'var(--card-title)' }}>
          {post.title}
        </h3>

        <p style={{ margin: 0, color: 'var(--card-text)', fontSize: '14px' }}>
          {post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}
        </p>

        <div style={{ marginTop: 10, fontSize: 13, color: 'var(--muted-text)', display: 'flex', gap: 10 }}>
          <span>💬 {post.commentCount} comentarios</span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;