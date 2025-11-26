import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { authService } from '../services/authService';
import type { Post as PostType } from '../types/post.types';
import type { Comment } from '../types/comment.types';
import '../styles/Post.css';
import { MdChatBubbleOutline } from 'react-icons/md';

// Definimos el tipo para el estado del voto local
type VoteStatus = 'up' | 'down' | null;

export default function Post() {
  const { id } = useParams(); // ID del post
  const navigate = useNavigate();
  
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el nuevo comentario
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Estados para la lógica de votación
  const [score, setScore] = useState<number>(0);
  const [userVote, setUserVote] = useState<VoteStatus>(null);
  
  const user = authService.getUser();

  // 1. Cargar datos al inicio
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Cargar Post
        const postData = await postService.getPostById(id);
        setPost(postData);
        
        // Inicializar estados de voto con datos reales
        setScore(postData.voteScore);
        if (user) {
            if (postData.upvotedBy.includes(user.id)) setUserVote('up');
            else if (postData.downvotedBy.includes(user.id)) setUserVote('down');
            else setUserVote(null);
        }

        // Cargar Comentarios
        const commentsData = await commentService.getCommentsByPostId(id);
        setComments(commentsData);
      } catch (error) {
        console.error("Error cargando post:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, user?.id]); // Dependencia user.id por si cambia de usuario

  // 2. Manejar envío de comentario
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;
    if (!user) return alert("Inicia sesión para comentar");

    setSubmitting(true);
    try {
      await commentService.createComment({
        content: newComment,
        postId: id,
      });
      
      // Recargar comentarios para ver el nuevo (y ver author populado)
      const commentsData = await commentService.getCommentsByPostId(id);
      setComments(commentsData);
      setNewComment('');
    } catch (error) {
      console.error("Error comentando:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Manejadores de Voto (Lógica idéntica a PostCard)
  const handleUp = async () => {
    if (!user) return alert("Inicia sesión para votar");
    const previousVote = userVote;
    const previousScore = score;

    try {
      const updatedPost = await postService.toggleUpvote(post!._id);
      setScore(updatedPost.voteScore);
      if (updatedPost.upvotedBy.includes(user.id)) setUserVote('up');
      else setUserVote(null);
    } catch (error) {
      console.error(error);
      setUserVote(previousVote);
      setScore(previousScore);
    }
  };

  const handleDown = async () => {
    if (!user) return alert("Inicia sesión para votar");
    try {
      const updatedPost = await postService.toggleDownvote(post!._id);
      setScore(updatedPost.voteScore);
      if (updatedPost.downvotedBy.includes(user.id)) setUserVote('down');
      else setUserVote(null);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="page-loading">Cargando...</div>;
  if (!post) return <div className="page-error">No se encontró la publicación.</div>;

  return (
    <main className="post-detail-container">
      
      {/* --- LA TARJETA DEL POST --- */}
      <article className="post-detail-card">
        {/* Barra lateral de votos */}
        <div className="post-votes-sidebar">
           <button 
             className={`vote-btn up ${userVote === 'up' ? 'active' : ''}`} 
             onClick={handleUp}
             style={{background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem'}}
           >▲</button>
           
           <strong style={{ margin: '8px 0', fontSize: '1.1rem' }}>{score}</strong>
           
           <button 
             className={`vote-btn down ${userVote === 'down' ? 'active' : ''}`} 
             onClick={handleDown}
             style={{background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem'}}
           >▼</button>
        </div>

        <div className="post-content-wrapper">
          {/* Header: Subforo y Autor */}
          <div className="post-header-info">
            {/* Icono Subforo */}
            <img 
              src={post.subforumId.icon || '/icons/default.png'} 
              alt="" 
              className="subforum-icon-small" 
            />
            <Link to={`/subforum/${post.subforumId._id}`} className="subforum-link">
              r/{post.subforumId.name}
            </Link>
            
            <span>•</span>
            
            <span style={{color: 'var(--muted-text)'}}>publicado por</span>
            <Link to={`/profile/${post.authorId.username}`} className="author-link">
              @{post.authorId.username}
            </Link>
            
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>

          {/* Título */}
          <h1 className="post-detail-title">{post.title}</h1>
          
          {/* Contenido */}
          <div className="post-detail-body">
             {post.content}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', gap: 10, color: 'var(--muted-text)', fontSize: 14, marginTop: 20 }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
               <MdChatBubbleOutline size={22}/> 
               {comments.length} comentarios
             </span>
          </div>
        </div>
      </article>

      {/* --- SECCIÓN DE COMENTARIOS --- */}
      <section className="comments-section">
        {user ? (
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea 
              className="comment-textarea" 
              placeholder="¿Qué opinas?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Enviando...' : 'Comentar'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ marginBottom: 20, padding: 15, background: 'rgba(0,0,0,0.05)', borderRadius: 8, textAlign: 'center' }}>
            <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none' }}>Inicia sesión</Link> para dejar un comentario.
          </div>
        )}

        {/* Lista de Comentarios */}
        <div className="comments-list">
           {comments.map(comment => (
             <div key={comment._id} className="comment-item">
                <div className="comment-header">
                  <Link to={`/profile/${comment.authorId.username}`}>
                    <img 
                        src={comment.authorId.avatarUrl || '/icons/surprisedrudo.png'} 
                        alt="" 
                        style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  </Link>
                  
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <Link to={`/profile/${comment.authorId.username}`} className="comment-author">
                            {comment.authorId.username}
                        </Link>
                        <span style={{ color: 'var(--muted-text)', fontSize: '0.8rem' }}>
                            • {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                  </div>
                </div>

                <div className="comment-body">
                  {comment.content}
                </div>
             </div>
           ))}
           
           {comments.length === 0 && (
             <p style={{ textAlign: 'center', color: 'var(--muted-text)', padding: 20 }}>
               No hay comentarios aún. ¡Sé el primero!
             </p>
           )}
        </div>

      </section>

    </main>
  );
}