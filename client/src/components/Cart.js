import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../contexts/CartContext';

function Cart() {
  const { cartItems, removeItemFromCart, clearCart } = useCart();

  const totalCost = cartItems.reduce((sum, item) => sum + item.cost, 0);

  if (cartItems.length === 0) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Your cart is empty
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          {cartItems.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem>
                <ListItemText
                  primary={item.name}
                  secondary={`Size: ${(item.size / 1024).toFixed(2)} KB | Cost: $${item.cost.toFixed(2)}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => removeItemFromCart(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant="h6">Total: ${totalCost.toFixed(2)}</Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={clearCart}
            sx={{ mr: 2 }}
          >
            Clear Cart
          </Button>
          <Button variant="contained" color="primary">
            Proceed to Checkout
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Cart; 