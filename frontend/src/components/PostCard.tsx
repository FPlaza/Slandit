import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { MockPost } from '../mocks/mockData';
import { mockSubforums, mockProfile, removeMockPost } from '../mocks/mockData';
import { FiTrash2 } from 'react-icons/fi';
import ConfirmModal from './ConfirmModal';
import { getVote, setVote, getScoreAdjustmentFor, Vote } from '../utils/voteStorage';

type Props = { post: MockPost };

const PostCard: React.FC<Props> = ({ post }) => {
  const [vote, setVoteState] = useState<Vote>(null);
  const [score, setScore] = useState<number>(post.voteScore);

  useEffect(() => {
    const stored = getVote(post.id, mockProfile.username);
    setVoteState(stored);
    setScore(post.voteScore + getScoreAdjustmentFor(stored));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id]);

  const handleUp = () => {
    const current = getVote(post.id, mockProfile.username);
    if (current === 'up') {
      setVote(post.id, mockProfile.username, null);
      setVoteState(null);
      setScore((s) => s - 1);
    } else if (current === 'down') {
      setVote(post.id, mockProfile.username, 'up');
      setVoteState('up');
      setScore((s) => s + 2);
    } else {
      setVote(post.id, mockProfile.username, 'up');
      setVoteState('up');
      setScore((s) => s + 1);
    }
  };

  const handleDown = () => {
    const current = getVote(post.id, mockProfile.username);
    if (current === 'down') {
      setVote(post.id, mockProfile.username, null);
      setVoteState(null);
      setScore((s) => s + 1);
    } else if (current === 'up') {
      setVote(post.id, mockProfile.username, 'down');
      setVoteState('down');
      setScore((s) => s - 2);
    } else {
      setVote(post.id, mockProfile.username, 'down');
      setVoteState('down');
      setScore((s) => s - 1);
    }
  };

  const handleDelete = () => {
    // open confirm modal instead
    setConfirmOpen(true);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);

  const onConfirmDelete = () => {
    removeMockPost(post.id);
    setConfirmOpen(false);
  };

  const onCancelDelete = () => setConfirmOpen(false);

  return (
    <>
      <article style={{
      border: 'var(--card-border-width) solid var(--card-border)',
      borderRadius: 8,
      padding: 16,
      display: 'flex',
      gap: 12,
      background: 'var(--card-bg)',
      minHeight: 160,
      alignItems: 'flex-start'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 56 }}>
        <button className={`vote-btn up ${vote === 'up' ? 'active' : ''}`} aria-pressed={vote === 'up'} onClick={handleUp} aria-label="vote up">▲</button>
        <strong>{score}</strong>
        <button className={`vote-btn down ${vote === 'down' ? 'active' : ''}`} aria-pressed={vote === 'down'} onClick={handleDown} aria-label="vote down">▼</button>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: 'var(--muted-text)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {(() => {
            const sf = mockSubforums.find(s => s.name === post.subforum.name || s.id === post.subforum.id);
            return (
              <img
                src={sf?.iconUrl || '/vite.svg'}
                alt={post.subforum.displayName}
                style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
              />
            );
          })()}
          <span style={{ marginRight: 8 }}>r/{post.subforum.name}</span>
          <span>• por </span>
          <Link to={`/profile/${post.author.username}`} style={{ color: 'var(--muted-text)', textDecoration: 'none', marginLeft: 4 }}>
            @{post.author.username}
          </Link>
          </div>
          {post.author.username === mockProfile.username && (
            <button className="icon-btn delete-btn" onClick={handleDelete} title="Eliminar publicación" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <FiTrash2 />
            </button>
          )}
        </div>
        <h3 style={{ margin: '4px 0 8px', fontSize: 18, color: 'var(--card-title)' }}>{post.title}</h3>
        <p style={{ margin: 0, color: 'var(--card-text)' }}>{post.content.slice(0, 200)}{post.content.length > 200 ? '…' : ''}</p>
        <div style={{ marginTop: 10, fontSize: 13, color: 'var(--muted-text)' }}>{post.commentCount} comentarios</div>
      </div>
    </article>
      <ConfirmModal open={confirmOpen} title="Eliminar publicación" message="¿Eliminar publicación? Esto no se puede deshacer." onConfirm={onConfirmDelete} onCancel={onCancelDelete} />
    </>
  );
};

export default PostCard;
