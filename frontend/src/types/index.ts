export type Theme = "light" | "dark";

export interface Conversation {
  _id: string;
  question: string;
  answer: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  timestamp?: string;
  streaming?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  total: number;
  totalPages: number;
}

export interface Stats {
  total: number;
  todayCount: number;
}

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  refreshKey: number;
  onSelect: (conversation: Conversation) => void;
}

export interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  openSidebar: () => void;
}

export interface ChatInputProps {
  disabled: boolean;
  streaming: boolean;
  onSend: (text: string) => void;
}

export interface ChatMessageProps {
  message: ChatMessage;
  onDelete?: (id: string) => void;
}

export interface EmptyStateProps {
  onSelect: (question: string) => void;
}
