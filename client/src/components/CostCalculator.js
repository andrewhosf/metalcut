import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';

const materials = [
  { value: 'steel', label: 'Steel' },
  { value: 'aluminum', label: 'Aluminum' },
  { value: 'brass', label: 'Brass' },
  { value: 'copper', label: 'Copper' },
];

function CostCalculator() {
  const location = useLocation();
  const uploadedFileData = location.state?.fileInfo; // Get file info from state
  const uploadedFileObject = location.state?.file; // Get the file object from state

  console.log('CostCalculator received state:', location.state); // Log received state

  const [formData, setFormData] = useState({
    material: uploadedFileData?.material || 'steel', // Use uploaded material if available
    thickness: uploadedFileData?.thickness || '',
    quantity: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // We'll use a separate state for the quote if we perform a new calculation
  // If file info is passed with a cost, we can use that initially.
  const [calculatedQuote, setCalculatedQuote] = useState(null);
  const [itemToAdd, setItemToAdd] = useState(null);

  const { addItemToCart } = useCart();

  // Effect to set the item to add to cart if file info is passed initially
  useEffect(() => {
    console.log('useEffect in CostCalculator fired. uploadedFileData:', uploadedFileData); // Log uploadedFileData in useEffect
    if (uploadedFileData && uploadedFileData.cost !== undefined) {
      setItemToAdd({
        id: Date.now(),
        name: uploadedFileData.name,
        size: uploadedFileData.size,
        type: uploadedFileData.type,
        cost: uploadedFileData.cost,
        file: uploadedFileObject, // Store the file object if needed
      });
      // If we pass a calculated cost from upload, maybe display it directly?
      // For now, the form is still for recalculation or new calculation.
    }
  }, [uploadedFileData, uploadedFileObject]); // Depend on the passed state


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadedFileData) {
       setError('No file uploaded for cost calculation.');
       return;
    }

    setLoading(true);
    setError(null);
    setCalculatedQuote(null);
    setItemToAdd(null); // Clear previous item to add on new calculation

    try {
      // Include file identifier in the request if needed by backend
      // For now, just sending form data. Backend might need to know which file.
      const response = await axios.post('http://localhost:5000/api/calculate-cost', {
         ...formData,
         fileName: uploadedFileData.name, // Example: send file name
         fileSize: uploadedFileData.size // Example: send file size
      });

      const newQuote = response.data;
      setCalculatedQuote(newQuote);

      // Prepare item to add to cart based on the new quote
      setItemToAdd({
         id: Date.now(), // Simple unique ID
         name: uploadedFileData.name, // Use original file name
         size: uploadedFileData.size, // Use original file size
         type: uploadedFileData.type, // Use original file type
         cost: newQuote.totalCost, // Use the newly calculated total cost
         file: uploadedFileObject // Store the file object if needed
      });

    } catch (err) {
      console.error('Calculation error:', err);
      setError(err.response?.data?.error || 'An error occurred while calculating costs');
      setCalculatedQuote(null);
      setItemToAdd(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    console.log('Adding item to cart. itemToAdd:', itemToAdd); // Log itemToAdd before adding
    if (itemToAdd) {
      addItemToCart(itemToAdd);
      // Optionally provide feedback or navigate to cart
      alert(`${itemToAdd.name} added to cart!`);
      setItemToAdd(null); // Clear item to prevent adding same item multiple times
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Cost Calculator
        </Typography>

        {uploadedFileData && (
           <Box sx={{ mb: 3 }}>
              <Typography variant="h6">File: {uploadedFileData.name}</Typography>
              <Typography variant="body2">Size: {(uploadedFileData.size / 1024).toFixed(2)} KB</Typography>
              {uploadedFileData.cost !== undefined && (
                 <Typography variant="body2">Initial Estimated Cost: ${uploadedFileData.cost.toFixed(2)}</Typography>
              )}
           </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Material"
                name="material"
                value={formData.material}
                onChange={handleChange}
                required
              >
                {materials.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Thickness (mm)"
                name="thickness"
                type="number"
                value={formData.thickness}
                onChange={handleChange}
                required
                inputProps={{ min: 0.1, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !uploadedFileData}
                fullWidth
              >
                Calculate Cost
              </Button>
            </Grid>
          </Grid>
        </form>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {calculatedQuote && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quote Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Base Cost: ${calculatedQuote.baseCost.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  Material Cost: ${calculatedQuote.materialCost.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  Thickness Cost: ${calculatedQuote.thicknessCost.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Quantity Discount: {(calculatedQuote.quantityDiscount * 100).toFixed(0)}%
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  Total Cost: ${calculatedQuote.totalCost.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
             <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAddToCart}
                  disabled={!itemToAdd}
                >
                   Add to Cart
                </Button>
             </Box>
          </Box>
        )}

        {/* Display Add to Cart button if itemToAdd is ready */} {/* This might be redundant with the button in calculatedQuote block */}
        {/* {itemToAdd && !calculatedQuote && (
           <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAddToCart}
              >
                 Add {itemToAdd.name} to Cart
              </Button>
           </Box>
        )} */}

      </Paper>
    </Box>
  );
}

export default CostCalculator; 