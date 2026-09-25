export default function RootLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 border-b border-border" />
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10 py-10 animate-pulse">
        <div className="h-64 sm:h-80 rounded-3xl bg-muted" />
        <div className="mt-10 h-6 w-40 rounded-lg bg-muted" />
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
