export function SkeletonLoader() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
        <div className="h-4 w-96 bg-gray-200 rounded-lg"></div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-gray-100"
          >
            <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  );
}
