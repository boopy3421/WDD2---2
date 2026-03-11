---
name: frontend-dev
description: React + Vite + Tailwind + TypeScript patterns and templates. Load when working on frontend tasks with @frontend-dev.
---

# Frontend Dev Skill — React + Vite + Tailwind + TypeScript

## API Client Setup

```ts
// src/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v3',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true, // needed for Sanctum cookie auth
});

// Attach Sanctum token if using token-based auth
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);
```

---

## API Module Pattern

```ts
// src/api/users.ts
import { apiClient } from './client';

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { current_page: number; last_page: number; total: number; per_page: number };
}

export const usersApi = {
  list: (page = 1): Promise<PaginatedResponse<User>> =>
    apiClient.get(`/users?page=${page}`).then((r) => r.data),

  get: (id: number): Promise<User> =>
    apiClient.get(`/users/${id}`).then((r) => r.data.data),

  create: (payload: CreateUserPayload): Promise<User> =>
    apiClient.post('/users', payload).then((r) => r.data.data),

  update: (id: number, payload: Partial<CreateUserPayload>): Promise<User> =>
    apiClient.put(`/users/${id}`, payload).then((r) => r.data.data),

  destroy: (id: number): Promise<void> =>
    apiClient.delete(`/users/${id}`).then(() => undefined),
};
```

---

## React Query Hooks Pattern

```ts
// src/features/users/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';

export const userKeys = {
  all: ['users'] as const,
  list: (page: number) => ['users', 'list', page] as const,
  detail: (id: number) => ['users', 'detail', id] as const,
};

export const useUsers = (page = 1) =>
  useQuery({
    queryKey: userKeys.list(page),
    queryFn: () => usersApi.list(page),
  });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
};
```

---

## Component Template

```tsx
// src/features/users/components/UserCard/UserCard.tsx
import type { User } from '@/api/users';

interface UserCardProps {
  user: User;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const UserCard = ({ user, onEdit, onDelete }: UserCardProps) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <p className="font-semibold text-gray-900">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(user.id)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
```

---

## Form Pattern (with React Hook Form)

```tsx
import { useForm } from 'react-hook-form';
import type { CreateUserPayload } from '@/api/users';
import { useCreateUser } from '../hooks/useUsers';

export const CreateUserForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<CreateUserPayload>();
  const { mutateAsync } = useCreateUser();

  const handleCreate = async (data: CreateUserPayload) => {
    await mutateAsync(data);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};
```

---

## Routing Setup

```tsx
// src/router.tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Spinner } from '@/components/Spinner';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
const Login = lazy(() => import('./pages/Login'));

const ProtectedLayout = () => {
  // check auth here, redirect to /login if not authed
  return (
    <Suspense fallback={<Spinner />}>
      <Outlet />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    element: <ProtectedLayout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/users', element: <Users /> },
    ],
  },
]);
```

---

## Common Tailwind Patterns

```
Page wrapper:   min-h-screen bg-gray-50 p-6
Card:           rounded-xl border border-gray-200 bg-white p-6 shadow-sm
Section title:  text-xl font-semibold text-gray-900
Muted text:     text-sm text-gray-500
Input:          w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
Primary button: rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50
Ghost button:   rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50
Danger button:  rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700
Badge green:    inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800
Badge gray:     inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600
```

---

## npm Scripts Reference
```
npm run dev        → start Vite dev server
npm run build      → TypeScript compile + Vite production build
npm run preview    → preview production build locally
npm run test       → run Vitest
npm run lint       → ESLint check
npm run type-check → tsc --noEmit (run before every PR)
```

---

## Pre-PR Checklist
- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] All loading, error, and empty states are handled in new components
- [ ] New components have at least one test
- [ ] No `any` types introduced
- [ ] Mobile responsiveness checked
- [ ] Accessibility: labels on inputs, semantic HTML, keyboard navigation works