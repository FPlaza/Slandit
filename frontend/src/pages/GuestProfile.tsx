import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { profileService } from '../services/profileService';
import PostCard from '../components/PostCard';
import { mockPosts } from '../mocks/mockData';
import '../styles/Profile.css';
import type { Profile } from '../types/profile.types';

export default function GuestProfile() {
    const { username } = useParams(); // ← username del invitado
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                if (!username) return;

                const p = await profileService.getProfileByUsername(username);
                setProfile(p);
            } catch (err) {
                console.error("Error cargando perfil invitado:", err);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [username]);

    if (loading) return <div className="loading">Cargando perfil...</div>;

    if (!profile) return <div className="error">No se encontró este perfil.</div>;

    // Filtrar posts mock por username
    const posts = mockPosts.filter(
        (p) => p.author.username.toLowerCase() === profile.username.toLowerCase()
    );

    return (
        <main className="profile-main">
            <div className="profile-wrapper">

                <section className="profile-card">
                    <div className="avatar-container">
                        <img
                            src={profile.avatarUrl || '/icons/default-avatar.png'}
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
                                <PostCard key={p.id} post={p} />
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}
