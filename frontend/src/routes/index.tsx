import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';


const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const Products = () => <div>Products Page</div>;
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
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
