import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { subforumService } from '../services/subforumService';
import { postService } from '../services/postService'; // Necesitas este para los posts
import type { Subforum } from '../types/subforum.types';
import type { Post } from '../types/post.types';
import SubforumPostCard from '../components/SubforumPostCard'; // Asegúrate que este componente acepte el tipo 'Post' real

export default function SubforumPage() {
  const { id } = useParams(); // Este 'id' ahora es el _id de Mongo (ej: 654...)
  
  const [subforum, setSubforum] = useState<Subforum | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

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

      } catch (err) {
        console.error("Error cargando subforo:", err);
        // Aquí podrías redirigir a 404 si quieres
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Cargando...</div>;
  if (!subforum) return <div style={{ padding: 20 }}>Subforo no encontrado</div>;

  return (
    <main style={{ padding: 20, maxWidth: 980, margin: '0 auto' }}>
      
      {/* HEADER DEL SUBFORO */}
      <header style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
        {/* Banner (Opcional, si quieres mostrarlo arriba) */}
        {/* {subforum.banner && <img src={subforum.banner} ... />} */}

        <img 
          src={subforum.icon || '/icons/default.png'} 
          alt={subforum.displayName} 
          style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover' }} 
        />
        <div>
          <h1 style={{ margin: 0 }}>{subforum.displayName}</h1>
          <p style={{ margin: '6px 0', color: 'var(--muted-text)' }}>
            r/{subforum.name} • {subforum.memberCount} miembros
          </p>
          <p>{subforum.description}</p>
        </div>
      </header>

      {/* LISTA DE POSTS */}
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