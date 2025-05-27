import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  IconButton,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CalculateIcon from '@mui/icons-material/Calculate';
import HistoryIcon from '@mui/icons-material/History';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function Navbar() {
  const { cartItems } = useCart();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MetalCut
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<UploadFileIcon />}
          >
            Upload
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/calculator"
            startIcon={<CalculateIcon />}
          >
            Calculator
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/history"
            startIcon={<HistoryIcon />}
          >
            History
          </Button>
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={cartItems.length} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 