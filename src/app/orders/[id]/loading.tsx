export default function OrderDetailLoading() {
  return (
    <div className="pt-24 lg:pt-28 pb-20 min-h-screen px-4 sm:px-6 lg:px-10">
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-muted" />
        <div className="mt-6 h-40 rounded-2xl bg-muted" />
        <div className="mt-4 h-64 rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
