import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userProfileReducer from "../slices/userProfileSlice";
import sessionReducer from "../slices/sessionSlice";
import reviewReducer from "../slices/reviewSlice";
import { educationReducer } from "../slices/resourceSlice";
import { experienceReducer } from "../slices/resourceSlice";
import { certificationReducer } from "../slices/resourceSlice";
import { UnknownAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

const rootReducer = combineReducers({
  userProfile: userProfileReducer,
  session: sessionReducer,
  review: reviewReducer,
  education: educationReducer,
  experience: experienceReducer,
  certification: certificationReducer, 
});

// const store = configureStore({
//   reducer: rootReducer,
// });

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

// Export types for use throughout the app
// export type RootState = ReturnType<typeof rootReducer>;
// export type AppDispatch = typeof store.dispatch;

// Get the type of our store variable
// export type AppStore = typeof store
export type AppStore = ReturnType<typeof makeStore> 
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>
// export default store;