import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { subforumService } from '../services/subforumService';
import { postService } from '../services/postService'; // Necesitas este para los posts
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import type { Subforum } from '../types/subforum.types';
import type { Post } from '../types/post.types';
import SubforumPostCard from '../components/SubforumPostCard'; // Asegúrate que este componente acepte el tipo 'Post' real

export default function SubforumPage() {
  const { id } = useParams(); // Este 'id' ahora es el _id de Mongo (ej: 654...)
  
  const [subforum, setSubforum] = useState<Subforum | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [processingJoin, setProcessingJoin] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Cargar la info del Subforo
        const subData = await subforumService.getSubforumById(id);
        setSubforum(subData);

        // 2. Cargar los posts de ese subforo (Usando el endpoint nuevo que creamos)
        const postsData = await postService.getPostsBySubforum(id);
        setPosts(postsData);

        // Determinar si el usuario actual es miembro.
        // Preferimos pedir el perfil real al backend si hay token, para evitar desincronías.
        const token = authService.getToken();
        if (token) {
          try {
            const profile = await profileService.getMyProfile();
            // Guardamos la versión actualizada en localStorage para que Sidebar y demás la usen
            localStorage.setItem('user', JSON.stringify(profile));
            const found = Array.isArray(profile.joinedSubforums) && profile.joinedSubforums.some((s: any) => s._id === id || s.id === id);
            setIsMember(!!found);
          } catch (err) {
            // Si falla la petición del perfil, fallback a lo que haya en localStorage
            const currentUser = authService.getUser();
            if (currentUser && currentUser.joinedSubforums) {
              const found = (currentUser.joinedSubforums as any[]).some((s) => s._id === id || s.id === id);
              setIsMember(!!found);
            } else {
              setIsMember(false);
            }
          }
        } else {
          const currentUser = authService.getUser();
          if (currentUser && currentUser.joinedSubforums) {
            const found = (currentUser.joinedSubforums as any[]).some((s) => s._id === id || s.id === id);
            setIsMember(!!found);
          } else {
            setIsMember(false);
          }
        }

      } catch (err) {
        console.error("Error cargando subforo:", err);
        // Aquí podrías redirigir a 404 si quieres
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Escuchamos eventos globales de post actualizado para mantener el listado sincronizado
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        if (!detail) return;

        const updatedId = (detail._id || detail.id || detail._id?.toString());
        if (!updatedId) return;

        setPosts((prev) => {
          return prev.map((p) => {
            if (p._id === updatedId || (p._id as any)?.toString() === updatedId) {
              return {
                ...p,
                voteScore: typeof detail.voteScore === 'number' ? detail.voteScore : p.voteScore,
                upvotedBy: detail.upvotedBy || p.upvotedBy,
                downvotedBy: detail.downvotedBy || p.downvotedBy,
              } as Post;
            }
            return p;
          });
        });
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('post-updated', handler as EventListener);
    return () => window.removeEventListener('post-updated', handler as EventListener);
  }, []);

  // Escuchamos post-deleted para remover posts de esta lista cuando se borran
  useEffect(() => {
    const delHandler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        if (!detail) return;
        const removedId = detail.id || detail._id;
        if (!removedId) return;

        setPosts((prev) => prev.filter(p => {
          const pid = (p._id || (p as any).id);
          return !(pid === removedId || String(pid) === String(removedId));
        }));
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('post-deleted', delHandler as EventListener);
    return () => window.removeEventListener('post-deleted', delHandler as EventListener);
  }, []);

  // Handler para Unirse / Salir del subforo
  const toggleJoin = async () => {
    const user = authService.getUser();
    if (!user) return alert('Inicia sesión para unirte a comunidades');

    if (!id) return;

    setProcessingJoin(true);
    try {
      if (isMember) {
        await subforumService.leaveSubforum(id);
        setIsMember(false);
        setSubforum((s) => s ? { ...s, memberCount: (s.memberCount || 1) - 1 } : s);
      } else {
        await subforumService.joinSubforum(id);
        setIsMember(true);
        setSubforum((s) => s ? { ...s, memberCount: (s.memberCount || 0) + 1 } : s);
      }

      // Actualizamos el perfil local llamando al endpoint de perfil y guardándolo en localStorage
      try {
        const updatedProfile = await profileService.getMyProfile();
        localStorage.setItem('user', JSON.stringify(updatedProfile));
        // Avisamos a la app que el auth/user cambió para que Sidebar y otros reaccionen
        window.dispatchEvent(new Event('auth-changed'));
      } catch (err) {
        // Si falló obtener perfil, aún así actualizamos localStorage mínimamente
        const current = authService.getUser();
        if (current) {
          // añadimos o removemos el subforum en la copia local
          const joined = Array.isArray(current.joinedSubforums) ? [...current.joinedSubforums] : [];
          if (isMember) {
            // ya seteado a false arriba -> removemos
            const idx = joined.findIndex((s: any) => s._id === id || s.id === id);
            if (idx >= 0) joined.splice(idx, 1);
          } else {
            joined.push({ _id: id, name: subforum?.name || 'unknown', displayName: subforum?.displayName || '' });
          }
          const merged = { ...current, joinedSubforums: joined };
          localStorage.setItem('user', JSON.stringify(merged));
          window.dispatchEvent(new Event('auth-changed'));
        }
      }

    } catch (err) {
      console.error('Error (unirse/salir) subforo:', err);
      alert('No se pudo completar la acción. Intenta de nuevo.');
    } finally {
      setProcessingJoin(false);
    }
  };

  // Handler para crear nueva publicación dentro del subforo
  const handleCreatePost = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const token = authService.getToken();
    if (!token) return alert('Inicia sesión para crear publicaciones');
    if (!id) return;
    if (!newTitle.trim() || !newContent.trim()) return alert('Título y contenido son requeridos');

    setCreatingPost(true);
    try {
      const created = await postService.createPost({ title: newTitle.trim(), content: newContent.trim(), subforumId: id });
      console.log('Post creado (server response):', created);
      // Refrescar posts para obtener la versión populada
      const postsData = await postService.getPostsBySubforum(id);
      setPosts(postsData);

      // Emitimos evento para sincronizar otras páginas (feed, etc.) con el post nuevo
      try {
        const detail = { ...(created as any), id: (created as any)._id || (created as any).id };
        window.dispatchEvent(new CustomEvent('post-updated', { detail }));
      } catch (err) {
        // ignore
      }

      setNewTitle('');
      setNewContent('');
      alert('Publicación creada correctamente.');
    } catch (err) {
      console.error('Error creando post:', err);
      // Mostrar error del servidor si existe
      // @ts-ignore
      const serverMessage = err?.response?.data?.message || err?.message || 'No se pudo crear la publicación. Intenta de nuevo.';
      alert(serverMessage);
    } finally {
      setCreatingPost(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Cargando...</div>;
  if (!subforum) return <div style={{ padding: 20 }}>Subforo no encontrado</div>;

  return (
    <main style={{ padding: 20, maxWidth: 980, margin: '0 auto' }}>
      
      {/* HEADER DEL SUBFORO */}
      <header style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18, justifyContent: 'space-between' }}>
        {/* Banner (Opcional, si quieres mostrarlo arriba) */}
        {/* {subforum.banner && <img src={subforum.banner} ... />} */}

        <img 
          src={subforum.icon || '/icons/default.png'} 
          alt={subforum.displayName} 
          style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover' }} 
        />
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flex: 1 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0 }}>{subforum.displayName}</h1>
            <p style={{ margin: '6px 0', color: 'var(--muted-text)' }}>
              r/{subforum.name} • {subforum.memberCount} miembros
            </p>
            <p>{subforum.description}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <button
              onClick={toggleJoin}
              disabled={processingJoin}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                cursor: processingJoin ? 'not-allowed' : 'pointer',
                background: isMember ? 'var(--muted-text)' : 'var(--accent)',
                color: 'white',
                boxShadow: '0 6px 14px rgba(0,0,0,0.08)'
              }}
            >
              {processingJoin ? (isMember ? 'Saliendo...' : 'Uniéndote...') : (isMember ? 'Salir del subforo' : 'Unirse al subforo')}
            </button>

            <button
              onClick={() => {
                const user = authService.getUser();
                if (!user) return alert('Inicia sesión para crear publicaciones');
                setShowCreate(true);
              }}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.08)',
                background: 'linear-gradient(180deg,var(--accent),#0066cc)',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
              }}
            >
              Publicar
            </button>
          </div>
        </div>
      </header>

      {/* LISTA DE POSTS */}
      {/* FORMULARIO PARA CREAR POST (mostrado tras pulsar Publicar en header) */}
      {showCreate && (
        <section style={{ marginBottom: 18 }}>
          <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              placeholder="Título (máx 300)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              maxLength={300}
              style={{ padding: 8, borderRadius: 6, border: '1px solid var(--card-border)' }}
            />
            <textarea
              placeholder="Escribe tu publicación..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={4}
              style={{ padding: 8, borderRadius: 6, border: '1px solid var(--card-border)', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="submit"
                disabled={creatingPost}
                style={{ padding: '8px 12px', borderRadius: 6, border: 'none', background: 'var(--accent)', color: 'white', cursor: creatingPost ? 'not-allowed' : 'pointer' }}
              >
                {creatingPost ? 'Creando...' : 'Crear publicación'}
              </button>
              <button type="button" onClick={() => { setNewTitle(''); setNewContent(''); setShowCreate(false); }} style={{ padding: '8px 12px', borderRadius: 6 }}>
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}
      <section style={{ display: 'grid', gap: 12 }}>
        {posts.length === 0 ? (
          <p>Aún no hay publicaciones en esta comunidad. ¡Sé el primero!</p>
        ) : (
          posts.map((p) => (
            <SubforumPostCard key={p._id} post={p} />
          ))
        )}
      </section>
    </main>
  );
}