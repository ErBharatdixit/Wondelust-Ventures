function ListingCardSkeleton() {
      return (
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                  {/* Image skeleton */}
                  <div className="aspect-square bg-gray-200"></div>

                  {/* Content skeleton */}
                  <div className="p-4 space-y-3">
                        {/* Title */}
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>

                        {/* Location */}
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>

                        {/* Price and rating */}
                        <div className="flex justify-between items-center">
                              <div className="h-5 bg-gray-200 rounded w-24"></div>
                              <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                  </div>
            </div>
      );
}

export default ListingCardSkeleton;
