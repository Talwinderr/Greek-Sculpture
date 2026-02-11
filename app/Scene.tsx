import {
	Canvas,
	type CanvasProps,
	extend,
	applyProps,
	type ThreeElements,
	useThree,
	useFrame
} from '@react-three/fiber'
import { Mesh, Group, MeshStandardMaterial, TorusGeometry, PointLight, CanvasTexture } from 'three'
import { OrbitControls, Torus, useGLTF, Environment } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { useRef } from 'react'
import { motion } from 'framer-motion-3d'
import { expoOut, type MotionVector3, type MotionVector3Tuple } from '@/utils/motion'
import { useControls } from 'leva'
import useMergedProgress from '@/hooks/useMergedProgress'

extend({
	Mesh,
	Group,
	PointLight,
	TorusGeometry,
	CanvasTexture,
	MeshStandardMaterial
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
	// const { control } = useControls({ control: false })

	return (
		<Canvas {...props} camera={{ position: [20, 0, -5], fov: 8 }}>
			{/* {!control && ( */}
			<CameraRig
				cameraLookAt={cameraLookAt}
				cameraPosition={cameraPosition}
				floatIntensity={floatIntensity}
				floatSpeed={floatSpeed}
			/>
			{/* )} */}
			<RadialGradientTexture
				attach="background"
				stops={stops}
				colors={colors} // Colors need to match the number of stops
				radius={614}
				gradientCenter={[814, 400]}
				size={1024}
			/>
			<Environment preset="studio" />
			<Light />
			<motion.group
				initial={{ y: -3 }}
				animate={{ y: 0 }}
				transition={{ type: "spring", duration: 0.9, bounce: 0 }}
			>
				<Venus position={[0, -2.3, 0]} rotation-y={0.45} />
				<pointLight position={[0, 0, -2]} decay={0.5} intensity={2} />
			</motion.group>
			<Effects />
			{/* {control && (
				<OrbitControls
					// @ts-expect-error weird type issue
					onChange={(event) => {
						console.log(event.target.object)
					}}
				/>
			)} */}
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
		camera.position.set(
			cameraPosition[0].get() + Math.sin(t * floatSpeed) * floatIntensity[0].get(),
			cameraPosition[1].get() + Math.sin(t * floatSpeed) * floatIntensity[1].get(),
			cameraPosition[2].get() + Math.sin(t * floatSpeed) * floatIntensity[2].get()
		)
		camera.lookAt(cameraLookAt[0].get(), cameraLookAt[1].get(), cameraLookAt[2].get())
	})

	return null
}

function Effects() {
	const { scene, camera, gl } = useThree()

	if (!scene || !camera || !gl) return null

	return (
		<EffectComposer multisampling={0} enableNormalPass={false}>
			<Bloom mipmapBlur intensity={0.25} />
			<Noise opacity={0.025} />
			<Vignette offset={0} darkness={0.75} />
		</EffectComposer>
	)
}

// Light/loader
function Light() {
	const ref = useRef<Mesh>(null)

	// Triggers a React warning:
	// https://github.com/pmndrs/drei/issues/314
	const progress = useMergedProgress(2)

	return (
		<Torus
			args={[1, 0.075, 12, 48, Math.PI * 2 * (progress / 100)]}
			ref={ref}
			rotation={[Math.PI + 0.2, 0, Math.PI]} // flip it for a more normal loading animation
			position={[-0.25, -0.125, -2.5]}
		>
			<meshStandardMaterial emissive={'#fff'} emissiveIntensity={1.5} />
		</Torus>
	)
}

/**
 * "Venus de Milo" (https://skfb.ly/oDLJZ) by Nancy/Lanzi Luo is licensed under
 * Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
 *
 * Converted with https://github.com/pmndrs/gltfjsx
 */
type GLTFResult = GLTF & {
	nodes: {
		Object_2: Mesh
	}
	materials: {
		['Scene_-_Root']: MeshStandardMaterial
	}
}

function Venus(props: ThreeElements['group']) {
	const { nodes, materials } = useGLTF('/statue_v2.glb') as GLTFResult

	applyProps(materials['Scene_-_Root'], {
		color: '#030303',
		roughness: 0.4,
		metalness: 0.5
	})
	return (
		<group {...props} dispose={null}>
			<mesh
				receiveShadow
				castShadow
				scale={0.015}
				position={[0.5, 5.66, 6.75]}
				geometry={nodes.Object_2.geometry}
				material={materials['Scene_-_Root']}
				rotation={[-0.5, 0, Math.PI / 2 + 0.1]}
			/>
		</group>
	)
}

useGLTF.preload('/statue_v2.glb')

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

	return <canvasTexture args={[canvas]} colorSpace={gl.outputColorSpace} attach="map" {...props} />
}
