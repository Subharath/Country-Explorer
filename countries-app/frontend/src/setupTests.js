import '@testing-library/jest-dom';
import { vi } from 'vitest';
import axios from 'axios';

// Mock Axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock window.alert
window.alert = vi.fn();