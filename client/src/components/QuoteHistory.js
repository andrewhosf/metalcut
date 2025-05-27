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
} from '@mui/material';

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