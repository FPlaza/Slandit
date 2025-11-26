import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { MockPost } from '../mocks/mockData';
import { mockSubforums, mockProfile } from '../mocks/mockData';
import { getVote, setVote, getScoreAdjustmentFor, type Vote } from '../utils/voteStorage';

type Props = { post: MockPost };

const PostCard: React.FC<Props> = ({ post }) => {
  const [vote, setVoteState] = useState<Vote>(null);
  const [score, setScore] = useState<number>(post.voteScore);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = getVote(post.id, mockProfile.username);
    setVoteState(stored);
    setScore(post.voteScore + getScoreAdjustmentFor(stored));
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

        <strong>{score}</strong>

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
        </div>

        {/* 🔥 Título clickeable con username */}
        <h3
          style={{
            margin: '4px 0 8px',
            fontSize: 18,
            color: 'var(--card-title)',
            cursor: 'pointer'
          }}
          onClick={() => navigate(`/post/${post.id}/${post.author.username}`)}
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
