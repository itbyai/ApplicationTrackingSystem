import { configureStore } from '@reduxjs/toolkit';

// 临时的store配置，后续会添加具体的slice
export const store = configureStore({
  reducer: {
    // auth: authSlice.reducer,
    // 其他reducer将在后续添加
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;