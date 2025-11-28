import { ActionCreatorWithoutPayload, ActionCreatorWithPayload, Slice } from "@reduxjs/toolkit";
import { AppThunk } from "../appService/store";
import createResourceSlice from "./createResourceSlice";
import { Education, Experience, Certification } from "../types/user";

// A generic interface for the structure returned by createResourceSlice<T>
// interface ResourceSliceResult<T> {
//   reducer: ReturnType<Slice["reducer"]>;
//   actions: {
//     startLoading: ActionCreatorWithoutPayload<string>;
//     hasError: ActionCreatorWithPayload<string, string>;
//     reset: ActionCreatorWithoutPayload<string>;
//     getAllSuccess: ActionCreatorWithPayload<any, string>; // Using 'any' due to the dynamic key, though a better type could be defined
//     createSuccess: ActionCreatorWithPayload<T, string>;
//     deleteSuccess: ActionCreatorWithPayload<T, string>;
//     editSuccess: ActionCreatorWithPayload<T, string>;
//     getAll: (options?: { page: number; limit: number }) => AppThunk;
//     create: (data: T) => AppThunk;
//     remove: (itemId: string) => AppThunk;
//     update: ({ itemId, data }: { itemId: string; data: T }) => AppThunk;
//   };
// }

// Now we can use the typed function to create our slices
const educationSlice = createResourceSlice<Education, "education">("education");
const experienceSlice = createResourceSlice<Experience, "experience">("experience");
const certificationSlice = createResourceSlice<Certification, "certification">("certification");


// Export the reducers and typed actions
export const educationReducer = educationSlice.reducer;
export const experienceReducer = experienceSlice.reducer;
export const certificationReducer = certificationSlice.reducer;

export const {
  startLoading: educationStartLoading,
  hasError: educationHasError,
  reset: educationReset,
  getAllSuccess: educationGetAllSuccess,
  createSuccess: educationCreateSuccess,
  deleteSuccess: educationDeleteSuccess,
  editSuccess: educationEditSuccess,
  getAll: educationGetAll,
  create: educationCreate,
  remove: educationRemove,
  update: educationUpdate,
} = educationSlice.actions;

export const {
  startLoading: experienceStartLoading,
  hasError: experienceHasError,
  reset: experienceReset,
  getAllSuccess: experienceGetAllSuccess,
  createSuccess: experienceCreateSuccess,
  deleteSuccess: experienceDeleteSuccess,
  editSuccess: experienceEditSuccess,
  getAll: experienceGetAll,
  create: experienceCreate,
  remove: experienceRemove,
  update: experienceUpdate,
} = experienceSlice.actions;

export const {
  startLoading: certificationStartLoading,
  hasError: certificationHasError,
  reset: certificationReset,
  getAllSuccess: certificationGetAllSuccess,
  createSuccess: certificationCreateSuccess,
  deleteSuccess: certificationDeleteSuccess,
  editSuccess: certificationEditSuccess,
  getAll: certificationGetAll,
  create: certificationCreate,
  remove: certificationRemove,
  update: certificationUpdate,
} = certificationSlice.actions;