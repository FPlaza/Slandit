import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { MockPost } from '../mocks/mockData';
import { getVote, setVote, getScoreAdjustmentFor, Vote } from '../utils/voteStorage';
import { mockProfile } from '../mocks/mockData';

type Props = { post: MockPost };

export default function SubforumPostCard({ post }: Props) {
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
      <div style={{ width: 72, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button className={`vote-btn up ${vote === 'up' ? 'active' : ''}`} aria-pressed={vote === 'up'} onClick={handleUp} aria-label="vote up">▲</button>
        <strong style={{ margin: '8px 0' }}>{score}</strong>
        <button className={`vote-btn down ${vote === 'down' ? 'active' : ''}`} aria-pressed={vote === 'down'} onClick={handleDown} aria-label="vote down">▼</button>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
          <Link to={`/profile/${post.author.username}`} style={{ display: 'inline-block' }}>
            <img src={post.author.avatarUrl || '/icons/surprisedrudo.png'} alt={post.author.username} style={{ width: 48, height: 48, borderRadius: 999 }} />
          </Link>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 14, color: 'var(--muted-text)' }}>
              por <Link to={`/profile/${post.author.username}`} style={{ color: 'var(--muted-text)', textDecoration: 'none' }}>@{post.author.username}</Link>
            </div>
            <h3 style={{ margin: 0, color: 'var(--card-title)' }}>{post.title}</h3>
          </div>
        </div>

        <p style={{ margin: 0, color: 'var(--card-text)', lineHeight: 1.6 }}>{post.content}</p>

        <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center', color: 'var(--muted-text)' }}>
          <span>{post.commentCount} comentarios</span>
          <span>•</span>
          <span style={{ fontSize: 13 }}>{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </article>
  );
}
