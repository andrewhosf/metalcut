import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';

// Helper function to load geometry (moved outside component)
const loadGeometry = (file) => {
  return new Promise((resolve, reject) => {
    if (file.name.toLowerCase().endsWith('.stl')) {
      const loader = new STLLoader();
      const fileURL = URL.createObjectURL(file);

      loader.load(
        fileURL,
        (geometry) => {
          URL.revokeObjectURL(fileURL);
          resolve(geometry);
        },
        undefined,
        (error) => {
          URL.revokeObjectURL(fileURL);
          reject(new Error('Failed to load STL file: ' + error.message));
        }
      );
    } else {
      reject(new Error('Unsupported file type'));
    }
  });
};

// Helper function to compute signed volume of a triangle (moved outside component)
const signedVolumeOfTriangle = (p1, p2, p3) => {
  return p1.dot(p2.cross(p3)) / 6.0;
};

// Helper function to compute volume of geometry (moved outside component)
const computeVolume = (geometry) => {
  let volume = 0;
  const positions = geometry.attributes.position.array;
  const indices = geometry.index ? geometry.index.array : null;

  if (indices) {
    // Indexed geometry
    for (let i = 0; i < indices.length; i += 3) {
      const a = indices[i];
      const b = indices[i + 1];
      const c = indices[i + 2];

      const v1 = new THREE.Vector3(
        positions[a * 3],
        positions[a * 3 + 1],
        positions[a * 3 + 2]
      );
      const v2 = new THREE.Vector3(
        positions[b * 3],
        positions[b * 3 + 1],
        positions[b * 3 + 2]
      );
      const v3 = new THREE.Vector3(
        positions[c * 3],
        positions[c * 3 + 1],
        positions[c * 3 + 2]
      );

      volume += signedVolumeOfTriangle(v1, v2, v3);
    }
  } else {
    // Non-indexed geometry
    for (let i = 0; i < positions.length; i += 9) {
      const v1 = new THREE.Vector3(
        positions[i],
        positions[i + 1],
        positions[i + 2]
      );
      const v2 = new THREE.Vector3(
        positions[i + 3],
        positions[i + 4],
        positions[i + 5]
      );
      const v3 = new THREE.Vector3(
        positions[i + 6],
        positions[i + 7],
        positions[i + 8]
      );

      volume += signedVolumeOfTriangle(v1, v2, v3);
    }
  }

  return Math.abs(volume);
};

// Helper function to analyze features (moved outside component)
const analyzeFeatures = (geometry) => {
  const features = {
    vertexCount: geometry.attributes.position.count,
    faceCount: geometry.attributes.position.count / 3,
    hasNormals: !!geometry.attributes.normal,
    hasUVs: !!geometry.attributes.uv,
  };

  // Analyze mesh complexity
  if (features.faceCount < 100) {
    features.complexity = 'Low';
  } else if (features.faceCount < 1000) {
    features.complexity = 'Medium';
  } else {
    features.complexity = 'High';
  }

  return features;
};

// Main analysis function (moved outside component)
const analyzeModel = async (geometry) => {
  // Compute bounding box
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox;
  const size = new THREE.Vector3();
  boundingBox.getSize(size);

  // Compute volume
  const volume = computeVolume(geometry);

  // Analyze features
  const features = analyzeFeatures(geometry);

  return {
    dimensions: {
      width: size.x.toFixed(2),
      height: size.y.toFixed(2),
      depth: size.z.toFixed(2),
    },
    volume: volume.toFixed(2),
    features,
    boundingBox,
  };
};

function GeometryAnalyzer({ file }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) return;

    const analyzeGeometry = async () => {
      setLoading(true);
      setError(null);

      try {
        const geometry = await loadGeometry(file);
        const analysis = await analyzeModel(geometry);
        setAnalysis(analysis);
      } catch (err) {
        console.error('Geometry analysis error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    analyzeGeometry();
  }, [file]); // Removed analyzeModel from dependency array as it's now stable outside the component

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 2, m: 2 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Geometry Analysis
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Dimensions"
            secondary={`${analysis.dimensions.width} × ${analysis.dimensions.height} × ${analysis.dimensions.depth} mm`}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Volume"
            secondary={`${analysis.volume} mm³`}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Mesh Complexity"
            secondary={analysis.features.complexity}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Vertex Count"
            secondary={analysis.features.vertexCount.toLocaleString()}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Face Count"
            secondary={analysis.features.faceCount.toLocaleString()}
          />
        </ListItem>
      </List>
    </Paper>
  );
}

export default GeometryAnalyzer; 