import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { authService } from '../services/authService';
import type { Post as PostType } from '../types/post.types';
import type { Comment } from '../types/comment.types';
import CommentItem from '../components/CommentItem';
import '../styles/Post.css';
import { MdChatBubbleOutline } from 'react-icons/md';

type VoteStatus = 'up' | 'down' | null;

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [score, setScore] = useState<number>(0);
  const [userVote, setUserVote] = useState<VoteStatus>(null);
  
  const user = authService.getUser();

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const postData = await postService.getPostById(id);
        setPost(postData);
        
        setScore(postData.voteScore);
        if (user) {
            if (postData.upvotedBy.includes(user.id)) setUserVote('up');
            else if (postData.downvotedBy.includes(user.id)) setUserVote('down');
            else setUserVote(null);
        }

        const commentsData = await commentService.getCommentsByPostId(id);
        setComments(commentsData);
      } catch (error) {
        console.error("Error cargando post:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, user?.id]);


  // aca va la logica del arbol de comentarios
  const buildCommentTree = (flatComments: Comment[]) => {
    const commentMap: { [key: string]: Comment } = {};
    const roots: Comment[] = [];

    flatComments.forEach(c => {
      commentMap[c._id] = { ...c, children: [] };
    });

    flatComments.forEach(c => {
      if (c.parentId && commentMap[c.parentId]) {
        commentMap[c.parentId].children!.push(commentMap[c._id]);
      } else {
        roots.push(commentMap[c._id]);
      }
    });

    return roots.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const commentTree = buildCommentTree(comments);

  const handleReplySubmit = async (content: string, parentId?: string) => {
    if (!content.trim() || !id) return;
    if (!user) return alert("Inicia sesión para comentar");

    if (!parentId) setSubmitting(true);

    try {
      await commentService.createComment({
        content: content,
        postId: id,
        parentId: parentId,
      });
      
      const commentsData = await commentService.getCommentsByPostId(id);
      setComments(commentsData);
      
      if (!parentId) setNewComment('');
      
    } catch (error) {
      console.error("Error comentando:", error);
    } finally {
      if (!parentId) setSubmitting(false);
    }
  };


  // aca manejamos los votos
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

  const isAuthor = user?.username === post.authorId.username;
  const authorProfileLink = isAuthor 
    ? `/profile/${post.authorId.username}` 
    : `/guest-profile/${post.authorId.username}`;

  return (
    <main className="post-detail-container">
      
      {/* tarjetita del post */}
      <article className="post-detail-card">
        {/* sidebar de votos */}
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
          {/* aca va el header */}
          <div className="post-header-info">
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
            <Link to={authorProfileLink} className="author-link">
              @{post.authorId.username}
            </Link>
            
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>

          {/* titulo */}
          <h1 className="post-detail-title">{post.title}</h1>
          
          {/* contenido */}
          <div className="post-detail-body">
             {post.content}
          </div>

          {/* footer */}
          <div style={{ display: 'flex', gap: 10, color: 'var(--muted-text)', fontSize: 14, marginTop: 20 }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
               <MdChatBubbleOutline size={22}/> 
               {comments.length} comentarios
             </span>
          </div>
        </div>
      </article>

      {/* seccion d comentarios */}
      <section className="comments-section">
        
        {/* aqui es donde se comenta */}
        {user ? (
          <form className="comment-form" onSubmit={(e) => { e.preventDefault(); handleReplySubmit(newComment); }}>
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

        {/* comentarios de forma recursiva */}
        <div className="comments-list">
           {commentTree.map(rootComment => (
             <CommentItem 
               key={rootComment._id} 
               comment={rootComment} 
               depth={0}
               onReplySubmit={handleReplySubmit}
             />
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