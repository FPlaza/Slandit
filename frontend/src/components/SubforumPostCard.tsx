import React from 'react';
import type { MockPost } from '../mocks/mockData';

type Props = { post: MockPost };

export default function SubforumPostCard({ post }: Props) {
  return (
    <article style={{
      border: '1px solid var(--card-border)',
      borderRadius: 12,
      padding: 18,
      display: 'flex',
      gap: 16,
      background: 'var(--card-bg)',
      alignItems: 'flex-start',
      boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
    }}>
      <div style={{ width: 72, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>▲</button>
        <strong style={{ margin: '8px 0' }}>{post.voteScore}</strong>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>▼</button>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
          <img src={post.author.avatarUrl} alt={post.author.username} style={{ width: 48, height: 48, borderRadius: 999 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 14, color: 'var(--muted-text)' }}>
              por {post.author.username}
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
