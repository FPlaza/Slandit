import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import EmptyLayout from './layouts/EmptyLayout';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Subforum from './pages/Subforum';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import GuestProfile from './pages/GuestProfile';
import Post from './pages/Post';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Feed />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/guest-profile/:username" element={<GuestProfile />} />
          <Route path="/subforum/:id" element={<Subforum />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/posts/:id" element={<Post />} />
        </Route>

        <Route element={<EmptyLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
