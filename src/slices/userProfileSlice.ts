import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import apiService from '../appService/apiService';
import { cloudinaryUpload } from '../utils/cloudinary';
import { AppThunk } from '@/src/appService/store';
import { UserProfile } from '../types/user';

interface UserProfileState {
  isLoading: boolean;
  error: string | null;
  updatedProfile: UserProfile | null;
  selectedUser: UserProfile | null;
  currentPageUsers: string[];
  currentHomePageUsers: string[];
  userProfilesById: Record<string, UserProfile>;
  total?: number;
  totalPages?: number;
}

interface GetUserProfileResponse {
  userProfiles: UserProfile[];
  count: number;
  totalPages: number;
}

interface GetUserProfileFeaturedResponse {
  userProfiles: UserProfile[];
}

interface UpdateUserProfileParams {
  name?: string;
  avatarUrl?: string | File;
  aboutMe?: string;
  city?: string;
  currentCompany?: string;
  currentPosition?: string;
  facebookLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  twitterLink?: string;
}

interface GetUserProfileParams {
  page?: number;
  limit?: number;
  filter?: object;
}

const initialState: UserProfileState = {
  isLoading: false,
  error: null,
  updatedProfile: null,
  selectedUser: null,
  currentPageUsers: [],
  currentHomePageUsers: [],
  userProfilesById: {},
};

const slice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateUserProfileSuccess(state, action: PayloadAction<UserProfile>) {
      state.isLoading = false;
      state.error = null;

      const updatedUserProfile = action.payload;
      state.updatedProfile = updatedUserProfile;
    },
    getUserProfileSuccess(state, action: PayloadAction<GetUserProfileResponse>) {
      state.isLoading = false;
      state.error = null;

      const { userProfiles, count, totalPages } = action.payload;
      userProfiles.forEach(user => (state.userProfilesById[user._id] = user));
      state.currentPageUsers = userProfiles.map(user => user._id);
      state.total = count;
      state.totalPages = totalPages;
    },
    getUserProfileFeaturedSuccess(state, action: PayloadAction<GetUserProfileFeaturedResponse>) {
      state.isLoading = false;
      state.error = null;

      const { userProfiles } = action.payload;
      userProfiles.forEach(userProfile => (state.userProfilesById[userProfile._id] = userProfile));
      state.currentHomePageUsers = userProfiles.map(userProfile => userProfile._id);
    },
    getSingleUserProfileSuccess(state, action: PayloadAction<UserProfile>) {
      state.isLoading = false;
      state.error = null;

      state.selectedUser = action.payload;
    },
  },
});

export const { startLoading, hasError, updateUserProfileSuccess, getUserProfileSuccess, getUserProfileFeaturedSuccess, getSingleUserProfileSuccess } = slice.actions;

export default slice.reducer;

// export const userProfileReducer = slice.reducer;

export const updateUserProfile = (params: UpdateUserProfileParams) => async (dispatch: Dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const { name, avatarUrl, aboutMe, city, currentCompany, currentPosition, facebookLink, instagramLink, linkedinLink, twitterLink } = params;

    const data: any = {
      name,
      avatarUrl,
      aboutMe,
      city,
      currentCompany,
      currentPosition,
      facebookLink,
      instagramLink,
      linkedinLink,
      twitterLink,
    };

    if (avatarUrl instanceof File) {
      const imageUrl = await cloudinaryUpload(avatarUrl);
      data.avatarUrl = imageUrl;
    }
    
    const response = await apiService.put(`/userprofiles/me`, data);
    dispatch(slice.actions.updateUserProfileSuccess(response.data));
    toast.success('Update Profile successfully');
  } catch (error: any) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const getUserProfile =
  (params: GetUserProfileParams): AppThunk =>
  async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const { page, limit, filter } = params;
      const requestParams: any = { page, limit };
      if (filter) {
        requestParams.filter = filter;
      }
      const response = await apiService.get(`/userprofiles/`, { params: requestParams });
      dispatch(slice.actions.getUserProfileSuccess(response.data));
    } catch (error: any) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const getUserProfileFeatured =
  (params: GetUserProfileParams): AppThunk =>
  async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const { page, limit, filter } = params;
      const response = await apiService.get(`/userprofiles/featured`, {
        params: { page, limit, filter },
      });
      dispatch(slice.actions.getUserProfileFeaturedSuccess(response.data));
    } catch (error: any) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const getSingleUserProfile =
  (userProfileId: string): AppThunk =>
  async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.get(`/userprofiles/${userProfileId}`);
      dispatch(slice.actions.getSingleUserProfileSuccess(response.data));
    } catch (error: any) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const getCurrentUserProfile = (): AppThunk => async dispatch => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get('/userprofiles/me');
    dispatch(slice.actions.updateUserProfileSuccess(response.data));
  } catch (error: any) {
    dispatch(slice.actions.hasError(error.message));
  }
};
