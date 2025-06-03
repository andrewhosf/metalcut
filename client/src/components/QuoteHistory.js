/**
 * QuoteHistory.js
 * 
 * This component displays a history of quotes and allows users to reorder items.
 * Features:
 * - Displays quote history in a table format
 * - Shows quote status with color-coded chips
 * - Provides reorder functionality for each quote
 * - Integrates with CartContext for reordering
 * 
 * Note: Currently using mock data. In production, this should fetch from an API.
 */

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import { useCart } from '../contexts/CartContext';

// Mock data for demonstration
const mockQuotes = [
  {
    id: 1,
    date: '2024-02-20',
    material: 'Steel',
    thickness: '5mm',
    quantity: 10,
    totalCost: 1250.00,
    status: 'Completed',
  },
  {
    id: 2,
    date: '2024-02-19',
    material: 'Aluminum',
    thickness: '3mm',
    quantity: 5,
    totalCost: 750.00,
    status: 'Pending',
  },
  {
    id: 3,
    date: '2024-02-18',
    material: 'Brass',
    thickness: '2mm',
    quantity: 20,
    totalCost: 2000.00,
    status: 'In Progress',
  },
];

function QuoteHistory() {
  const { reorderFromQuote } = useCart();

  /**
   * Returns the appropriate color for the status chip
   * @param {string} status - The quote status
   * @returns {string} The color to use for the status chip
   */
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'in progress':
        return 'info';
      default:
        return 'default';
    }
  };

  /**
   * Handles reordering a quote by adding it to the cart
   * @param {Object} quote - The quote to reorder
   */
  const handleReorder = (quote) => {
    reorderFromQuote(quote);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quote History
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Material</TableCell>
                <TableCell>Thickness</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell align="right">Total Cost</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell>{quote.date}</TableCell>
                  <TableCell>{quote.material}</TableCell>
                  <TableCell>{quote.thickness}</TableCell>
                  <TableCell>{quote.quantity}</TableCell>
                  <TableCell align="right">
                    ${quote.totalCost.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={quote.status}
                      color={getStatusColor(quote.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Reorder">
                      <IconButton
                        color="primary"
                        onClick={() => handleReorder(quote)}
                        size="small"
                      >
                        <ReplayIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default QuoteHistory; 