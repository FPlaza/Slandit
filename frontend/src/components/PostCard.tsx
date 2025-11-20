import React from 'react';
import type { MockPost } from '../mocks/mockData';
import { mockSubforums } from '../mocks/mockData';

type Props = { post: MockPost };

const PostCard: React.FC<Props> = ({ post }) => {
  return (
    <article style={{
      border: '1px solid var(--card-border)',
      borderRadius: 8,
      padding: 16,
      display: 'flex',
      gap: 12,
      background: 'var(--card-bg)',
      minHeight: 160,
      alignItems: 'flex-start'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 56 }}>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>▲</button>
        <strong>{post.voteScore}</strong>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>▼</button>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: 'var(--muted-text)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
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
          <span>• por {post.author.username}</span>
        </div>
        <h3 style={{ margin: '4px 0 8px', fontSize: 18, color: 'var(--card-title)' }}>{post.title}</h3>
        <p style={{ margin: 0, color: 'var(--card-text)' }}>{post.content.slice(0, 200)}{post.content.length > 200 ? '…' : ''}</p>
        <div style={{ marginTop: 10, fontSize: 13, color: 'var(--muted-text)' }}>{post.commentCount} comentarios</div>
      </div>
    </article>
  );
};

export default PostCard;
