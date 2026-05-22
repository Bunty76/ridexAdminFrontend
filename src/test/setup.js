import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from './mocks/server';

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(() => ({ id: 'admin_1', name: 'Super Admin' })),
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
