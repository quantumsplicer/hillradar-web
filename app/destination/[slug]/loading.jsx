export default function DestinationLoading() {
  return (
    <div className="min-h-screen" style={{ background: '#F0F6FF' }}>
      {/* Header skeleton */}
      <header className="bg-white border-b border-[#E2EAF4] shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="skeleton h-4 w-12 rounded" />
          <div className="flex items-center gap-2">
            <div className="skeleton h-6 w-6 rounded" />
            <div className="skeleton h-5 w-24 rounded" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-5">
        {/* Hero score skeleton */}
        <div className="bg-white rounded-2xl border border-[#E2EAF4] shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex-1 space-y-3">
              <div className="skeleton h-3 w-24 rounded" />
              <div className="skeleton h-10 w-56 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-4/5 rounded" />
            </div>
            <div className="skeleton h-32 w-32 rounded-2xl shrink-0" />
          </div>
        </div>

        {/* Travel times skeleton */}
        <div className="bg-white rounded-2xl border border-[#E2EAF4] shadow-sm p-6">
          <div className="skeleton h-3 w-36 rounded mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F0F6FF] rounded-xl p-4 space-y-2">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-8 w-24 rounded" />
              <div className="skeleton h-3 w-28 rounded" />
            </div>
            <div className="bg-[#F0F6FF] rounded-xl p-4 space-y-2">
              <div className="skeleton h-3 w-16 rounded" />
              <div className="skeleton h-8 w-20 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          </div>
        </div>

        {/* Chart skeleton */}
        <div className="bg-white rounded-2xl border border-[#E2EAF4] shadow-sm p-6">
          <div className="skeleton h-3 w-44 rounded mb-2" />
          <div className="skeleton h-2 w-32 rounded mb-4" />
          <div className="skeleton h-40 w-full rounded-xl" />
        </div>

        {/* Hotel links skeleton */}
        <div className="bg-white rounded-2xl border border-[#E2EAF4] shadow-sm p-6">
          <div className="skeleton h-3 w-28 rounded mb-2" />
          <div className="skeleton h-3 w-52 rounded mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
