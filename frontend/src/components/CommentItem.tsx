import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Comment } from '../types/comment.types';
import { authService } from '../services/authService';

interface Props {
  comment: Comment;
  depth: number; 
  onReplySubmit: (content: string, parentId: string) => Promise<void>;
}

export default function CommentItem({ comment, depth, onReplySubmit }: Props) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const currentUser = authService.getUser();
  const MAX_DEPTH = 5; 

  // Verificamos si autor == usuario comentando
  const isMe = currentUser?.username === comment.authorId.username;
  
  // aca vemos si es un profile o si es un invitado 
  const profileLink = isMe 
    ? `/profile/${comment.authorId.username}` 
    : `/guest-profile/${comment.authorId.username}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    setSubmitting(true);
    await onReplySubmit(replyContent, comment._id);
    setSubmitting(false);
    setIsReplying(false);
    setReplyContent('');
  };

  return (
    <div style={{ 
      marginTop: 12,
      marginLeft: depth > 0 ? 24 : 0, 
      borderLeft: depth > 0 ? '2px solid var(--card-border)' : 'none',
      paddingLeft: depth > 0 ? 12 : 0
    }}>
      
      <div className="comment-card" style={{ background: 'var(--card-bg)', padding: 10, borderRadius: 8, border: '1px solid var(--card-border)' }}>
        <div className="comment-header" style={{ display: 'flex', gap: 8, fontSize: '0.85rem', marginBottom: 4, alignItems: 'center' }}>
          
          {/* 2. Enlace en el AVATAR usando profileLink */}
          <Link to={profileLink} style={{ display: 'flex' }}>
            <img 
                src={comment.authorId.avatarUrl || '/icons/surprisedrudo.png'} 
                alt={comment.authorId.username} 
                style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} 
            />
          </Link>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
             {/* 3. Enlace en el NOMBRE usando profileLink */}
             <Link 
                to={profileLink} 
                style={{ fontWeight: 'bold', color: 'inherit', textDecoration: 'none' }}
             >
                {comment.authorId.username}
             </Link>
             
             <span style={{ color: 'var(--muted-text)' }}>
                • {new Date(comment.createdAt).toLocaleDateString()}
             </span>
          </div>

        </div>

        <div className="comment-body" style={{ fontSize: '0.95rem', lineHeight: 1.4, color: 'var(--card-text)' }}>
          {comment.content}
        </div>

        <div style={{ marginTop: 6 }}>
           {depth < MAX_DEPTH && currentUser && (
             <button 
               onClick={() => setIsReplying(!isReplying)}
               style={{ background: 'none', border: 'none', color: 'var(--muted-text)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
             >
               {isReplying ? 'Cancelar' : 'Responder'}
             </button>
           )}
        </div>
      </div>

      {isReplying && (
        <form onSubmit={handleSubmit} style={{ marginTop: 8, marginLeft: 12 }}>
           <textarea 
             value={replyContent}
             onChange={e => setReplyContent(e.target.value)}
             placeholder={`Respondiendo a ${comment.authorId.username}...`}
             style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid var(--card-border)', background: 'var(--bg-color)', color: 'var(--card-text)', minHeight: 60 }}
             autoFocus
           />
           <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
             <button type="submit" disabled={submitting} style={{ padding: '6px 12px', borderRadius: 4, border: 'none', background: '#9f4bee', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>
               {submitting ? 'Enviando...' : 'Responder'}
             </button>
           </div>
        </form>
      )}

      {comment.children && comment.children.map(child => (
        <CommentItem 
          key={child._id} 
          comment={child} 
          depth={depth + 1} 
          onReplySubmit={onReplySubmit} 
        />
      ))}

    </div>
  );
}