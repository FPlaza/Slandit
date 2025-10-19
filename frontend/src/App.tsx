import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Subforum from './pages/Subforum';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Sidebar />
      <div style={{ paddingTop: '64px', width: '100vw', margin: 0 }}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/subforum/:id" element={<Subforum />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
