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
  
  // Obtenemos el usuario actual para saber si ya votó
  const currentUser = authService.getUser();

  // 2. Calcular estado inicial basado en datos reales de Mongo
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
    
    // Actualizamos el score por si el post prop cambió
    setScore(post.voteScore);
  }, [post, currentUser]);

  // 3. Manejadores de Voto conectados a la API
  const handleUp = async () => {
    if (!currentUser) return alert("Inicia sesión para votar");

    // Optimistic UI: Actualizamos visualmente antes de que el servidor responda
    // (Opcional, pero se siente más rápido)
    const previousVote = userVote;
    const previousScore = score;
    
    try {
      // Llamamos al backend
      const updatedPost = await postService.toggleUpvote(post._id);
      
      // El backend nos devuelve el post actualizado con el cálculo exacto
      setScore(updatedPost.voteScore);
      
      // Recalculamos el estado del botón basado en la respuesta real
      if (updatedPost.upvotedBy.includes(currentUser.id)) setUserVote('up');
      else setUserVote(null);

    } catch (error) {
      console.error("Error votando:", error);
      // Si falla, revertimos (Rollback)
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

    } catch (error) {
      console.error("Error votando:", error);
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
      {/* SECCIÓN DE VOTOS */}
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
        
        <strong style={{ margin: '4px 0' }}>{score}</strong>
        
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

      {/* CONTENIDO DEL POST */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
          
          {/* Avatar del Autor (Usando authorId populado) */}
          <Link to={`/profile/${post.authorId.username}`} style={{ display: 'inline-block' }}>
            <img 
              src={post.authorId.avatarUrl || '/icons/surprisedrudo.png'} 
              alt={post.authorId.username} 
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} 
            />
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 14, color: 'var(--muted-text)' }}>
              {/* Link al Perfil */}
              por <Link to={`/profile/${post.authorId.username}`} style={{ color: 'var(--muted-text)', textDecoration: 'none', fontWeight: 500 }}>
                @{post.authorId.username}
              </Link>
            </div>
            
            {/* Título (Link al detalle del post) */}
            <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: 0, color: 'var(--card-title)', fontSize: '1.1rem' }}>{post.title}</h3>
            </Link>
          </div>
        </div>

        <p style={{ margin: '8px 0', color: 'var(--card-text)', lineHeight: 1.5 }}>{post.content}</p>

        {/* Footer del Post */}
        <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center', color: 'var(--muted-text)', fontSize: 13 }}>
          <Link to={`/posts/${post._id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
             💬 <span>{post.commentCount} comentarios</span>
          </Link>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </article>
  );
}