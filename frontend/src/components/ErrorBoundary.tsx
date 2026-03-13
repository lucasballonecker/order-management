import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-10">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-4">
                <span className="text-5xl">⚠️</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Algo Deu Errado
            </h1>

            <p className="text-slate-600 text-lg mb-4 leading-relaxed">
              Desculpe, ocorreu um erro inesperado na aplicação.
            </p>

            {this.state.error && (
              <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded-lg mb-6 text-sm text-left">
                <p className="font-semibold mb-2">Detalhes do erro:</p>
                <p className="break-words">{this.state.error.message}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => window.location.href = '/products'}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium py-3 rounded-lg transition-colors"
              >
                Voltar para Produtos
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
