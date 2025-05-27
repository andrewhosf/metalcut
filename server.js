const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.stl', '.step'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only STL and STEP files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Routes
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: req.file.path
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Basic cost calculation endpoint
app.post('/api/calculate-cost', (req, res) => {
  const { material, thickness, quantity } = req.body;
  
  // Basic cost calculation logic (to be expanded)
  const baseCost = 100; // Base cost in dollars
  const materialMultiplier = material === 'steel' ? 1.2 : 1.0;
  const thicknessMultiplier = thickness / 10;
  const quantityDiscount = Math.max(0.8, 1 - (quantity * 0.01));
  
  const totalCost = baseCost * materialMultiplier * thicknessMultiplier * quantityDiscount * quantity;
  
  res.json({
    baseCost,
    materialCost: baseCost * materialMultiplier,
    thicknessCost: baseCost * thicknessMultiplier,
    quantityDiscount,
    totalCost
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 