import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { MockPost } from '../mocks/mockData';
import { mockSubforums, mockProfile } from '../mocks/mockData';
import { getVote, setVote, getScoreAdjustmentFor, type Vote } from '../utils/voteStorage';
import { postService } from '../services/postService';
import { authService } from '../services/authService';

type Props = { post: MockPost };

const PostCard: React.FC<Props> = ({ post }) => {
  const [vote, setVoteState] = useState<Vote>(null);
  const [score, setScore] = useState<number>(post.voteScore);
  const navigate = useNavigate();

  const currentUser = authService.getUser();
  // Normalizamos el id del autor (soporta mock shape o objeto populated)
  const authorId = (post.author && (post.author as any).id) || (post.authorId && ((post as any).authorId._id || (post as any).authorId.id)) || null;
  const usernameForStorage = currentUser?.username || mockProfile.username;
  const [animateScore, setAnimateScore] = useState(false);

  useEffect(() => {
    const stored = getVote(post.id, usernameForStorage);
    setVoteState(stored);
    setScore(post.voteScore + getScoreAdjustmentFor(stored));

    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        if (!detail) return;

        // El identificador que viene del servidor es `_id`, en UI usamos `id`
        const updatedId = detail._id || detail.id;
        if (updatedId !== post.id) return;

        // Si el servidor devolvió arrays de votos, actualizamos estado en base a user
        if (detail.upvotedBy || detail.downvotedBy) {
          const userId = currentUser?.id;
          if (userId) {
            if (detail.upvotedBy && detail.upvotedBy.includes(userId)) setVoteState('up');
            else if (detail.downvotedBy && detail.downvotedBy.includes(userId)) setVoteState('down');
            else setVoteState(null);
          }
        }

        if (typeof detail.voteScore === 'number') {
          // Si cambia el score, actualizamos e iniciamos una animación corta
          if (detail.voteScore !== score) {
            setScore(detail.voteScore);
            setAnimateScore(true);
            setTimeout(() => setAnimateScore(false), 300);
          } else {
            setScore(detail.voteScore);
          }
        }
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('post-updated', handler as EventListener);

    return () => {
      window.removeEventListener('post-updated', handler as EventListener);
    };
  }, [post.id, usernameForStorage, currentUser]);

  const handleUp = async () => {
    const current = getVote(post.id, usernameForStorage);

    // Si hay usuario autenticado intentamos la llamada al backend
    if (currentUser) {
      try {
        const updated = await postService.toggleUpvote(post.id);
        // Normalizamos id y _id y emitimos evento con el post actualizado para sincronizar otras vistas
        window.dispatchEvent(new CustomEvent('post-updated', { detail: { ...(updated as any), id: (updated as any)._id || (updated as any).id } }));
      } catch (err) {
        console.error('Error toggling upvote', err);
      }

      return;
    }

    // Sinon, comportamiento local (mock) usando storage
      if (current === 'up') {
      setVote(post.id, usernameForStorage, null);
      setVoteState(null);
      setScore((s) => s - 1);
      window.dispatchEvent(new CustomEvent('post-updated', { detail: { id: post.id, _id: post.id, voteScore: score - 1 } }));
    } else if (current === 'down') {
      setVote(post.id, usernameForStorage, 'up');
      setVoteState('up');
      setScore((s) => s + 2);
      window.dispatchEvent(new CustomEvent('post-updated', { detail: { id: post.id, _id: post.id, voteScore: score + 2 } }));
    } else {
      setVote(post.id, usernameForStorage, 'up');
      setVoteState('up');
      setScore((s) => s + 1);
      window.dispatchEvent(new CustomEvent('post-updated', { detail: { id: post.id, _id: post.id, voteScore: score + 1 } }));
    }
  };

  const handleDown = async () => {
    const current = getVote(post.id, usernameForStorage);

    if (currentUser) {
      try {
        const updated = await postService.toggleDownvote(post.id);
        window.dispatchEvent(new CustomEvent('post-updated', { detail: { ...(updated as any), id: (updated as any)._id || (updated as any).id } }));
      } catch (err) {
        console.error('Error toggling downvote', err);
      }

      return;
    }

    if (current === 'down') {
      setVote(post.id, usernameForStorage, null);
      setVoteState(null);
      setScore((s) => s + 1);
      window.dispatchEvent(new CustomEvent('post-updated', { detail: { id: post.id, _id: post.id, voteScore: score + 1 } }));
    } else if (current === 'up') {
      setVote(post.id, usernameForStorage, 'down');
      setVoteState('down');
      setScore((s) => s - 2);
      window.dispatchEvent(new CustomEvent('post-updated', { detail: { id: post.id, _id: post.id, voteScore: score - 2 } }));
    } else {
      setVote(post.id, usernameForStorage, 'down');
      setVoteState('down');
      setScore((s) => s - 1);
      window.dispatchEvent(new CustomEvent('post-updated', { detail: { id: post.id, _id: post.id, voteScore: score - 1 } }));
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
        minHeight: 160,
        alignItems: 'flex-start'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 56 }}>
        <button
          className={`vote-btn up ${vote === 'up' ? 'active' : ''}`}
          aria-pressed={vote === 'up'}
          onClick={handleUp}
        >
          ▲
        </button>

        <strong style={{ transition: 'transform 200ms ease', transform: animateScore ? 'scale(1.12)' : 'none' }}>{score}</strong>

        <button
          className={`vote-btn down ${vote === 'down' ? 'active' : ''}`}
          aria-pressed={vote === 'down'}
          onClick={handleDown}
        >
          ▼
        </button>
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 12,
            color: 'var(--muted-text)',
            marginBottom: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          {(() => {
            const sf = mockSubforums.find(
              s => s.name === post.subforum.name || s.id === post.subforum.id
            );
            return (
              <img
                src={sf?.iconUrl || '/vite.svg'}
                alt={post.subforum.displayName}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                  objectFit: 'cover'
                }}
              />
            );
          })()}

          <span style={{ marginRight: 8 }}>r/{post.subforum.name}</span>

          <span>• por </span>

          <Link
            to={`/guest-profile/${post.author.username}`}
            style={{
              color: 'var(--muted-text)',
              textDecoration: 'none',
              marginLeft: 4
            }}
          >
            @{post.author.username}
          </Link>
          {/* Mostrar botón eliminar solo al autor */}
          {currentUser && authorId && currentUser.id === String(authorId) && (
            <button
              onClick={async () => {
                if (!confirm('¿Seguro que quieres eliminar esta publicación?')) return;
                try {
                  await postService.deletePost(post.id);
                  window.dispatchEvent(new CustomEvent('post-deleted', { detail: { id: post.id } }));
                } catch (err) {
                  console.error('Error eliminando post:', err);
                  alert('No se pudo eliminar la publicación.');
                }
              }}
              style={{ marginLeft: 'auto', padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#e53935', color: '#fff', fontSize: 13 }}
            >
              Eliminar
            </button>
          )}
        </div>

        {/* 🔥 Título clickeable con username */}
        <h3
          style={{
            margin: '4px 0 8px',
            fontSize: 18,
            color: 'var(--card-title)',
            cursor: 'pointer'
          }}
          onClick={() => navigate(`/posts/${post.id}`)}
        >
          {post.title}
        </h3>

        <p style={{ margin: 0, color: 'var(--card-text)' }}>
          {post.content.slice(0, 200)}
          {post.content.length > 200 ? '…' : ''}
        </p>

        <div style={{ marginTop: 10, fontSize: 13, color: 'var(--muted-text)' }}>
          {post.commentCount} comentarios
        </div>
      </div>
    </article>
  );
};

export default PostCard;
