import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <>
            <Header />
            <Sidebar />
            <div style={{ paddingTop: '64px', width: '100vw', margin: 0 }}>
                <Outlet /> {/* Aquí se renderizan las páginas hijas */}
            </div>
        </>
    );
}
