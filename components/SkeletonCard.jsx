export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2EAF4] overflow-hidden shadow-sm">
      <div className="h-1.5 skeleton w-full" />
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-3/4 rounded" />
            <div className="skeleton h-3.5 w-1/2 rounded" />
          </div>
          <div className="skeleton h-10 w-16 rounded-xl" />
        </div>
        <div className="skeleton h-3.5 w-full rounded" />
        <div className="skeleton h-3.5 w-5/6 rounded" />
        <div className="skeleton h-3 w-24 rounded mt-2" />
      </div>
    </div>
  );
}

export function SkeletonBestPick() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2EAF4] shadow-sm p-6">
      <div className="skeleton h-3 w-40 rounded mb-4" />
      <div className="flex gap-6">
        <div className="flex-1 space-y-3">
          <div className="skeleton h-8 w-48 rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/3 rounded mt-2" />
        </div>
        <div className="skeleton h-24 w-24 rounded-2xl" />
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-6 w-2/3 mx-auto rounded" />
      <div className="skeleton h-4 w-1/2 mx-auto rounded" />
      <div className="skeleton h-14 max-w-xl mx-auto rounded-xl" />
    </div>
  );
}
