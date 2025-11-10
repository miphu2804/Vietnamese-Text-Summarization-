import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme, Language, LoadingState, NotificationState } from '../../types';

interface UIState {
  theme: Theme;
  language: Language;
  loading: LoadingState;
  notifications: NotificationState[];
  sidebarOpen: boolean;
}

const initialState: UIState = {
  theme: 'light',
  language: 'vi',
  loading: {
    isLoading: false,
  },
  notifications: [],
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setLoading: (state, action: PayloadAction<Partial<LoadingState>>) => {
      state.loading = { ...state.loading, ...action.payload };
    },
    addNotification: (state, action: PayloadAction<Omit<NotificationState, 'id'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setLanguage,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  setSidebarOpen,
  toggleSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;