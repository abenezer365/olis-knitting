// Parses ?page & ?limit from a request query into safe integers.
// `enabled` is true only when the caller explicitly asked for pagination, so
// existing endpoints keep returning full lists until callers opt in.
export function getPagination(query, { defaultLimit = 20, maxLimit = 100 } = {}) {
  const enabled = query.page !== undefined || query.limit !== undefined;
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  const offset = (page - 1) * limit;
  return { enabled, page, limit, offset };
}

export function buildMeta({ page, limit }, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
