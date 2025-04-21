import ModelViewer from "./ModelViewer";

interface ModelViewerWrapperProps {
  modelUrl: string;
  thumbnailMode?: boolean;
  width?: string;
  height?: string;
}

// This wrapper component is used to expose the ModelViewer to Astro
export default function ModelViewerWrapper({
  modelUrl,
  thumbnailMode = false,
  width = "100%",
  height = "100%",
}: ModelViewerWrapperProps) {
  // For thumbnails, we disable auto-rotation to save resources
  return (
    <ModelViewer
      modelUrl={modelUrl}
      width={width}
      height={height}
      autoRotate={!thumbnailMode}
      backgroundColor={thumbnailMode ? "transparent" : "#181818"}
    />
  );
}
