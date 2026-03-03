import { AppRoutes } from './routes';
import { AuthProvider } from './contexts/AuthContextProvider';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;