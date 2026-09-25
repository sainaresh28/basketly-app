export default function NewArrivalsLoading() {
  return (
    <div className="pt-[7.5rem] min-h-screen">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10 py-8 animate-pulse">
        <div className="h-8 w-56 rounded-lg bg-muted" />
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] rounded-2xl bg-muted" />
              <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
              <div className="mt-2 h-4 w-1/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
