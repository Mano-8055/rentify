import { memo, type HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton = memo(function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      {...props}
      aria-hidden="true"
    />
  );
});

Skeleton.displayName = 'Skeleton';

/* Product Card Skeleton */
export function ProductCardSkeleton() {
  return (
    <article className="card h-full flex flex-col animate-fade-in">
      <div className="skeleton-card" />
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <div className="skeleton-title" />
        <div className="skeleton-text" />
        <div className="skeleton-text w-3/4" />
        <div className="grid grid-cols-2 gap-2">
          <div className="skeleton h-12 rounded-xl" />
          <div className="skeleton h-12 rounded-xl" />
        </div>
        <div className="skeleton h-4 w-2/3 rounded-lg mt-auto" />
      </div>
    </article>
  );
}

/* Product Details Skeleton */
export function ProductDetailsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="skeleton aspect-video rounded-2xl" />
          <div className="flex gap-2">
            <div className="skeleton w-16 h-16 rounded-xl" />
            <div className="skeleton w-16 h-16 rounded-xl" />
            <div className="skeleton w-16 h-16 rounded-xl" />
          </div>
        </div>
        <div className="space-y-5">
          <div className="skeleton-title w-1/2" />
          <div className="skeleton-text" />
          <div className="skeleton-text w-5/6" />
          <div className="grid grid-cols-2 gap-3">
            <div className="skeleton h-20 rounded-xl" />
            <div className="skeleton h-20 rounded-xl" />
          </div>
          <div className="skeleton h-14 rounded-xl" />
          <div className="skeleton h-40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/* Dashboard Stats Skeleton */
export function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="skeleton-title w-48" />
          <div className="skeleton-text w-64 mt-1" />
        </div>
        <div className="skeleton w-28 h-10 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-24 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

/* Nearby Products Skeleton */
export function NearbyProductsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="skeleton-title w-48" />
        <div className="skeleton-text w-64 mt-1" />
      </div>
      <div className="skeleton h-12 rounded-xl mb-5 w-1/2" />
      <div className="flex flex-wrap gap-2 mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton h-8 px-3 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/* Profile Skeleton */
export function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="skeleton-title w-32 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-5">
          <div className="skeleton h-64 rounded-3xl" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" />
            ))}
          </div>
          <div className="skeleton h-32 rounded-2xl" />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="skeleton-title w-32 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-40 rounded-2xl" />
              ))}
            </div>
          </div>
          <div>
            <div className="skeleton-title w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Rent History Skeleton */
export function RentHistorySkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="skeleton-title w-48" />
        <div className="skeleton-text w-64 mt-1" />
      </div>
      <div className="flex gap-2 mb-6">
        <div className="skeleton h-10 px-4 rounded-xl" />
        <div className="skeleton h-10 px-4 rounded-xl" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

/* Add Product Skeleton */
export function AddProductSkeleton() {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="skeleton-title w-48 mb-2" />
      <div className="skeleton-text w-64 mb-8" />
      <div className="skeleton h-56 rounded-3xl" />
    </div>
  );
}

export default Skeleton;