export default function LoadingSpinner({ item }: { item: string }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center font-sans">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium">Loading local {item} catalog...</p>
      </div>
    </div>
  );
}