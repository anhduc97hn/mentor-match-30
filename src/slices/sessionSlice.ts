import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../appService/apiService";
import { AppDispatch, AppThunk } from "../appService/store";
import { Session } from "../types/session";

interface SessionState {
  isLoading: boolean;
  error: string | null;
  currentPageSessions: string[];
  sessionsById: Record<string, Session>;
  totalPages: number;
  total?: number;
}

interface GetSessionsResponse {
  sessions: Session[];
  count: number;
  totalPages: number;
}

interface SessionActionResponse {
  sessionId: string;
  [key: string]: any;
}

interface GetRequestsParams {
  filterName?: string;
  page?: number;
  limit?: number;
}

interface GetSessionsParams {
  status?: string;
  page?: number;
  limit?: number;
  prevStatus?: string;
}

interface SendSessionRequestParams {
  userProfileId?: string;
  data: any;
}

interface UpdateSessionStatusParams {
  sessionId: string;
  status: string;
  prevStatus?: string;
}

const initialState: SessionState = {
  isLoading: false,
  error: null,
  currentPageSessions: [],
  sessionsById: {},
  totalPages: 1,
};

const slice = createSlice({
  name: "session",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getSessionRequestsSuccess(state, action: PayloadAction<GetSessionsResponse>) {
      state.isLoading = false;
      state.error = null;
      const { sessions, count, totalPages } = action.payload;
      sessions.forEach(
        (session) => (state.sessionsById[session._id] = session)
      );
      state.currentPageSessions = sessions.map((session) => session._id);
      state.total = count;
      state.totalPages = totalPages;
    },
    sendSessionRequestSuccess(state, action: PayloadAction<SessionActionResponse>) {
      state.isLoading = false;
      state.error = null;
      const { sessionId, ...session } = action.payload;
      state.sessionsById[sessionId] = session as Session;
    },
    declineRequestSuccess(state, action: PayloadAction<SessionActionResponse>) {
      state.isLoading = false;
      state.error = null;
      const { sessionId, ...session } = action.payload;
      state.sessionsById[sessionId] = session as Session;
    },
    acceptRequestSuccess(state, action: PayloadAction<SessionActionResponse>) {
      state.isLoading = false;
      state.error = null;
      const { sessionId, ...session } = action.payload;
      state.sessionsById[sessionId] = session as Session;
    },
    cancelRequestSuccess(state, action: PayloadAction<SessionActionResponse>) {
      state.isLoading = false;
      state.error = null;
      const { sessionId, ...session } = action.payload;
      state.sessionsById[sessionId] = session as Session;
    },
    completeSessionSuccess(state, action: PayloadAction<SessionActionResponse>) {
      state.isLoading = false;
      state.error = null;
      const { sessionId, ...session } = action.payload;
      state.sessionsById[sessionId] = session as Session;
    },
    updateSessionStatusSuccess(state, action: PayloadAction<SessionActionResponse>) {
      state.isLoading = false;
      state.error = null;
      const { sessionId, ...session } = action.payload;
      state.sessionsById[sessionId] = session as Session;
    },
  },
});

export default slice.reducer;

export const getRequestsSent =
  (params: GetRequestsParams = {}) : AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const { filterName, page = 1, limit = 10 } = params;
      const requestParams: any = { page, limit };
      if (filterName) requestParams.name = filterName;
      const response = await apiService.get("/sessions/requests/outgoing", {
        params: requestParams,
      });
      dispatch(slice.actions.getSessionRequestsSuccess(response.data));
    } catch (error: any) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const getRequestsReceived =
  (params: GetRequestsParams = {}) : AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const { filterName, page = 1, limit = 10 } = params;
      const requestParams: any = { page, limit };
      if (filterName) requestParams.name = filterName;
      const response = await apiService.get("/sessions/requests/incoming", {
        params: requestParams,
      });
      dispatch(slice.actions.getSessionRequestsSuccess(response.data));
    } catch (error: any) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const getSessions =
  (params: GetSessionsParams = {}) : AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const { status, page = 1, limit = 10 } = params;
      const requestParams: any = { status, page, limit };
      const response = await apiService.get("/sessions", {
        params: requestParams,
      });
      dispatch(slice.actions.getSessionRequestsSuccess(response.data));
    } catch (error: any) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const sendSessionRequest =
  (params: SendSessionRequestParams) : AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const { userProfileId, data } = params;
      const response = await apiService.post(
        `/sessions/requests/${userProfileId}`,
        data
      );
      dispatch(slice.actions.sendSessionRequestSuccess(response.data));
      toast.success("Request sent");
    } catch (error: any) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const declineRequest = (sessionId: string) : AppThunk => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.put(`/sessions/requests/${sessionId}`, {
      status: "declined",
    });
    dispatch(
      slice.actions.declineRequestSuccess(response.data)
    );
    dispatch(getSessions());
    toast.success("Request declined");
  } catch (error: any) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const acceptRequest = (sessionId: string) : AppThunk => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.put(`/sessions/requests/${sessionId}`, {
      status: "accepted",
    });
    dispatch(
      slice.actions.acceptRequestSuccess(response.data)
    );
    dispatch(getSessions());
    toast.success("Request accepted");
  } catch (error: any) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const cancelRequest = (sessionId: string) : AppThunk => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.put(`/sessions/requests/${sessionId}`, {
      status: "cancelled",
    });
    dispatch(
      slice.actions.cancelRequestSuccess(response.data)
    );
    dispatch(getSessions());
    toast.success("Request cancelled");
  } catch (error: any) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const completeSession = (sessionId: string) : AppThunk => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.put(`/sessions/requests/${sessionId}`, {
      status: "completed",
    });
    dispatch(
      slice.actions.completeSessionSuccess(response.data)
    );
    dispatch(getSessions());
  } catch (error: any) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const updateSessionStatus =
  (params: UpdateSessionStatusParams) : AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const { sessionId, status, prevStatus } = params;
      const response = await apiService.put(`/sessions/${sessionId}`, {
        status,
      });
      dispatch(slice.actions.updateSessionStatusSuccess(response.data));
      if (prevStatus) {
        dispatch(getSessions({ status: prevStatus }));
      }
      toast.success("Session updated");
    } catch (error: any) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };