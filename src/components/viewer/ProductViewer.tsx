import { OrbitControls, Stage } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
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

export function ProductViewer({ product, cameraPosition }: ProductViewerProps) {
  const key = useMemo(() => `${product.id}-${cameraPosition.join(':')}`, [cameraPosition, product.id])

  return (
    <div className="viewer">
      <Canvas shadows camera={{ position: cameraPosition, fov: 42 }} key={key}>
        <color attach="background" args={['#f8fafc']} />
        <ambientLight intensity={0.4} />
        <Stage shadows={{ type: 'contact', opacity: 0.2, blur: 2.2 }} intensity={0.6} adjustCamera={false}>
          <PlaceholderFurniture />
        </Stage>
        <OrbitControls enablePan enableZoom minDistance={2.2} maxDistance={9} />
      </Canvas>
      <p className="hint">
        Placeholder mesh is active. Swap in a GLTF loader tied to <code>product.modelUrl</code> once
        Firebase Storage is connected.
      </p>
    </div>
  )
}

