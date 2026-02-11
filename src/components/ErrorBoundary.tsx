import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message || String(error) };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-light text-gray-900 mb-4">
              Нешто тргна наопаку / Something went wrong
            </h1>
            <p className="text-gray-500 mb-8">
              Ве молиме обидете се повторно. / Please try again.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, errorMessage: '' });
                window.location.reload();
              }}
              className="inline-flex items-center px-6 py-3 border border-gray-900 text-gray-900 text-sm tracking-wider uppercase hover:bg-gray-900 hover:text-white transition-all"
            >
              Обиди се повторно / Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
