import React, { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage, Center } from "@react-three/drei";
import * as THREE from "three";

interface ModelViewerProps {
  modelUrl: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  autoRotate?: boolean;
}

// Model component that loads and displays the 3D model
function Model({
  url,
  autoRotate = true,
}: {
  url: string;
  autoRotate?: boolean;
}) {
  const modelRef = useRef<THREE.Group>(null);
  // Load the model with useGLTF with error handling
  const { scene } = useGLTF(url, true); // True enables error handling

  // Clone the scene to avoid modification issues
  const model = React.useMemo(() => {
    return scene.clone();
  }, [scene]);

  // Optional auto-rotation
  useFrame((state, delta) => {
    if (modelRef.current && autoRotate) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  // Clean up the model when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup resources
      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            } else if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            }
          }
        });
      }
    };
  }, []);

  return (
    <primitive ref={modelRef} object={model} scale={1} position={[0, 0, 0]} />
  );
}

// Camera setup with auto positioning
function CameraSetup() {
  const { camera } = useThree();

  useEffect(() => {
    // Reset camera position on mount
    camera.position.set(2, 2, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in 3D renderer:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Main ModelViewer component
export default function ModelViewer({
  modelUrl,
  width = "100%",
  height = "100%",
  backgroundColor = "#f0f0f0",
  autoRotate = true,
}: ModelViewerProps) {
  const canvasStyle = {
    width,
    height,
    backgroundColor,
    borderRadius: "4px",
  };

  const [webGLSupported, setWebGLSupported] = useState(true);

  // Check WebGL support on mount
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setWebGLSupported(!!gl);
    } catch (e) {
      setWebGLSupported(false);
    }
  }, []);

  // Determine file extension to handle different model types
  const fileExtension = modelUrl.split(".").pop()?.toLowerCase();
  const supportedFormats = ["gltf", "glb", "obj", "fbx", "stl"];

  if (!webGLSupported) {
    return (
      <div style={canvasStyle}>WebGL is not supported in your browser</div>
    );
  }

  if (!supportedFormats.includes(fileExtension || "")) {
    return <div style={canvasStyle}>Unsupported model format</div>;
  }

  return (
    <div style={canvasStyle}>
      <ErrorBoundary
        fallback={<div>Failed to load 3D viewer. Please try again later.</div>}
      >
        <Canvas
          shadows
          dpr={[1, 1.5]} // Reduced DPR to avoid memory issues
          camera={{ fov: 45 }}
          gl={{
            powerPreference: "default",
            antialias: true,
            preserveDrawingBuffer: true,
            alpha: true,
          }}
        >
          <CameraSetup />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.6}>
              <Center>
                <Model url={modelUrl} autoRotate={autoRotate} />
              </Center>
            </Stage>
          </Suspense>
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            makeDefault
          />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

// Preload function to prevent jank when model first renders
export function preloadModel(url: string) {
  useGLTF.preload(url);
}
