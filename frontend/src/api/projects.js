const API_BASE = 'http://localhost:5000/api';

/**
 * Fetch global database projects for Public Showcase / Visit Projects search.
 * @param {object} params - { q, category, status }
 */
export async function listGlobalProjects(params = {}) {
  const query = new URLSearchParams();
  if (params.q) query.append('q', params.q);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.subCategory && params.subCategory !== 'All') query.append('subCategory', params.subCategory);
  if (params.status && params.status !== 'All') query.append('status', params.status);

  const res = await fetch(`${API_BASE}/projects?${query.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch global projects');
  return data;
}

/**
 * Fetch user's own associated projects array.
 * @param {string} token
 * @param {object} params - { q, category, subCategory, status }
 */
export async function getMyProjects(token, params = {}) {
  const query = new URLSearchParams();
  if (params.q) query.append('q', params.q);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.subCategory && params.subCategory !== 'All') query.append('subCategory', params.subCategory);
  if (params.status && params.status !== 'All') query.append('status', params.status);

  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/projects/mine?${query.toString()}`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch your projects');
  return data;
}

/**
 * Create a new project with optional zip file upload (multipart/form-data).
 * @param {FormData} formData
 * @param {string} token
 */
export async function createProjectApi(formData, token) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers,
    body: formData, // browser automatically sets Content-Type: multipart/form-data with boundary
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create project');
  return data;
}

/**
 * Delete a user project by ID.
 * @param {string} projectId
 * @param {string} token
 */
export async function deleteProjectApi(projectId, token) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: 'DELETE',
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete project');
  return data;
}
