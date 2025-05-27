import React from 'react';
import { 
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import CostCalculator from './components/CostCalculator';
import QuoteHistory from './components/QuoteHistory';
import Cart from './components/Cart';
import { CartProvider } from './contexts/CartContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Create a layout component that includes the Navbar
const Layout = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Outlet />
    </Box>
  </Box>
);

// Create routes with the future flag enabled
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<FileUpload />} />
      <Route path="/calculator" element={<CostCalculator />} />
      <Route path="/history" element={<QuoteHistory />} />
      <Route path="/cart" element={<Cart />} />
    </Route>
  ),
  {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true
    }
  }
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ThemeProvider>
  );
}

export default App; 