export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />

          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/circle_logo.svg" className="h-10 w-10 animate-pulse" />
          </div>
        </div>
        <div className="text-xl uppercase font-medium">
          Loading
        </div>
      </div>
    </div>
  );
}

LoadingSpinner.displayName = "LoadingSpinner";
