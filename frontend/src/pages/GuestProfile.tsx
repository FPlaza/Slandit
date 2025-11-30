import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { profileService } from '../services/profileService';
import { postService } from '../services/postService';
import PostCard from '../components/PostCard';
import '../styles/Profile.css';
import type { Profile } from '../types/profile.types';
import type { Post } from '../types/post.types';

export default function GuestProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                if (!username) return;

                const p = await profileService.getProfileByUsername(username);
                setProfile(p);

                const userPosts = await postService.getPostsByUser(p._id);
                setPosts(userPosts);

            } catch (err) {
                console.error("Error cargando perfil invitado:", err);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [username]);

    if (loading) return <div className="loading">Cargando perfil...</div>;

    if (!profile) return <div className="error">No se encontró este perfil.</div>;

    return (
        <main className="profile-main">
            <div className="profile-wrapper">

                <section className="profile-card">
                    <div className="avatar-container">
                        <img
                            src={profile.avatarUrl || '/icons/surprisedrudo.png'}
                            alt={profile.username}
                            className="profile-avatar"
                        />
                    </div>

                    <div className="profile-details-wrapper">
                        <div className="profile-info">
                            <h2 className="profile-username">@{profile.username}</h2>

                            <div className="bio-container">
                                <p className="profile-bio">{profile.bio || 'Sin descripción.'}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="posts-title">Publicaciones recientes</h3>

                    {posts.length === 0 ? (
                        <div className="posts-empty">No hay publicaciones públicas.</div>
                    ) : (
                        <div className="posts-list">
                            {posts.map((p) => (
                                <PostCard key={p._id} post={p} />
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}