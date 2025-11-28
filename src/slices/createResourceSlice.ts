import { createSlice, PayloadAction, Slice, CaseReducerActions, Reducer } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../appService/apiService";
import { DATA_PER_PAGE } from "../appService/config";
import { getCurrentUserProfile } from "./userProfileSlice";
import { AppDispatch, AppThunk } from "../appService/store";
import { IDocument } from "../types/user";

// Define the state structure with a generic type `T` for the resource data.
interface ResourceState<T extends IDocument> {
  isLoading: boolean;
  error: string | null;
  dataById: Record<string, T>;
  currentPageData: string[];
  total?: number;
  totalPages?: number;
}
type ResourceSliceResult<T extends IDocument, N extends string> = {
  reducer: Reducer<ResourceState<T>>;
  actions: CaseReducerActions<
    // Define the Reducers object structure to satisfy CaseReducerActions
    {
      startLoading: (state: ResourceState<T>) => void;
      hasError: (state: ResourceState<T>, action: PayloadAction<string>) => void;
      reset: (state: ResourceState<T>) => void;
      getAllSuccess: (
        state: ResourceState<T>,
        action: PayloadAction<
          Record<string, T[]> & { totalPages: number; count: number }
        >
      ) => void;
      createSuccess: (state: ResourceState<T>, action: PayloadAction<T>) => void;
      deleteSuccess: (state: ResourceState<T>, action: PayloadAction<T>) => void;
      editSuccess: (state: ResourceState<T>, action: PayloadAction<T>) => void;
    }, N
  > & {
    // Thunks
    getAll: (options?: { page?: number; limit?: number }) => AppThunk;
    create: (data: T) => AppThunk;
    remove: (itemId: string) => AppThunk;
    update: ({ itemId, data }: { itemId: string; data: T }) => AppThunk;
  };
};


// Type the `createResourceSlice` function to be generic.
const createResourceSlice = <T extends IDocument, N extends string>(resource: N): ResourceSliceResult<T, N> => {
  const initialState: ResourceState<T> = {
    isLoading: false,
    error: null,
    dataById: {},
    currentPageData: [],
  };

  const slice = createSlice({
    name: resource,
    initialState,
    reducers: {
      startLoading(state) {
        state.isLoading = true;
      },
      hasError(state, action: PayloadAction<string>) {
        state.isLoading = false;
        state.error = action.payload;
      },
      reset(state) {
        state.dataById = {};
        state.currentPageData = [];
      },
      getAllSuccess(
        state,
        action: PayloadAction<
         Record<string, T[]> & { totalPages: number; count: number }
        >
      ) {
        state.isLoading = false;
        state.error = null;

        const { [`${resource}s`]: data, totalPages, count } = action.payload;
        data.forEach((item) => {
          state.dataById[item._id] = item as any;
          if (!state.currentPageData.includes(item._id)) {
            state.currentPageData.push(item._id);
          }
        });
        state.total = count;
        state.totalPages = totalPages;
      },
      createSuccess(state, action: PayloadAction<T>) {
        state.isLoading = false;
        state.error = null;
        const newItem = action.payload;
        if (state.currentPageData.length % DATA_PER_PAGE === 0) {
          state.currentPageData.pop();
        }
        state.dataById[newItem._id] = newItem as any;
        state.currentPageData.unshift(newItem._id);
      },
      deleteSuccess(state, action: PayloadAction<T>) {
        state.isLoading = false;
        state.error = null;
        const deletedItem = action.payload;

        state.currentPageData = state.currentPageData.filter(
          (itemId) => itemId !== deletedItem._id
        );
        delete state.dataById[deletedItem._id];
      },
      editSuccess(state, action: PayloadAction<T>) {
        state.isLoading = false;
        state.error = null;
        const updatedItem = action.payload;
        if (state.currentPageData.find((itemId) => itemId === updatedItem._id)) {
          state.dataById[updatedItem._id] = updatedItem as any;
        }
      },
    },
  });

  const { reducer, actions } = slice;

  // The `getAll` async thunk now has a proper return type.
  const getAll =
    (options: { page?: number; limit?: number } = { page: 1, limit: DATA_PER_PAGE }) : AppThunk =>
    async (dispatch) => {
      dispatch(actions.startLoading());
      try {
        const response = await apiService.get(`/${resource}s`, {
          params: options,
        });
        if (options.page === 1) dispatch(actions.reset());
        dispatch(actions.getAllSuccess(response.data));
      } catch (error: any) {
        dispatch(actions.hasError(error.message));
        toast.error(error.message);
      }
    };

  // The `create` action now expects data of type `T`.
  const create =
    (data: T) : AppThunk =>
    async (dispatch) => {
      dispatch(actions.startLoading());
      try {
        const response = await apiService.post(`/${resource}s`, data);
        dispatch(actions.createSuccess(response.data));
        toast.success(`Create ${resource} successfully`);
        dispatch(getCurrentUserProfile());
        dispatch(getAll()); // Casting as `any` to avoid complex thunk type issues
      } catch (error: any) {
        dispatch(actions.hasError(error.message));
        toast.error(error.message);
      }
    };

  const remove =
    (itemId: string) : AppThunk =>
    async (dispatch) => {
      dispatch(actions.startLoading());
      try {
        const response = await apiService.delete(`/${resource}s/${itemId}`);
        dispatch(actions.deleteSuccess(response.data));
        toast.success(`${resource} deleted!`);
        dispatch(getCurrentUserProfile());
        dispatch(getAll());
      } catch (error: any) {
        dispatch(actions.hasError(error.message));
        toast.error(error.message);
      }
    };

  const update =
    ({ itemId, data }: { itemId: string; data: T })  :AppThunk=>
    async (dispatch) => {
      dispatch(actions.startLoading());
      try {
        const response = await apiService.put(`/${resource}s/${itemId}`, data);
        dispatch(actions.editSuccess(response.data));
        toast.success(`${resource} edited!`);
      } catch (error: any) {
        dispatch(actions.hasError(error.message));
        toast.error(error.message);
      }
    };

  return {
    reducer,
    actions: {
      ...actions,
      getAll,
      create,
      remove,
      update,
    },
  };
};

export default createResourceSlice;