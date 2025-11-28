import React, { ReactNode } from "react";
import { CssBaseline } from "@mui/material";
import {
  alpha,
  createTheme,
  ThemeProvider as MUIThemeProvider,
  ThemeOptions,
  PaletteColor,
} from "@mui/material/styles";
import { customComponents } from "./customization/customComponents";
import { common } from "@mui/material/colors";
import { customShadow } from "./customization/customShadow";
import { customTypography } from "./customization/customTypo";

// Define custom color interface
interface CustomPaletteColor extends PaletteColor {
  lightest: string;
  darkest: string;
  alpha4: string;
  alpha8: string;
  alpha12: string;
  alpha30: string;
  alpha50: string;
}

// Define neutral color palette
interface NeutralPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

// Extend the default theme palette
declare module '@mui/material/styles' {
  interface Palette {
    neutral: NeutralPalette;
  }

  interface PaletteOptions {
    neutral?: NeutralPalette;
  }
}

const withAlphas = (color: Omit<CustomPaletteColor, 'alpha4' | 'alpha8' | 'alpha12' | 'alpha30' | 'alpha50'>): CustomPaletteColor => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.30),
    alpha50: alpha(color.main, 0.50)
  };
};

export const neutral: NeutralPalette = {
  50: '#F8F9FA',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D2D6DB',
  400: '#9DA4AE',
  500: '#6C737F',
  600: '#4D5761',
  700: '#2F3746',
  800: '#1C2536',
  900: '#111927'
};

export const indigo = withAlphas({
  lightest: '#F5F7FF',
  light: '#EBEEFE',
  main: '#6366F1',
  dark: '#4338CA',
  darkest: '#312E81',
  contrastText: '#FFFFFF'
});

export const success = withAlphas({
  lightest: '#F0FDF9',
  light: '#3FC79A',
  main: '#10B981',
  dark: '#0B815A',
  darkest: '#134E48',
  contrastText: '#FFFFFF'
});

export const info = withAlphas({
  lightest: '#ECFDFF',
  light: '#CFF9FE',
  main: '#06AED4',
  dark: '#0E7090',
  darkest: '#164C63',
  contrastText: '#FFFFFF'
});

export const warning = withAlphas({
  lightest: '#FFFAEB',
  light: '#FEF0C7',
  main: '#F79009',
  dark: '#B54708',
  darkest: '#7A2E0E',
  contrastText: '#FFFFFF'
});

export const error = withAlphas({
  lightest: '#FEF3F2',
  light: '#FEE4E2',
  main: '#F04438',
  dark: '#B42318',
  darkest: '#7A271A',
  contrastText: '#FFFFFF'
});

interface ThemeProviderProps {
  children: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const themeOptions: ThemeOptions = {
    palette: {
      action: {
        active: neutral[500],
        disabled: alpha(neutral[900], 0.38),
        disabledBackground: alpha(neutral[900], 0.12),
        focus: alpha(neutral[900], 0.16),
        hover: alpha(neutral[900], 0.04),
        selected: alpha(neutral[900], 0.12)
      },
      background: {
        default: common.white,
        paper: common.white
      },
      divider: '#F2F4F7',
      error,
      info,
      mode: 'light',
      neutral,
      primary: indigo,
      success,
      text: {
        primary: neutral[900],
        secondary: neutral[500],
        disabled: alpha(neutral[900], 0.38)
      },
      warning
    },
    shape: { borderRadius: 8 },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440
      }
    },
    shadows: customShadow(),
    typography: customTypography()
  };

  const theme = createTheme(themeOptions);
  theme.components = customComponents(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}

export default ThemeProvider;