const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

const parseJson = async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return data;
};

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
});

export const registerUser = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return parseJson(response);
};

export const loginUser = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return parseJson(response);
};

export const getProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    return parseJson(response);
};

export const getProductById = async (productId) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    return parseJson(response);
};

export const createOrder = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return parseJson(response);
};

export const createProductAdmin = async (payload, token) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload),
    });

    return parseJson(response);
};

export const updateProductAdmin = async (productId, payload, token) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload),
    });

    return parseJson(response);
};

export const deleteProductAdmin = async (productId, token) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return parseJson(response);
};
