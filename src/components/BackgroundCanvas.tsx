import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

// Vertex Shader: Pass position and size
const vertexShader = `
  attribute float size;
  attribute float alpha; // Dynamic alpha from CPU
  varying float vAlpha;
  
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    vAlpha = alpha;
    
    // Size attenuation
    gl_PointSize = size * (30.0 / -mvPosition.z);
  }
`;

// Fragment Shader: Soft cell blob
const fragmentShader = `
  uniform vec3 color;
  varying float vAlpha;
  
  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // Soft blurred edge with internal glow
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 0.8);
    
    gl_FragColor = vec4(color, vAlpha * glow);
  }
`;

// Core Sphere for Phase 2
// @ts-ignore
const CoreSphere = ({ stateRef }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!meshRef.current) return;

        const { phase, timer, clickPos } = stateRef.current;

        // Follow click position z=0
        meshRef.current.position.set(clickPos.x, clickPos.y, 0);

        if (phase === 'CORE') {
            meshRef.current.visible = true;
            // Scale up smoothly
            const scale = THREE.MathUtils.lerp(0, 3.5, Math.min(timer * 2.5, 1));
            meshRef.current.scale.set(scale, scale, scale);

            // Jitter for vibration at end of CORE phase
            if (timer > 0.3) {
                meshRef.current.position.x += (Math.random() - 0.5) * 0.15;
                meshRef.current.position.y += (Math.random() - 0.5) * 0.15;
            }

            (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 1.0;

        } else if (phase === 'BURST') {
            meshRef.current.visible = true;
            // Expand rapid and fade
            const scale = 3.5 + timer * 25.0;
            meshRef.current.scale.set(scale, scale, scale);
            (meshRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1.0 - timer * 4.0);
        } else {
            meshRef.current.visible = false;
        }
    });

    return (
        <mesh ref={meshRef} visible={false}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
        </mesh>
    );
};

// @ts-ignore
const Cells = ({ stateRef }) => {
    const meshRef = useRef<THREE.Points>(null);
    const shouldReduceMotion = useReducedMotion();

    // Config: Higher density
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 150 : 450;

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const homePositions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const alphas = new Float32Array(count);
        const drift = new Float32Array(count * 3); // Per-particle drift params

        for (let i = 0; i < count; i++) {
            // Spread across viewport
            const x = (Math.random() - 0.5) * 25;
            const y = (Math.random() - 0.5) * 25;
            const z = (Math.random() - 0.5) * 12;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            homePositions[i * 3] = x;
            homePositions[i * 3 + 1] = y;
            homePositions[i * 3 + 2] = z;

            sizes[i] = Math.random() * 8 + 2;
            alphas[i] = Math.random() * 0.5 + 0.3;

            // Random drift vectors
            drift[i * 3] = (Math.random() - 0.5) * 0.02;
            drift[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            drift[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
        }

        return { positions, homePositions, velocities, sizes, alphas, drift };
    }, [count]);

    useFrame((state, delta) => {
        if (!meshRef.current || shouldReduceMotion || document.hidden) return;

        const { phase, clickPos } = stateRef.current;
        const { positions, homePositions, velocities, alphas, drift } = particles;
        const attrPos = meshRef.current.geometry.attributes.position;
        const attrAlpha = meshRef.current.geometry.attributes.alpha;

        const dt = Math.min(delta, 0.1);
        stateRef.current.timer += dt;
        const timer = stateRef.current.timer;

        // --- STATE MACHINE TRANSITIONS ---
        // GATHER (1.2s) -> CORE (0.5s) -> BURST (0.5s) -> RESET

        if (phase === 'GATHER' && timer > 2.45) { // Reduced gather time as requested
            stateRef.current.phase = 'CORE';
            stateRef.current.timer = 0;
        } else if (phase === 'CORE' && timer > 0.5) {
            stateRef.current.phase = 'BURST';
            stateRef.current.timer = 0;
        } else if (phase === 'BURST' && timer > 0.5) {
            stateRef.current.phase = 'RESET';
            stateRef.current.timer = 0;
            // Init REFILL
            for (let i = 0; i < count; i++) {
                const ix = i * 3;
                // Pick side for refill
                const side = homePositions[ix] > 0 ? 1 : -1;
                const startX = side * (20 + Math.random() * 5);

                positions[ix] = startX;
                positions[ix + 1] = homePositions[ix + 1] + (Math.random() - 0.5) * 15;
                positions[ix + 2] = homePositions[ix + 2];

                velocities[ix] = -side * (Math.random() * 10 + 5);
                velocities[ix + 1] = (Math.random() - 0.5) * 2;
                velocities[ix + 2] = 0;
                alphas[i] = 0; // Fade in
            }
        } else if (phase === 'RESET' && timer > 1.2) {
            stateRef.current.phase = 'IDLE';
        }

        // --- UPDATE LOOP ---
        for (let i = 0; i < count; i++) {
            const ix = i * 3;

            if (phase === 'IDLE') {
                // Drift
                positions[ix] += drift[ix] + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002;
                positions[ix + 1] += drift[ix + 1] + Math.cos(state.clock.elapsedTime * 0.3 + i) * 0.002;
                positions[ix + 2] += drift[ix + 2];
                // Wrap
                if (positions[ix] > 25) positions[ix] = -25;
                if (positions[ix] < -25) positions[ix] = 25;
                // Alpha restore
                alphas[i] = THREE.MathUtils.lerp(alphas[i], 0.6, 0.02);

            } else if (phase === 'GATHER') {
                // Critical Damping Physics
                const dx = clickPos.x - positions[ix];
                const dy = clickPos.y - positions[ix + 1];
                const dz = 0 - positions[ix + 2]; // Force Z to 0 plane
                const distSq = dx * dx + dy * dy + dz * dz;
                const dist = Math.sqrt(distSq);

                // Increased Snap Radius to 1.5 to catch them
                if (dist < 1.5) {
                    // SNAP
                    positions[ix] = clickPos.x;
                    positions[ix + 1] = clickPos.y;
                    positions[ix + 2] = 0;
                    velocities[ix] = 0;
                    velocities[ix + 1] = 0;
                    velocities[ix + 2] = 0;
                    alphas[i] = 0; // Hide as it merges into core
                } else {
                    // Strong Pull + Damping
                    const GRAVITY_STRENGTH = 80.0; // Higher force
                    const DAMPING = 0.82; // Strong damping

                    velocities[ix] += (dx / dist) * GRAVITY_STRENGTH * dt;
                    velocities[ix + 1] += (dy / dist) * GRAVITY_STRENGTH * dt;
                    velocities[ix + 2] += (dz / dist) * GRAVITY_STRENGTH * dt;

                    velocities[ix] *= DAMPING;
                    velocities[ix + 1] *= DAMPING;
                    velocities[ix + 2] *= DAMPING;

                    positions[ix] += velocities[ix] * dt;
                    positions[ix + 1] += velocities[ix + 1] * dt;
                    positions[ix + 2] += velocities[ix + 2] * dt;

                    alphas[i] = THREE.MathUtils.lerp(alphas[i], 1.0, 0.1);
                }

            } else if (phase === 'CORE') {
                // Keep Snapped
                positions[ix] = clickPos.x;
                positions[ix + 1] = clickPos.y;
                positions[ix + 2] = 0;
                alphas[i] = 0; // Hidden, CoreMesh is visible

            } else if (phase === 'BURST') {
                // First frame of burst logic
                if (timer < dt * 2 && alphas[i] === 0) {
                    // Explode outwards from center
                    const theta = Math.random() * Math.PI * 2;
                    const phi = (Math.random() - 0.5) * Math.PI; // Full sphere
                    const speed = 25 + Math.random() * 20; // Fast burst

                    velocities[ix] = Math.cos(theta) * Math.cos(phi) * speed;
                    velocities[ix + 1] = Math.sin(theta) * Math.cos(phi) * speed;
                    velocities[ix + 2] = Math.sin(phi) * speed;

                    // Start slightly off center
                    positions[ix] = clickPos.x + velocities[ix] * 0.05;
                    positions[ix + 1] = clickPos.y + velocities[ix + 1] * 0.05;
                    positions[ix + 2] = 0 + velocities[ix + 2] * 0.05;
                    alphas[i] = 1; // Flash visible
                }

                positions[ix] += velocities[ix] * dt;
                positions[ix + 1] += velocities[ix + 1] * dt;
                positions[ix + 2] += velocities[ix + 2] * dt;

                velocities[ix] *= 0.92;
                velocities[ix + 1] *= 0.92;
                velocities[ix + 2] *= 0.92;
                alphas[i] *= 0.9; // Fade out trail

            } else if (phase === 'RESET') {
                // Physics Move
                velocities[ix] *= 0.95;
                velocities[ix + 1] *= 0.95;
                velocities[ix + 2] *= 0.95;

                positions[ix] += velocities[ix] * dt;
                positions[ix + 1] += velocities[ix + 1] * dt;
                positions[ix + 2] += velocities[ix + 2] * dt;

                // Lerp to home
                const lerpFactor = 0.05;
                positions[ix] = THREE.MathUtils.lerp(positions[ix], homePositions[ix], lerpFactor);
                positions[ix + 1] = THREE.MathUtils.lerp(positions[ix + 1], homePositions[ix + 1], lerpFactor);
                positions[ix + 2] = THREE.MathUtils.lerp(positions[ix + 2], homePositions[ix + 2], lerpFactor);

                alphas[i] = THREE.MathUtils.lerp(alphas[i], 0.6, 0.05);
            }
        }

        attrPos.needsUpdate = true;
        attrAlpha.needsUpdate = true;
    });

    const uniforms = useMemo(() => ({
        color: { value: new THREE.Color('#00ffe0') },
    }), []);

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particles.positions}
                    itemSize={3}
                    args={[particles.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={count}
                    array={particles.sizes}
                    itemSize={1}
                    args={[particles.sizes, 1]}
                />
                <bufferAttribute
                    attach="attributes-alpha"
                    count={count}
                    array={particles.alphas}
                    itemSize={1}
                    args={[particles.alphas, 1]}
                />
            </bufferGeometry>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const BackgroundCanvas: React.FC = () => {
    const shouldReduceMotion = useReducedMotion();
    const stateRef = useRef({
        phase: 'IDLE',
        timer: 0,
        clickPos: new THREE.Vector3(),
    });

    useEffect(() => {
        if (shouldReduceMotion) return;

        const handlePointerDown = (e: PointerEvent) => {
            if (stateRef.current.phase !== 'IDLE') return; // Cooldown

            // Normalize click to -1..1 clip space, then unproject to ~z=0 world space
            // Assuming camera at z=5 looking at 0,0,0
            // Simple approximation: map screen coords to world coords at z=0
            const vec = new THREE.Vector3(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1,
                0.5
            );

            // Unproject approximation (Perspective Camera fov 60, z=5)
            // Visible height at z=0 is approx 2 * 5 * tan(30deg) ~= 5.77 * 2 = 11.5
            // Visible width depends on aspect.
            const aspect = window.innerWidth / window.innerHeight;
            const visibleHeight = 11.5;
            const visibleWidth = visibleHeight * aspect;

            stateRef.current.clickPos.set(
                vec.x * (visibleWidth / 2),
                vec.y * (visibleHeight / 2),
                0 // Target Z plane
            );

            stateRef.current.phase = 'GATHER';
            stateRef.current.timer = 0;
        };

        window.addEventListener('pointerdown', handlePointerDown);
        return () => window.removeEventListener('pointerdown', handlePointerDown);
    }, [shouldReduceMotion]);

    if (shouldReduceMotion) {
        return <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            background: 'var(--color-bg-deep)',
            zIndex: -1
        }} />;
    }

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]} // Optimization
            >
                <Cells stateRef={stateRef} />
                <CoreSphere stateRef={stateRef} />
            </Canvas>
        </div>
    );
};

export default BackgroundCanvas;
