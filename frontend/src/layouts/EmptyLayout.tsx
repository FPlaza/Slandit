import { Outlet } from 'react-router-dom';

export default function EmptyLayout() {
    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                margin: 0,
                padding: 0,
                backgroundColor: '#332F3B',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Outlet />
        </div>
    );
}
