import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar.tsx';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container-centralizado py-8">
        <Outlet />
      </main>
    </div>
  );
};