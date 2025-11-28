'use client'

import { createContext, useReducer, useEffect, ReactNode } from "react";
import apiService from "../appService/apiService";
import { useSelector } from "react-redux";
import { isValidToken } from "../utils/jwt";
import { toast } from "react-toastify";
import { IMentorProfile, IRegularUserProfile, UserProfile } from "../types/user";
import { useAppSelector } from "../appService/hooks";

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: { email: string; password: string }, callback: () => void) => Promise<void>;
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

const INITIALIZE = "AUTH.INITIALIZE";
const LOGIN_SUCCESS = "AUTH.LOGIN_SUCCESS";
const REGISTER_SUCCESS = "AUTH.REGISTER_SUCCESS";
const LOGOUT = "AUTH.LOGOUT";
const UPDATE_PROFILE = "AUTH.UPDATE_PROFILE";

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
      const {
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
      } = action.payload;
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

const setSession = (accessToken: string | null): void => {
  if (accessToken) {
    window.localStorage.setItem("accessToken", accessToken);
    apiService.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    window.localStorage.removeItem("accessToken");
    delete apiService.defaults.headers.common.Authorization;
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
}

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const updatedProfile = useAppSelector((state) => state.userProfile.updatedProfile);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
          const accessToken = window.localStorage.getItem("accessToken");
          if (accessToken && isValidToken(accessToken)) {
            setSession(accessToken);
  
            const response = await apiService.get("/userProfiles/me");
            const userProfile: UserProfile = response.data;
  
            dispatch({
              type: INITIALIZE,
              payload: { isAuthenticated: true, userProfile },
            });
        }
         else {
          setSession(null);
          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: false, userProfile: null },
          });
        }
      } catch (err) {
        console.error(err);
        setSession(null);
        dispatch({
          type: INITIALIZE,
          payload: {
            isAuthenticated: false,
            userProfile: null,
          },
        });
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (updatedProfile)
      dispatch({ type: UPDATE_PROFILE, payload: updatedProfile });
  }, [updatedProfile]);

  const login = async ({ email, password }: { email: string; password: string }, callback: () => void): Promise<void> => {
    const response = await apiService.post("/auth/login", { email, password });
    const { userProfile, accessToken } = response.data;

    setSession(accessToken);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { userProfile },
    });
    callback();
  };

  const loginWithGoogle = async (idToken: string, callback: () => void): Promise<void> => {
    try {
      const response = await apiService.post("/auth/googlelogin", {idToken: idToken});
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
    const response = await apiService.post("/users/signup", {
      name,
      email,
      password,
      isMentor
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
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };