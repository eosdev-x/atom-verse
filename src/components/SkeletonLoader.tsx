interface SkeletonVerseCardProps {
  count?: number;
}

function SkeletonCard(): JSX.Element {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="flex justify-end mt-4 space-x-3">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonVerseCards({ count = 3 }: SkeletonVerseCardProps): JSX.Element {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
