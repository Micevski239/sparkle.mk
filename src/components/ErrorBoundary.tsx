import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
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
                this.setState({ hasError: false });
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
