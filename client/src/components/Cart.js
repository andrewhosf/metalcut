/**
 * Cart.js
 * 
 * This component displays the shopping cart and handles cart operations.
 * Features:
 * - Shows all items in the cart with detailed information
 * - Displays different information for regular items vs reordered quotes
 * - Allows removal of individual items
 * - Shows total cost calculation
 * - Provides clear cart functionality
 * - Includes checkout button (functionality to be implemented)
 * 
 * The cart displays:
 * - Item name and type (with reorder indicator for reordered items)
 * - Material details for quotes
 * - File size for regular items
 * - Cost information
 * - Timestamp of when item was added
 */

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
  Button,
  Chip,
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
      <Paper sx={{ p: 3 }}>
        <List>
          {cartItems.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.name}
                      {item.type === 'quote' && (
                        <Chip
                          label="Reordered"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      {item.type === 'quote' ? (
                        <>
                          <Typography variant="body2">
                            Material: {item.material}
                          </Typography>
                          <Typography variant="body2">
                            Thickness: {item.thickness}
                          </Typography>
                          <Typography variant="body2">
                            Quantity: {item.quantity}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2">
                          Size: {(item.size / 1024).toFixed(2)} KB
                        </Typography>
                      )}
                      <Typography variant="body2" color="primary">
                        Cost: ${item.cost.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Added: {new Date(item.addedAt).toLocaleString()}
                      </Typography>
                    </Box>
                  }
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