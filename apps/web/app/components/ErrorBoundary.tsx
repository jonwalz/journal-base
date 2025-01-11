interface ErrorBoundaryProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export function ErrorBoundary({ error, resetErrorBoundary }: ErrorBoundaryProps) {
  const handleReset = () => {
    resetErrorBoundary?.() || window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">
          {error?.message || 'Something went wrong'}
        </h1>
        {process.env.NODE_ENV === 'development' && error && (
          <pre className="mt-2 text-sm text-gray-600">
            {error.stack}
          </pre>
        )}
        <button 
          onClick={handleReset}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
