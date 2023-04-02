import { configureStore } from '@reduxjs/toolkit';
import surveyReducer from './surveySlice';
import editorReducer from './editorSlice'

const store = configureStore({
  reducer: {
    survey: surveyReducer,
    editor: editorReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
