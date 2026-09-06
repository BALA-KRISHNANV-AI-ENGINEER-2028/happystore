export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function paginate(params: PaginationParams): { skip: number; take: number } {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  return { skip: (page - 1) * limit, take: limit };
}

export function buildPaginatedResult<T>(
  data: T[],
  total: number,
  params: PaginationParams,
): PaginatedResult<T> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export function buildOrderBy(
  sortBy?: string,
  sortOrder: 'asc' | 'desc' = 'desc',
): Record<string, 'asc' | 'desc'> | undefined {
  if (!sortBy) return undefined;
  return { [sortBy]: sortOrder };
}

/**
 * Haversine distance calculation (in km)
 * Useful for simple in-app distance display.
 * For real geospatial filtering, use PostGIS ST_DWithin.
 */
export function haversineDistanceKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
