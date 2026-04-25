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
    onError: (error: unknown) => void
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

  componentDidCatch(error: unknown) {
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

const toLoadErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'then' in error && typeof (error as { then?: unknown }).then === 'function') {
    return ''
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const maybeMessage = (error as { message?: unknown }).message
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
      return maybeMessage
    }
  }
  return 'Unable to load this 3D model.'
}

export function ProductViewer({ product, cameraPosition }: ProductViewerProps) {
  const modelUrl = product.modelUrl?.trim() ?? ''
  const hasModelUrl = Boolean(modelUrl)
  const modelIdentity = `${product.id}:${modelUrl}`
  const [retryNonce, setRetryNonce] = useState(0)
  const [failedModel, setFailedModel] = useState<{ identity: string; message: string } | null>(null)
  const hasModelError = failedModel?.identity === modelIdentity

  const handleModelError = (error: unknown) => {
    const message = toLoadErrorMessage(error)
    if (!message) {
      return
    }
    useGLTF.clear(modelUrl)
    setFailedModel({ identity: modelIdentity, message })
  }

  const retryModelLoad = () => {
    useGLTF.clear(modelUrl)
    setFailedModel(null)
    setRetryNonce((value) => value + 1)
  }

  const hintText = useMemo(() => {
    if (hasModelError) {
      const message = failedModel?.message || 'Unable to load this 3D model.'
      return `${message} Showing placeholder mesh instead.`
    }
    if (!hasModelUrl) {
      return 'No model URL set for this product. Showing placeholder mesh.'
    }

    return 'Use the view controls to inspect the loaded model from front, side, and top angles.'
  }, [failedModel?.message, hasModelError, hasModelUrl])

  return (
    <div className="viewer">
      <Canvas shadows camera={{ position: cameraPosition, fov: 42 }}>
        <color attach="background" args={['#f8fafc']} />
        <ambientLight intensity={0.4} />
        <CameraSync cameraPosition={cameraPosition} />
        <Stage shadows={{ type: 'contact', opacity: 0.2, blur: 2.2 }} intensity={0.6} adjustCamera={false}>
          {hasModelUrl && !hasModelError ? (
            <ModelErrorBoundary onError={handleModelError} resetKey={`${modelIdentity}:${retryNonce}`}>
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
      {hasModelError ? (
        <button type="button" className="ghost" onClick={retryModelLoad}>
          Retry model load
        </button>
      ) : null}
    </div>
  )
}

