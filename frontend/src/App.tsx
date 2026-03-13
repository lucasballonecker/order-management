import { AppRoutes } from './routes';
import { AuthProvider } from './contexts/AuthContextProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;