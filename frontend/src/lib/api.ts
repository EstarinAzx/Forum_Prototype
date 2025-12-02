export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('accessToken');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            // Retry request with new token
            const newToken = localStorage.getItem('accessToken');
            const newHeaders = {
                ...headers,
                'Authorization': `Bearer ${newToken}`,
            };

            return fetch(`${API_URL}${url}`, {
                ...options,
                headers: newHeaders,
            });
        } else {
            // Refresh failed, logout
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
        }
    }

    return response;
}

async function refreshAccessToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
        const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
            const { accessToken } = await response.json();
            localStorage.setItem('accessToken', accessToken);
            return true;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
    }

    return false;
}
