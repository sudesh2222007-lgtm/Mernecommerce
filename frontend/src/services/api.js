const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const cleanUrl = envUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE = getApiBase();

export const getAuthHeaders = () => {
  const token = localStorage.getItem('aura_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchProducts = async (keyword = '', category = 'All') => {
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (category && category !== 'All') params.append('category', category);

  try {
    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('fetchProducts error:', err);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE}/products/categories/list`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : ['All'];
  } catch (err) {
    console.error('fetchCategories error:', err);
    return ['All'];
  }
};

export const loginApi = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const registerApi = async (name, email, password) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
};

export const createOrderApi = async (orderData) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Order creation failed');
  return data;
};

export const fetchMyOrders = async () => {
  const res = await fetch(`${API_BASE}/orders/myorders`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch user orders');
  return data;
};

export const createProductApi = async (productData) => {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create product');
  return data;
};

export const deleteProductApi = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete product');
  return data;
};

export const fetchAllOrdersAdmin = async () => {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch all orders');
  return data;
};

export const updateOrderStatusApi = async (id, status) => {
  const res = await fetch(`${API_BASE}/orders/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update order status');
  return data;
};
