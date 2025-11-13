import '../styles/CreatePost.css';

function CreatePost() {
    return (
        <div className="create-post-page">
            <div className="create-post-card">
                <form>
                    <div className="input-group">
                        <label htmlFor="title">Título:</label>
                        <input type="text" id="title" placeholder="Título de la publicación" required />
                    </div>

                    <div className="button-row">
                        <button type="button" className="cp-button cp-button-text">Texto</button>
                        <button type="button" className="cp-button cp-button-image">Imagen</button>
                    </div>

                    <div className="input-group">
                        <textarea id="content" placeholder="Contenido de la publicación" required></textarea>
                    </div>

                    <button type="submit" className="cp-button-submit">Publicar</button>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;
