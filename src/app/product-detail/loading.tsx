export default function ProductDetailLoading() {
  return (
    <div className="pt-[7.5rem] min-h-screen pb-20">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10 py-8 animate-pulse">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square rounded-3xl bg-muted" />
          <div className="space-y-4">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-6 w-32 rounded bg-muted" />
            <div className="h-24 w-full rounded bg-muted" />
            <div className="h-12 w-full rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
