const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message || 'An error occurred');
  }

  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<{ user: import('./types').User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role: string;
  }) =>
    request<{ user: import('./types').User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: (token: string) =>
    request<import('./types').User>('/auth/me', {}, token),

  getCases: (token: string) =>
    request<import('./types').Case[]>('/cases', {}, token),

  getCase: (id: string, token: string) =>
    request<import('./types').Case>(`/cases/${id}`, {}, token),

  createCase: (data: object, token: string) =>
    request<import('./types').Case>('/cases', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  submitCase: (id: string, token: string) =>
    request(`/cases/${id}/submit`, { method: 'POST' }, token),

  sendToBank: (id: string, token: string) =>
    request(`/cases/${id}/send-to-bank`, { method: 'POST' }, token),

  assignSeller: (id: string, sellerId: string, token: string) =>
    request(`/cases/${id}/assign-seller`, {
      method: 'POST',
      body: JSON.stringify({ sellerId }),
    }, token),

  requestAppraisal: (id: string, token: string) =>
    request(`/cases/${id}/request-appraisal`, { method: 'POST' }, token),

  completeDeal: (id: string, token: string) =>
    request(`/cases/${id}/complete-deal`, { method: 'POST' }, token),

  cancelCase: (id: string, token: string) =>
    request(`/cases/${id}/cancel`, { method: 'POST' }, token),

  getBankPending: (token: string) =>
    request<import('./types').Case[]>('/bank/pending', {}, token),

  reviewCredit: (caseId: string, data: object, token: string) =>
    request(`/bank/cases/${caseId}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  getAppraisalPending: (token: string) =>
    request<Array<{
      id: string;
      status: string;
      case: {
        id: string;
        caseNumber: string;
        propertyAddress: string;
        propertyType: string;
        askingPrice?: number;
        buyer: { fullName: string };
      };
    }>>('/appraisal/pending', {}, token),

  acceptAppraisal: (caseId: string, token: string) =>
    request(`/appraisal/cases/${caseId}/accept`, { method: 'POST' }, token),

  submitAppraisal: (caseId: string, data: object, token: string) =>
    request(`/appraisal/cases/${caseId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  getNotifications: (token: string) =>
    request<import('./types').Notification[]>('/notifications', {}, token),

  getUnreadCount: (token: string) =>
    request<number>('/notifications/unread-count', {}, token),

  markAllRead: (token: string) =>
    request('/notifications/read-all', { method: 'PATCH' }, token),

  getDashboardStats: (token: string) =>
    request<import('./types').DashboardStats>('/dashboard/stats', {}, token),

  getUsers: (token: string, role?: string) =>
    request<import('./types').User[]>(`/users${role ? `?role=${role}` : ''}`, {}, token),

  getSellers: (token: string) =>
    request<import('./types').User[]>('/users/sellers', {}, token),
};
