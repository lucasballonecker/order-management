import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../services/productService';
import { OrderService } from '../services/orderService';
import type { PaginationParams } from '../types/pagination';
import type { ProductResponse } from '../types/product';
import type { OrderItemRequest } from '../types/order';
import { getErrorMessage } from '../utils/errorHandler';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { SuccessMessage } from '../components/ui/SuccessMessage';
import { ProductCard } from '../components/Products/ProductCard';
import { ShoppingCart } from '../components/Products/ShoppingCart';
import { PaginationControls } from '../components/Products/PaginationControls';

export const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);

  const [params, setParams] = useState<PaginationParams>({
    page: 0,
    size: 10,
    sort: 'name,asc'
  });

  
  const [cart, setCart] = useState<Record<number, number>>({});
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await ProductService.getProducts(params);
        setProducts(response.content);
        setTotalPages(response.totalPages);
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Erro ao carregar produtos'));
        console.error('ProductService.getProducts error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params]);

  useEffect(() => {
    if (orderSuccess) {
      const timer = setTimeout(() => setOrderSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [orderSuccess]);

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  const addToCart = (productId: number) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        return Object.fromEntries(
          Object.entries(prev).filter(([id]) => Number(id) !== productId)
        );
      }
      return { ...prev, [productId]: current - 1 };
    });
  };

  const createOrder = async () => {
    if (Object.keys(cart).length === 0) return;
    setOrderError('');
    setOrderSuccess(false);
    try {
      const items: OrderItemRequest[] = Object.entries(cart).map(
        ([id, qty]) => ({ productId: Number(id), quantity: qty })
      );
      await OrderService.createOrder({ items });
      setOrderSuccess(true);
      setCart({});
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Erro ao criar pedido');
      setOrderError(message);
      console.error('OrderService.createOrder error:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Produtos</h1>
        <button
          onClick={() => navigate('/orders')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Meus Pedidos
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {orderSuccess && (
        <SuccessMessage 
          message="Pedido criado com sucesso!" 
          onDismiss={() => setOrderSuccess(false)}
          autoDismissMs={5000}
        />
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col gap-10">
          <ShoppingCart
            cart={cart}
            products={products}
            orderError={orderError}
            onCreateOrder={createOrder}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={cart[product.id] || 0}
                onAdd={addToCart}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <PaginationControls
            page={params.page}
            totalPages={totalPages}
            loading={loading}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};