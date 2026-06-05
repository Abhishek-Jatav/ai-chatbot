export interface Conversation {
  _id: string;
  question: string;
  answer: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface StatsResponse {
  total: number;
  todayCount: number;
}

export type Theme = 'light' | 'dark';
