"use client"; 

import { Provider as ReduxProvider } from "react-redux";
import { AppStore, makeStore } from "@/src/appService/store";
import ThemeProvider from "@/src/theme";
import { AuthProvider } from "@/src/contexts/AuthContext"; 
import { DatePicker } from "@/src/contexts/DatePicker"; 
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRef } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string;

export default function Providers({ children }: { children: React.ReactNode }) {
  
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // 4. Create the store instance the first time this component renders
    // This happens once per request on the server (SSR) and once on the client
    storeRef.current = makeStore();
  }

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
    <ReduxProvider store={storeRef.current}>
      <AuthProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <ThemeProvider>
            <DatePicker>
              {children}
            </DatePicker>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </ReduxProvider>
    </AppRouterCacheProvider>
  );
}