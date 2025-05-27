import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Grid,
  TextField
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import ModelViewer from './ModelViewer';
import GeometryAnalyzer from './GeometryAnalyzer';
import { createTestCubeSTL } from '../utils/createTestSTL';
import { Link } from 'react-router-dom';

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = {
  'application/octet-stream': ['.stl', '.step'],
  'model/stl': ['.stl'],
  'model/step': ['.step'],
};

// Dimension constant
const MAX_DIMENSION_MM = 100; // Max dimension in mm

function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  // State for test cube dimensions
  const [cubeDimensions, setCubeDimensions] = useState({
    width: 10,
    height: 10,
    depth: 10,
  });
  const [dimensionErrors, setDimensionErrors] = useState({});

  // Cleanup function for uploaded files
  useEffect(() => {
    return () => {
      if (uploadedFile) {
        URL.revokeObjectURL(URL.createObjectURL(uploadedFile));
      }
    };
  }, [uploadedFile]);

  const validateFile = (file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
    }

    // Check file extension
    const extension = file.name.toLowerCase().split('.').pop();
    const isValidExtension = Object.values(ALLOWED_FILE_TYPES)
      .flat()
      .some(ext => ext.toLowerCase() === `.${extension}`);

    if (!isValidExtension) {
      throw new Error('Invalid file type. Please upload an STL or STEP file.');
    }

    // Check file integrity (basic check)
    if (file.size === 0) {
      throw new Error('File appears to be empty');
    }

    return true;
  };

  const validateDimension = (name, value) => {
    let error = '';
    const numValue = parseFloat(value);

    if (isNaN(numValue) || numValue <= 0) {
      error = 'Must be a positive number';
    } else if (numValue > MAX_DIMENSION_MM) {
      error = `Max is ${MAX_DIMENSION_MM}mm`;
    }
    setDimensionErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setCubeDimensions(prev => ({ ...prev, [name]: value }));
    validateDimension(name, value);
  };

  const handleDownloadTestSTL = () => {
    const { width, height, depth } = cubeDimensions;
    const isWidthValid = validateDimension('width', width);
    const isHeightValid = validateDimension('height', height);
    const isDepthValid = validateDimension('depth', depth);

    if (isWidthValid && isHeightValid && isDepthValid) {
      createTestCubeSTL(parseFloat(width), parseFloat(height), parseFloat(depth));
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    console.log('File dropped:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    try {
      // Validate file
      validateFile(file);

      setUploading(true);
      setError(null);
      setSuccess(false);
      setUploadedFile(null); // Clear previous file to avoid confusion
      setFileInfo(null); // Clear previous file info

      // Create a temporary URL for the file (for viewer, not upload)
      const fileURL = URL.createObjectURL(file);
      setUploadedFile(file);

      // Prepare form data for upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server (assuming this returns fileInfo + cost)
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      // Combine file info from the original file object and the response data
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type,
        cost: response.data.cost || 10.50, // Use cost from response or dummy
        // Include other relevant info from response.data if available
        // ...response.data.otherInfo
      });

      console.log('Upload successful:', response.data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'An error occurred during upload');
      setUploadedFile(null);
      setFileInfo(null);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  // Check if any dimension has an error
  const hasDimensionErrors = Object.values(dimensionErrors).some(error => error !== '');

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Grid container spacing={3}>
        {/* Left Column - Geometry Analysis */}
        <Grid item xs={12} md={3}>
          {uploadedFile ? (
            <GeometryAnalyzer file={uploadedFile} />
          ) : (
            <Paper sx={{ p: 2, height: '100%', minHeight: '500px' }}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Upload a file to see analysis
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Middle Column - Model Viewer */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%', minHeight: '500px' }}>
            {uploadedFile ? (
              <Box sx={{ height: '100%', width: '100%' }}>
                <ModelViewer file={uploadedFile} />
              </Box>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Upload a file to preview
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Upload Area */}
        <Grid item xs={12} md={3}>
          <Paper
            {...getRootProps()}
            sx={{
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'divider',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragActive
                ? 'Drop the file here'
                : 'Drag and drop your STL or STEP file here'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              or click to select a file
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
            </Typography>
          </Paper>

          {/* Test Cube Generator */}
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>Generate Test Cube</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Width (mm)"
                  name="width"
                  type="number"
                  value={cubeDimensions.width}
                  onChange={handleDimensionChange}
                  error={!!dimensionErrors.width}
                  helperText={dimensionErrors.width}
                  inputProps={{ min: 1, max: MAX_DIMENSION_MM, step: 1 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Height (mm)"
                  name="height"
                  type="number"
                  value={cubeDimensions.height}
                  onChange={handleDimensionChange}
                  error={!!dimensionErrors.height}
                  helperText={dimensionErrors.height}
                  inputProps={{ min: 1, max: MAX_DIMENSION_MM, step: 1 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Depth (mm)"
                  name="depth"
                  type="number"
                  value={cubeDimensions.depth}
                  onChange={handleDimensionChange}
                  error={!!dimensionErrors.depth}
                  helperText={dimensionErrors.depth}
                  inputProps={{ min: 1, max: MAX_DIMENSION_MM, step: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleDownloadTestSTL}
                  disabled={hasDimensionErrors}
                  fullWidth
                >
                  Download Test STL
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {uploading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && fileInfo && (
            <Alert severity="success" sx={{ mt: 2 }}>
              File uploaded successfully! Estimated Cost: ${fileInfo.cost.toFixed(2)}
            </Alert>
          )}

          {fileInfo && (
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                File Information:
              </Typography>
              <Typography variant="body2">
                Name: {fileInfo.name}
              </Typography>
              <Typography variant="body2">
                Size: {(fileInfo.size / 1024).toFixed(2)} KB
              </Typography>
              <Typography variant="body2">
                Type: {fileInfo.type}
              </Typography>
              {fileInfo.cost !== undefined && (
                <Typography variant="body2">
                  Estimated Cost: ${fileInfo.cost.toFixed(2)}
                </Typography>
              )}
            </Paper>
          )}

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={'/calculator'}
              state={{ fileInfo: fileInfo, file: uploadedFile }}
              sx={{ mt: 2 }}
              disabled={!fileInfo}
            >
              Proceed to Cost Calculator
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FileUpload; 