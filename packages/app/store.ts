import { configureStore } from "@reduxjs/toolkit";
import placesReducer from "./redux/placesSlice";

export const store = configureStore({
  reducer: {
    places: placesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
