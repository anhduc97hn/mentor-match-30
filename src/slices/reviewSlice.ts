import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import apiService from '../appService/apiService';
import { getSessions } from './sessionSlice';
import { AppDispatch, AppThunk } from '../appService/store';
import { Review } from '../types/review';

// Define types

interface ReviewState {
  isLoading: boolean;
  error: string | null;
  currentPageReviewsByMentor: string[];
  reviewsById: Record<string, Review>;
  selectedReview: Review | {};
  totalReviewsByMentor: number;
  totalPages: number;
}

interface GetReviewsPerMentorResponse {
  reviews: Review[];
  count: number;
  totalPages: number;
}

interface GetReviewsPerMentorParams {
  userProfileId: string;
  page?: number;
  limit?: number;
}

interface CreateReviewParams {
  sessionId: string;
  content: string;
  rating: number;
  prevStatus?: string;
}

const initialState: ReviewState = {
  isLoading: false,
  error: null,
  currentPageReviewsByMentor: [],
  reviewsById: {},
  selectedReview: {},
  totalReviewsByMentor: 0,
  totalPages: 1
};

const slice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getReviewsPerMentorSuccess(state, action: PayloadAction<GetReviewsPerMentorResponse>) {
      state.isLoading = false;
      state.error = '';
      console.log('payload', action.payload);
      const { reviews, count, totalPages } = action.payload;

      reviews.forEach(review => (state.reviewsById[review._id] = review));
      state.currentPageReviewsByMentor = reviews.map(review => review._id);
      state.totalReviewsByMentor = count;
      state.totalPages = totalPages;
    },
    getSingleReviewSuccess(state, action: PayloadAction<Review>) {
      state.isLoading = false;
      state.error = '';
      state.selectedReview = action.payload;
    },
    createReviewSuccess(state, action: PayloadAction<Review>) {
      state.isLoading = false;
      state.error = null;
    },
  },
});

export default slice.reducer;

export const getReviewsPerMentor =
  (params: GetReviewsPerMentorParams): AppThunk =>
  async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const { userProfileId, page, limit } = params;
      const requestParams = {
        page: page,
        limit: limit,
      };
      const response = await apiService.get(`/userprofiles/${userProfileId}/reviews`, {
        params: requestParams,
      });
      dispatch(slice.actions.getReviewsPerMentorSuccess(response.data));
    } catch (error: any) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const getSingleReview =
  (reviewId: string): AppThunk =>
  async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.get(`/reviews/${reviewId}`);
      dispatch(
        slice.actions.getSingleReviewSuccess({
          ...response.data,
        })
      );
    } catch (error: any) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const createReview =
  (params: CreateReviewParams): AppThunk =>
  async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const { sessionId, content, rating, prevStatus } = params;
      const response = await apiService.post(`/sessions/${sessionId}/reviews`, {
        content,
        rating,
      });
      dispatch(slice.actions.createReviewSuccess(response.data));
      if (prevStatus) {
        dispatch(getSessions({ prevStatus }));
      }
      toast.success('create review successfully!');
    } catch (error: any) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };
