import {
	Canvas,
	type CanvasProps,
	extend,
	applyProps,
	type ThreeElements,
	useThree,
	useFrame
} from '@react-three/fiber'
import { 
	Mesh, 
	Group, 
	MeshStandardMaterial, 
	TorusGeometry, 
	PointLight, 
	CanvasTexture,
	AmbientLight,
	DirectionalLight 
} from 'three'
import { OrbitControls, Torus, useGLTF, Environment } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import { useRef } from 'react'
import { type MotionVector3Tuple } from '@/utils/motion'
import useMergedProgress from '@/hooks/useMergedProgress'

// Register all elements to prevent "namespace" errors
extend({
	Mesh,
	Group,
	PointLight,
	TorusGeometry,
	CanvasTexture,
	MeshStandardMaterial,
	AmbientLight,
	DirectionalLight
})

// Eased:
// prettier-ignore
const colors = ['#1f2022', '#1f2022', '#1e1f21', '#1d1d1f', '#1b1c1d', '#19191b', '#161718', '#131415', '#101112', '#0d0d0e', '#0a0a0a', '#070707', '#050505']
// prettier-ignore
const stops = [0, 0.1, .1907, .2744, .3526, 0.4272, 0.50, 0.5728, 0.6474, 0.7256, 0.8093, 0.9001, 1]

export default function Scene({
	cameraPosition,
	cameraLookAt,
	floatIntensity,
	floatSpeed,
	...props
}: CameraRigProps & Omit<CanvasProps, 'children'>) {
	return (
		<Canvas {...props} shadows={false} camera={{ position: [20, 0, -5], fov: 8 }}>
			<CameraRig
				cameraLookAt={cameraLookAt}
				cameraPosition={cameraPosition}
				floatIntensity={floatIntensity}
				floatSpeed={floatSpeed}
			/>
			<RadialGradientTexture
				attach="background"
				stops={stops}
				colors={colors}
				radius={614}
				gradientCenter={[814, 400]}
				size={1024}
			/>
			<Environment preset="studio" />
			
			{/* High intensity lights to ensure visibility */}
			<ambientLight intensity={5} />
			<directionalLight position={[5, 5, 5]} intensity={2} />
			
			<Light />
			<group>
				{/* Statue is set to Hot Pink for visibility */}
				<Venus position={[0, -1, 0]} rotation-y={0.45} />
				<pointLight position={[0, 0, -2]} decay={0.5} intensity={2} />
			</group>
		</Canvas>
	)
}

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
		// Safe access to .get() to prevent crashes
		const px = cameraPosition?.[0]?.get?.() || 20
		const py = cameraPosition?.[1]?.get?.() || 0
		const pz = cameraPosition?.[2]?.get?.() || -5
		
		const ix = floatIntensity?.[0]?.get?.() || 0
		const iy = floatIntensity?.[1]?.get?.() || 0
		const iz = floatIntensity?.[2]?.get?.() || 0

		const lx = cameraLookAt?.[0]?.get?.() || 0
		const ly = cameraLookAt?.[1]?.get?.() || 0
		const lz = cameraLookAt?.[2]?.get?.() || 0

		camera.position.set(
			px + Math.sin(t * floatSpeed) * ix,
			py + Math.sin(t * floatSpeed) * iy,
			pz + Math.sin(t * floatSpeed) * iz
		)
		camera.lookAt(lx, ly, lz)
	})

	return null
}

function Light() {
	const ref = useRef<Mesh>(null)
	const progress = useMergedProgress(2)

	return (
		<Torus
			args={[1, 0.075, 12, 48, Math.PI * 2 * (progress / 100)]}
			ref={ref}
			rotation={[Math.PI + 0.2, 0, Math.PI]}
			position={[-0.25, -0.125, -2.5]}
		>
			<meshStandardMaterial emissive={'#fff'} emissiveIntensity={1.5} />
		</Torus>
	)
}

type GLTFResult = GLTF & {
	nodes: {
		Object_2: Mesh
	}
	materials: {
		['Scene_-_Root']: MeshStandardMaterial
	}
}

function Venus(props: ThreeElements['group']) {
	const { nodes, materials } = useGLTF('/sculpture.glb') as GLTFResult

	console.log('Sculpture nodes:', nodes)

    // Force Pink Color
	if (materials['Scene_-_Root']) {
		applyProps(materials['Scene_-_Root'], {
			color: 'hotpink',
			roughness: 0.4,
			metalness: 0.5
		})
	}

	return (
		<group {...props} dispose={null}>
			<mesh
				scale={0.015}
				position={[0, -1, 0]}
				geometry={nodes.Object_2.geometry}
				material={materials['Scene_-_Root']}
				rotation={[-0.5, 0, Math.PI / 2 + 0.1]}
			/>
		</group>
	)
}

useGLTF.preload('/sculpture.glb')

type RadialGradientTextureProps = Omit<ThreeElements['canvasTexture'], 'args'> & {
	stops: Array<number>
	colors: Array<string>
	size?: number
	width?: number
	gradientCenter?: [x: number, y: number]
	radius?: number
}

function RadialGradientTexture({
	stops,
	colors,
	size = 1024,
	gradientCenter: [cx, cy] = [512, 512],
	radius = 512,
	...props
}: RadialGradientTextureProps) {
	const gl = useThree((state) => state.gl)

	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')!
	canvas.width = canvas.height = size

	const gradient = context.createRadialGradient(cx, cy, 0, cx, cy, radius)
	stops.forEach((stop, i) => {
		gradient.addColorStop(stop, colors[i])
	})

	context.save()
	context.fillStyle = gradient
	context.fillRect(0, 0, size, size)
	context.restore()

	return <canvasTexture args={[canvas]} attach="map" {...props} />
}