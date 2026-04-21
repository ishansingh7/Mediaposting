const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { 'x-admin-token': token } : {}),
});

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:4000' : '');

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed.' }));
    throw new Error(error.message || 'Request failed.');
  }

  if (response.status === 204) return null;
  return response.json();
};

export const api = {
  login: (payload) =>
    request('/api/auth/login', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    }),
  bootstrap: (token) =>
    request('/api/bootstrap', {
      headers: headers(token),
    }),
  openPost: (id, token) =>
    request(`/api/posts/${id}`, {
      headers: headers(token),
    }),
  createPost: (token, payload) =>
    request('/api/posts', {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(payload),
    }),
  updatePost: (token, id, payload) =>
    request(`/api/posts/${id}`, {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify(payload),
    }),
  deletePost: (token, id) =>
    request(`/api/posts/${id}`, {
      method: 'DELETE',
      headers: headers(token),
    }),
  updateVisibility: (token, id, hidden) =>
    request(`/api/posts/${id}/visibility`, {
      method: 'PATCH',
      headers: headers(token),
      body: JSON.stringify({ hidden }),
    }),
  likePost: (id, liked) =>
    request(`/api/posts/${id}/like`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ liked }),
    }),
  commentPost: (id, payload) =>
    request(`/api/posts/${id}/comments`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    }),
  updateProfile: (token, payload) =>
    request('/api/profile', {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify(payload),
    }),
};
