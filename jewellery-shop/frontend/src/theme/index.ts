import { createTheme } from '@mui/material/styles';

// Премиальная цветовая палитра для ювелирного магазина
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a2e', // Глубокий темно-синий
      light: '#16213e',
      dark: '#0f0f1e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d4af37', // Золотой
      light: '#f0d472',
      dark: '#a8882a',
      contrastText: '#ffffff',
    },
    error: {
      main: '#8b0000', // Темно-красный
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#6b6b6b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: '3.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '2.5rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '2rem',
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.12)',
    '0px 12px 24px rgba(0,0,0,0.15)',
    '0px 16px 32px rgba(0,0,0,0.18)',
    '0px 20px 40px rgba(0,0,0,0.20)',
    '0px 24px 48px rgba(0,0,0,0.22)',
    '0px 28px 56px rgba(0,0,0,0.24)',
    '0px 32px 64px rgba(0,0,0,0.26)',
    '0px 36px 72px rgba(0,0,0,0.28)',
    '0px 40px 80px rgba(0,0,0,0.30)',
    '0px 44px 88px rgba(0,0,0,0.32)',
    '0px 48px 96px rgba(0,0,0,0.34)',
    '0px 52px 104px rgba(0,0,0,0.36)',
    '0px 56px 112px rgba(0,0,0,0.38)',
    '0px 60px 120px rgba(0,0,0,0.40)',
    '0px 64px 128px rgba(0,0,0,0.42)',
    '0px 68px 136px rgba(0,0,0,0.44)',
    '0px 72px 144px rgba(0,0,0,0.46)',
    '0px 76px 152px rgba(0,0,0,0.48)',
    '0px 80px 160px rgba(0,0,0,0.50)',
    '0px 84px 168px rgba(0,0,0,0.52)',
    '0px 88px 176px rgba(0,0,0,0.54)',
    '0px 92px 184px rgba(0,0,0,0.56)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.95rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 16px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;
