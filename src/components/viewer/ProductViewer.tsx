import { Html, OrbitControls, Stage, useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Component, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Product } from '../../domain/types'

interface ProductViewerProps {
  product: Product
  cameraPosition: [number, number, number]
}

function PlaceholderFurniture() {
  return (
    <group>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.3, 1]} />
        <meshStandardMaterial color="#e0d5c7" metalness={0.05} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.2, 0.82]} />
        <meshStandardMaterial color="#5f6d7f" metalness={0.12} roughness={0.42} />
      </mesh>
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.25, 0.25, 0.7]} />
        <meshStandardMaterial color="#a58f77" metalness={0.1} roughness={0.75} />
      </mesh>
    </group>
  )
}

function GltfModel({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl)
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  return <primitive object={clonedScene} />
}

function ModelLoadingState() {
  return (
    <Html center>
      <div className="viewer-status">Loading 3D model...</div>
    </Html>
  )
}

function CameraSync({ cameraPosition }: { cameraPosition: [number, number, number] }) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2])
    camera.lookAt(0, 0.5, 0)
    camera.updateProjectionMatrix()
  }, [camera, cameraPosition])

  return null
}

interface ModelErrorBoundaryProps {
  children: ReactNode
  onError: (error: Error) => void
  resetKey: string
}

interface ModelErrorBoundaryState {
  hasError: boolean
}

class ModelErrorBoundary extends Component<ModelErrorBoundaryProps, ModelErrorBoundaryState> {
  state: ModelErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ModelErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    this.props.onError(error)
  }

  componentDidUpdate(prevProps: ModelErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}

export function ProductViewer({ product, cameraPosition }: ProductViewerProps) {
  const modelUrl = product.modelUrl?.trim() ?? ''
  const hasModelUrl = Boolean(modelUrl)
  const modelKey = `${product.id}:${modelUrl}`
  const [failedModelKey, setFailedModelKey] = useState<string | null>(null)
  const hasModelError = failedModelKey === modelKey

  const hintText = useMemo(() => {
    if (hasModelError) {
      return 'Unable to load this 3D model. Showing placeholder mesh instead.'
    }
    if (!hasModelUrl) {
      return 'No model URL set for this product. Showing placeholder mesh.'
    }

    return 'Use the view controls to inspect the loaded model from front, side, and top angles.'
  }, [hasModelError, hasModelUrl])

  return (
    <div className="viewer">
      <Canvas shadows camera={{ position: cameraPosition, fov: 42 }}>
        <color attach="background" args={['#f8fafc']} />
        <ambientLight intensity={0.4} />
        <CameraSync cameraPosition={cameraPosition} />
        <Stage shadows={{ type: 'contact', opacity: 0.2, blur: 2.2 }} intensity={0.6} adjustCamera={false}>
          {hasModelUrl && !hasModelError ? (
            <ModelErrorBoundary
              onError={() => setFailedModelKey(modelKey)}
              resetKey={modelKey}
            >
              <Suspense fallback={<ModelLoadingState />}>
                <GltfModel modelUrl={modelUrl} />
              </Suspense>
            </ModelErrorBoundary>
          ) : (
            <PlaceholderFurniture />
          )}
        </Stage>
        <OrbitControls enablePan enableZoom minDistance={2.2} maxDistance={9} />
      </Canvas>
      <p className={hasModelError ? 'error-text' : 'hint'}>{hintText}</p>
    </div>
  )
}

