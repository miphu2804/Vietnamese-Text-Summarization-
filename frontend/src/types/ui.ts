export type Theme = 'light' | 'dark';
export type Language = 'en' | 'vi';

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface NotificationState {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  id: string;
}

export interface PageState {
  currentPage: string;
  sidebarOpen: boolean;
}

export interface UIState {
  theme: Theme;
  language: Language;
  loading: LoadingState;
  notifications: NotificationState[];
  page: PageState;
}