import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { MainLayout } from '../layouts/MainLayout';


import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Products } from '../pages/Products';
const Orders = () => <div>Orders Page</div>;

const router = createBrowserRouter([
  
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  
  
  {
    path: '/',
    element: <MainLayout />,
    children: [
      
      {
        path: '/products',
        element: (
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders',
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      
      
      {
        path: '/',
        element: <Navigate to="/products" replace />,
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
