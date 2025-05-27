import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function ModelViewer({ file }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!file) {
      console.log('No file provided to ModelViewer');
      return;
    }

    console.log('ModelViewer received file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    // Store the current mount ref value
    const mount = mountRef.current;
    if (!mount) {
      console.error('Mount ref is not available');
      return;
    }

    console.log('Mount dimensions:', {
      width: mount.clientWidth,
      height: mount.clientHeight
    });

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Load model
    const loader = new STLLoader();
    const fileURL = URL.createObjectURL(file);
    console.log('Created object URL:', fileURL);

    // Check if file is STL
    if (file.name.toLowerCase().endsWith('.stl')) {
      loader.load(
        fileURL,
        (geometry) => {
          console.log('STL file loaded successfully');
          const material = new THREE.MeshPhongMaterial({
            color: 0x1976d2,
            specular: 0x111111,
            shininess: 30,
          });
          const mesh = new THREE.Mesh(geometry, material);
          
          // Center the model
          geometry.computeBoundingBox();
          const center = new THREE.Vector3();
          geometry.boundingBox.getCenter(center);
          mesh.position.sub(center);

          // Scale the model to fit the view
          const size = new THREE.Vector3();
          geometry.boundingBox.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2 / maxDim;
          mesh.scale.multiplyScalar(scale);

          scene.add(mesh);

          // Add dimension axes
          const axesHelper = new THREE.AxesHelper(Math.max(size.x, size.y, size.z) * 1.2);
          scene.add(axesHelper);

          console.log('Mesh added to scene');
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
          console.error('Error loading STL file:', error);
        }
      );
    } else if (file.name.toLowerCase().endsWith('.step')) {
      console.log('STEP files are not yet supported');
      // TODO: Implement STEP file loading
    } else {
      console.error('Unsupported file type:', file.name);
    }

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      console.log('Cleaning up ModelViewer');
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (mount && rendererRef.current?.domElement) {
        mount.removeChild(rendererRef.current.domElement);
      }
      scene.clear();
      if (fileURL) URL.revokeObjectURL(fileURL); // Added check for fileURL existence
    };
  }, [file]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        position: 'relative',
      }}
    />
  );
}

export default ModelViewer; 