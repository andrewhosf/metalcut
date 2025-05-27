import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';

export function createTestCubeSTL(width = 1, height = 1, depth = 1) {
  // Create a simple cube geometry with specified dimensions
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshBasicMaterial();
  const cube = new THREE.Mesh(geometry, material);

  // Create an STL exporter
  const exporter = new STLExporter();
  // Use the mesh itself for parsing, not just the geometry
  const stlString = exporter.parse(cube, { binary: false });

  // Convert the STL string to a Blob
  const blob = new Blob([stlString], { type: 'application/octet-stream' });
  
  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `test_cube_${width}x${height}x${depth}mm.stl`;
  
  // Trigger the download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
} 