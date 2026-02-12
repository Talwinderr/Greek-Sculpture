import {
	Canvas,
	extend,
	type CanvasProps,
} from '@react-three/fiber'
import { 
	Mesh, 
	Group, 
	MeshStandardMaterial, 
	BoxGeometry,
	AmbientLight, 
	DirectionalLight,
	PointLight 
} from 'three'
import { Environment, useGLTF } from '@react-three/drei'
import { type MotionVector3Tuple } from '@/utils/motion'
import { useFrame } from '@react-three/fiber'

// Register elements so React knows they exist
extend({
	Mesh,
	Group,
	MeshStandardMaterial,
	BoxGeometry,
	AmbientLight, 
	DirectionalLight,
	PointLight
})

export default function Scene({
	cameraPosition,
	cameraLookAt,
	floatIntensity,
	floatSpeed,
	...props
}: CameraRigProps & Omit<CanvasProps, 'children'>) {
	return (
		<Canvas {...props} shadows={false} camera={{ position: [0, 0, 5], fov: 50 }}>
			<ambientLight intensity={3} />
			<directionalLight position={[5, 5, 5]} intensity={2} />
			<pointLight position={[0, 0, 5]} intensity={5} color="white" />
			
			<CameraRig
				cameraLookAt={cameraLookAt}
				cameraPosition={cameraPosition}
				floatIntensity={floatIntensity}
				floatSpeed={floatSpeed}
			/>

			{/* TEST OBJECT: A Simple Red Box */}
			{/* If you see this, the 3D engine works. */}
			<Venus />
			
			<Environment preset="city" />
		</Canvas>
	)
}

function Venus(props: any) {
    // We are temporarily using a box to prove the code works
	return (
		<group {...props} dispose={null}>
			<mesh rotation={[0.5, 0.5, 0]}>
				<boxGeometry args={[2, 2, 2]} />
				<meshStandardMaterial color="red" />
			</mesh>
		</group>
	)
}

// We still preload the statue so it's ready for the swap next step
useGLTF.preload('/sculpture.glb')

// --- Camera Logic ---
type CameraRigProps = {
	cameraPosition: MotionVector3Tuple
	cameraLookAt: MotionVector3Tuple
	floatIntensity: MotionVector3Tuple
	floatSpeed?: number
}

function CameraRig({
	cameraPosition,
	cameraLookAt,
	floatIntensity,
	floatSpeed = 0.5
}: CameraRigProps) {
	useFrame(({ camera, clock }) => {
		const t = clock.getElapsedTime()
		// Default values to prevent crashes if props are missing
		const px = cameraPosition?.[0]?.get?.() ?? 0
		const py = cameraPosition?.[1]?.get?.() ?? 0
		const pz = cameraPosition?.[2]?.get?.() ?? 5
		
		camera.position.set(
			px,
			py,
			pz
		)
		// Simple lookAt
		camera.lookAt(0, 0, 0)
	})
	return null
}