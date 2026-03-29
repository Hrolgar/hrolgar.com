export default function Loading() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar skeleton */}
      <div className="fixed top-0 w-full z-50 bg-bg/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="h-6 w-24 bg-surface rounded animate-pulse" />
          <div className="hidden md:flex gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 w-14 bg-surface rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 w-full">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="h-12 md:h-16 w-3/4 bg-surface rounded animate-pulse mx-auto md:mx-0" />
            <div className="h-8 w-48 bg-surface rounded animate-pulse mx-auto md:mx-0" />
            <div className="h-5 w-full max-w-xl bg-surface rounded animate-pulse mx-auto md:mx-0" />
            <div className="flex gap-4 justify-center md:justify-start">
              <div className="h-12 w-36 bg-surface rounded animate-pulse" />
              <div className="h-12 w-32 bg-surface rounded animate-pulse" />
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-[320px] h-[380px] md:w-[350px] md:h-[420px] rounded bg-surface animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
