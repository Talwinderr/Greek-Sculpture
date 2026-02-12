import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { useGLTF, Environment, Torus } from '@react-three/drei'
import { Mesh, Group, MeshStandardMaterial, TorusGeometry, PointLight, AmbientLight, DirectionalLight } from 'three'
import { useRef } from 'react'
import { motion } from 'framer-motion-3d' 
import useMergedProgress from '@/hooks/useMergedProgress'

// Register elements
extend({ Mesh, Group, MeshStandardMaterial, TorusGeometry, PointLight, AmbientLight, DirectionalLight })

export default function Scene({ cameraPosition, cameraLookAt, floatIntensity, floatSpeed, ...props }) {
  return (
    <Canvas {...props} shadows={false} camera={{ position: [20, 0, -5], fov: 35 }}>
      <CameraRig cameraPosition={cameraPosition} cameraLookAt={cameraLookAt} floatIntensity={floatIntensity} floatSpeed={floatSpeed} />
      
      {/* Lighting */}
      <ambientLight intensity={3} />
      <directionalLight position={[-5, 5, 5]} intensity={2} color="white" />
      <directionalLight position={[5, 5, -5]} intensity={2} color="#ff0000" /> {/* Red rim light for drama */}

      <Environment preset="city" />
      
      {/* The Statue */}
      <Venus />
      
      {/* Loading Spinner */}
      <Light />
    </Canvas>
  )
}

function Venus(props) {
  // Ensure this path matches your file exactly
  const { nodes, materials } = useGLTF('/sculpture.glb')
  
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_2.geometry}
        material={materials['Scene_-_Root']}
        rotation={[-Math.PI / 2, 0, 0]} // Standard upright rotation for GLB
        scale={0.015} // Original scale
        position={[0, -2, 0]} // Lower it slightly
      />
    </group>
  )
}

useGLTF.preload('/sculpture.glb')

function CameraRig({ cameraPosition, cameraLookAt, floatIntensity, floatSpeed = 0.5 }) {
    useFrame(({ camera, clock }) => {
        const t = clock.getElapsedTime()
        // If the motion values aren't ready, use defaults
        const px = cameraPosition?.[0]?.get() || 0
        const py = cameraPosition?.[1]?.get() || 0
        const pz = cameraPosition?.[2]?.get() || 5
        
        camera.position.x = px + Math.sin(t * floatSpeed) * (floatIntensity?.[0]?.get() || 0)
        camera.position.y = py + Math.sin(t * floatSpeed) * (floatIntensity?.[1]?.get() || 0)
        camera.position.z = pz + Math.sin(t * floatSpeed) * (floatIntensity?.[2]?.get() || 0)
        
        camera.lookAt(0, 0, 0)
    })
    return null
}

function Light() {
  const ref = useRef()
  const progress = useMergedProgress(2)
  return (
    <Torus args={[1, 0.05, 16, 100]} ref={ref} position={[0,0,-2]} rotation={[0,0, progress / 10]}>
       <meshBasicMaterial color="white" />
    </Torus>
  )
}