"use client";

import { createContext, useReducer, useEffect, ReactNode, Dispatch } from "react";
import apiService from "../appService/apiService";
import { useSelector } from "react-redux";
import { isValidToken } from "../utils/jwt";
import { toast } from "react-toastify";
import { IMentorProfile, IRegularUserProfile, UserProfile } from "../types/user";
import { useAppSelector } from "../appService/hooks";
import Cookies from "js-cookie";

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: { email: string; password: string; remember: boolean }, callback: () => void) => Promise<void>;
  loginWithGoogle: (idToken: string, callback: () => void) => Promise<void>;
  register: (data: { name: string; email: string; password: string; isMentor: boolean }, callback: () => void) => Promise<void>;
  logout: (callback: () => void) => Promise<void>;
  forgotPassword: (email: string, callback: () => void) => Promise<void>;
  resetPassword: (data: { newPassword: string; resetToken: string }, callback: () => void) => Promise<void>;
}

interface AuthAction {
  type: string;
  payload?: any;
}

// interface RootState {
//   userProfile: {
//     updatedProfile: IMentorProfile | IRegularUserProfile | null;
//   };
// }

const initialState: AuthState = {
  isInitialized: false,
  isAuthenticated: false,
  userProfile: null,
};

export const INITIALIZE = "AUTH.INITIALIZE";
export const LOGIN_SUCCESS = "AUTH.LOGIN_SUCCESS";
export const REGISTER_SUCCESS = "AUTH.REGISTER_SUCCESS";
export const LOGOUT = "AUTH.LOGOUT";
export const UPDATE_PROFILE = "AUTH.UPDATE_PROFILE";

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case INITIALIZE:
      const { isAuthenticated, userProfile } = action.payload;
      return {
        ...state,
        isInitialized: true,
        isAuthenticated,
        userProfile,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        userProfile: action.payload.userProfile,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        userProfile: action.payload.userProfile,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        userProfile: null,
      };
    case UPDATE_PROFILE:
      const { name, avatarUrl, aboutMe, city, currentCompany, currentPosition, facebookLink, instagramLink, linkedinLink, twitterLink, sessionCount, reviewCount, averageReviewRating } = action.payload;
      return {
        ...state,
        userProfile: {
          ...state.userProfile!,
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
          sessionCount,
          reviewCount,
          averageReviewRating,
        },
      };
    default:
      return state;
  }
};

const setSession = (accessToken: string | null, isPersistent: boolean = false): void => {
  if (accessToken) {
    // window.localStorage.setItem("accessToken", accessToken);
    // apiService.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    const cookieOptions = {
      path: "/",
      expires: isPersistent ? 7 : 1, // 7 days vs 1 day
    };
    Cookies.set("accessToken", accessToken, cookieOptions);
  } else {
    // window.localStorage.removeItem("accessToken");
    // delete apiService.defaults.headers.common.Authorization;
    Cookies.remove("accessToken");
  }
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logout: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
  initialAuthState: {
    isAuthenticated: boolean;
    isInitialized: boolean;
    userProfile: UserProfile | null;
  };
}

function AuthProvider({ children, initialAuthState }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const updatedProfile = useAppSelector((state) => state.userProfile.updatedProfile);

  useEffect(() => {
    if (updatedProfile) dispatch({ type: UPDATE_PROFILE, payload: updatedProfile });
  }, [updatedProfile]);

  const login = async ({ email, password, remember }: { email: string; password: string; remember: boolean }, callback: () => void): Promise<void> => {
    try {
      const response = await apiService.post("/auth/login", { email, password });
      const { userProfile, accessToken } = response.data;

      setSession(accessToken, remember);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { userProfile },
      });
      callback();
    } catch (err: any) {
      toast.error(err.errors.message);
    }
  };

  const loginWithGoogle = async (idToken: string, callback: () => void): Promise<void> => {
    try {
      const response = await apiService.post("/auth/googlelogin", { idToken: idToken });
      const { userProfile, accessToken } = response.data;
      setSession(accessToken);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { userProfile },
      });
      callback();
    } catch (e: any) {
      toast.error(e.errors.message);
    }
  };

  const forgotPassword = async (email: string, callback: () => void): Promise<void> => {
    try {
      const response = await apiService.put("/auth/forgotpassword", { email });
      toast.success(response.data);
      callback();
    } catch (e: any) {
      toast.error(e.errors.message);
    }
  };

  const resetPassword = async ({ newPassword, resetToken }: { newPassword: string; resetToken: string }, callback: () => void): Promise<void> => {
    try {
      const response = await apiService.put("/auth/resetpassword", {
        newPassword,
        resetToken,
      });
      toast.success(response.data);
      callback();
    } catch (e: any) {
      toast.error(e.errors.message);
    }
  };

  const register = async ({ name, email, password, isMentor }: { name: string; email: string; password: string; isMentor: boolean }, callback: () => void): Promise<void> => {
    const response = await apiService.post("/user/signup", {
      name,
      email,
      password,
      isMentor,
    });

    const { userProfile, accessToken } = response.data;
    setSession(accessToken);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: { userProfile },
    });
    callback();
  };

  const logout = async (callback: () => void): Promise<void> => {
    setSession(null);
    dispatch({ type: LOGOUT });
    callback();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        loginWithGoogle,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
