export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Transport only. Authentication and token persistence belong to a later layer.
export async function getJson(path, { baseUrl = '', headers = {}, signal, fetcher = fetch } = {}) {
  const response = await fetcher(`${baseUrl.replace(/\/$/, '')}${path}`, {
    method: 'GET', headers: { Accept: 'application/json', ...headers },
    credentials: 'omit', cache: 'no-store', signal,
  });
  if (!response.ok) throw new ApiError('Unable to load account data.', response.status);
  try { return await response.json(); }
  catch { throw new ApiError('The server returned an invalid response.', response.status); }
}
