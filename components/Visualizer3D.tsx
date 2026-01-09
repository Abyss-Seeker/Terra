
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera, Icosahedron, Octahedron, Box, Sphere, TorusKnot, Torus } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration, Glitch, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { Mood } from '../types';
import { THEMES } from '../constants';

// --- THEME: WAKE / GENESIS ---
const GenesisStructure = ({ theme }) => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (outerRef.current) {
        outerRef.current.rotation.y = t * 0.1;
        outerRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
    if (innerRef.current) {
        innerRef.current.rotation.y = -t * 0.2;
        innerRef.current.rotation.z = t * 0.1;
        const s = 1 + Math.sin(t * 2) * 0.1;
        innerRef.current.scale.set(s, s, s);
    }
  });
  return (
    <group>
      <Icosahedron args={[2.5, 0]} ref={outerRef}>
        <meshBasicMaterial color={theme.primary} wireframe transparent opacity={0.3} />
      </Icosahedron>
      <Octahedron args={[1.2, 0]} ref={innerRef}>
         <meshBasicMaterial color={theme.accent} wireframe transparent opacity={0.8} />
      </Octahedron>
    </group>
  );
};

// --- THEME: ROUTINE / DRUDGE ---
// A rigid grid of rotating cubes, symbolizing cog-like behavior.
const RoutineGrid = ({ theme }) => {
    const meshRef = useRef(null);
    const count = 125; // 5x5x5
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        let i = 0;
        for (let x = -2; x <= 2; x++) {
            for (let y = -2; y <= 2; y++) {
                for (let z = -2; z <= 2; z++) {
                    dummy.position.set(x * 1.5, y * 1.5, z * 1.5);
                    // Synchronized rotation
                    dummy.rotation.x = t * 0.5;
                    dummy.rotation.y = t * 0.5;
                    dummy.updateMatrix();
                    meshRef.current.setMatrixAt(i++, dummy.matrix);
                }
            }
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshBasicMaterial color={theme.primary} wireframe transparent opacity={0.4} />
        </instancedMesh>
    );
}

// --- THEME: DYSTOPIA ---
// Looming, dark monoliths moving slowly.
const DystopianCity = ({ theme }) => {
    const groupRef = useRef(null);
    const buildings = useMemo(() => {
        const arr = [];
        for(let i=0; i<20; i++) {
            arr.push({
                scale: [1 + Math.random(), 5 + Math.random() * 10, 1 + Math.random()],
                pos: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10 - 5],
                speed: (Math.random() * 0.2) + 0.1
            })
        }
        return arr;
    }, []);

    useFrame((state) => {
        if(!groupRef.current) return;
        groupRef.current.position.z += 0.02; // Slow flyover
    });

    return (
        <group ref={groupRef} rotation={[0, 0, 0]}>
            {buildings.map((b, i) => (
                <mesh key={i} position={b.pos} scale={b.scale}>
                    <boxGeometry />
                    <meshStandardMaterial color="#050505" roughness={0.9} />
                    <meshBasicMaterial attach="material-1" color={theme.primary} /> {/* Emissive sides trick? No, simple box */}
                    {/* Add glowing windows via wireframe child */}
                    <lineSegments>
                        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
                        <lineBasicMaterial color={theme.primary} opacity={0.1} transparent />
                    </lineSegments>
                </mesh>
            ))}
            <fog attach="fog" args={[theme.fog, 0, 15]} />
        </group>
    )
}

// --- THEME: SCHADENFREUDE ---
// Exploding sharp shards.
const SchadenfreudeFracture = ({ theme }) => {
    const meshRef = useRef(null);
    const count = 60;
    
    useFrame((state) => {
        if(!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.x = t * 0.2;
        meshRef.current.rotation.y = t * 0.8;
    });

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
             const r = 3;
             const theta = Math.random() * Math.PI * 2;
             const phi = Math.acos(2 * Math.random() - 1);
             const x = r * Math.sin(phi) * Math.cos(theta);
             const y = r * Math.sin(phi) * Math.sin(theta);
             const z = r * Math.cos(phi);
             temp.push({ pos: [x,y,z], rot: [Math.random()*3, Math.random()*3, 0] });
        }
        return temp;
    }, []);

    return (
        <group ref={meshRef}>
            {particles.map((p, i) => (
                <Float key={i} speed={5} rotationIntensity={2} floatIntensity={2} position={p.pos}>
                    <mesh rotation={p.rot}>
                        <tetrahedronGeometry args={[0.3, 0]} />
                        <meshBasicMaterial color={theme.primary} wireframe />
                    </mesh>
                </Float>
            ))}
             <mesh>
                <icosahedronGeometry args={[1, 0]} />
                <meshBasicMaterial color="#000000" />
                <meshBasicMaterial color={theme.accent} wireframe />
            </mesh>
        </group>
    )
}

// --- THEME: NARCISSISM ---
// A central object surrounded by mirroring satellites.
const NarcissusCore = ({ theme }) => {
    const groupRef = useRef(null);
    useFrame((state) => {
        if(groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });
    
    return (
        <group ref={groupRef}>
            {/* Center Self */}
            <mesh>
                <octahedronGeometry args={[1.5, 0]} />
                <meshStandardMaterial color={theme.primary} emissive={theme.primary} emissiveIntensity={0.5} roughness={0} metalness={1} />
            </mesh>
            {/* Mirrors */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <group key={i} rotation={[0, (i / 6) * Math.PI * 2, 0]}>
                    <mesh position={[3, 0, 0]} rotation={[0, 0, Math.PI/4]}>
                         <planeGeometry args={[1.5, 2.5]} />
                         <meshStandardMaterial color={theme.accent} roughness={0} metalness={0.8} side={THREE.DoubleSide} transparent opacity={0.3} />
                         <lineSegments>
                             <edgesGeometry args={[new THREE.PlaneGeometry(1.5, 2.5)]} />
                             <lineBasicMaterial color={theme.primary} />
                         </lineSegments>
                    </mesh>
                </group>
            ))}
        </group>
    )
}

// --- THEME: UTOPIA ---
// Perfect, sterile spheres in harmony.
const UtopianHarmony = ({ theme }) => {
    const groupRef = useRef(null);
    useFrame((state) => {
        if(groupRef.current) {
            groupRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
             <mesh>
                 <sphereGeometry args={[1.5, 64, 64]} />
                 <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.5} />
             </mesh>
             {/* Orbiting Ring */}
             <mesh rotation={[Math.PI/2, 0, 0]}>
                 <torusGeometry args={[3, 0.05, 16, 100]} />
                 <meshBasicMaterial color={theme.accent} />
             </mesh>
             {/* Satellites */}
             {[0, 1, 2].map(i => (
                 <mesh key={i} rotation={[0, 0, (i/3)*Math.PI*2]} position={[3 * Math.cos((i/3)*Math.PI*2), 3 * Math.sin((i/3)*Math.PI*2), 0]}>
                     <sphereGeometry args={[0.3, 32, 32]} />
                     <meshStandardMaterial color={theme.primary} emissive={theme.primary} emissiveIntensity={0.8} />
                 </mesh>
             ))}
             <ambientLight intensity={1} />
        </group>
    )
}

// --- THEME: MYOPIC ---
// Tunnel vision, focus on center, blur edges.
const MyopicTunnel = ({ theme }) => {
    const count = 20;
    const groupRef = useRef(null);
    
    useFrame((state) => {
        if(!groupRef.current) return;
        const t = state.clock.getElapsedTime();
        // Move rings towards camera
        groupRef.current.children.forEach((child, i) => {
             const z = (child.position.z + t * 2) % 20;
             child.position.z = z - 10;
             child.scale.setScalar(1 - (z/20)); // Shrink as they get closer/fade
             child.material.opacity = Math.max(0, z / 10);
        });
    });

    return (
        <group ref={groupRef}>
            {new Array(count).fill(0).map((_, i) => (
                <mesh key={i} position={[0, 0, -i]}>
                    <ringGeometry args={[0.5, 0.6, 32]} />
                    <meshBasicMaterial color={theme.primary} transparent />
                </mesh>
            ))}
        </group>
    )
}


// --- EXISTING THEMES (Kept for compatibility/completeness) ---
const GlitchSpikes = ({ theme }) => {
    const meshRef = useRef(null);
    const count = 40;
    const spikes = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            const r = 0.5; 
            const x = r * Math.cos(theta) * Math.sin(phi);
            const y = r * Math.sin(theta) * Math.sin(phi);
            const z = r * Math.cos(phi);
            const lookAt = new THREE.Vector3(x, y, z).normalize();
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), lookAt);
            temp.push({ pos: [x, y, z], rot: new THREE.Euler().setFromQuaternion(quaternion) });
        }
        return temp;
    }, []);

    useFrame((state) => {
        if(!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.y = t * 0.5;
        meshRef.current.rotation.z = Math.sin(t * 10) * 0.05; 
    });

    return (
        <group ref={meshRef}>
            {spikes.map((s, i) => (
                <group key={i} position={s.pos} rotation={s.rot}>
                    <mesh position={[0, 1.5, 0]}>
                        <coneGeometry args={[0.05, 3, 4]} />
                        <meshStandardMaterial color={0x000000} emissive={theme.primary} emissiveIntensity={2} roughness={0.2} />
                    </mesh>
                </group>
            ))}
            <pointLight color={theme.primary} intensity={5} distance={5} />
        </group>
    )
}

const NeuralLattice = ({ theme }) => {
    const meshRef = useRef(null);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if(meshRef.current) {
            meshRef.current.rotation.x = t * 0.1;
            meshRef.current.rotation.y = t * 0.05;
        }
    });
    return (
        <group>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <TorusKnot args={[1.5, 0.4, 128, 16, 2, 3]} ref={meshRef}>
                    <meshBasicMaterial color={theme.primary} wireframe transparent opacity={0.15} />
                </TorusKnot>
            </Float>
            <PointsSphere count={100} color={theme.accent} radius={2} />
        </group>
    )
}

const SeraphimEngine = ({ theme }) => {
    const groupRef = useRef(null);
    useFrame((state) => {
        if(!groupRef.current) return;
        groupRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    });
    return (
        <group ref={groupRef}>
             <RotatingRing radius={2.5} tube={0.02} speed={0.2} axis="x" color={theme.primary} />
             <RotatingRing radius={2.3} tube={0.02} speed={0.3} axis="y" color={theme.primary} />
             <RotatingRing radius={2.1} tube={0.02} speed={0.4} axis="z" color={theme.primary} />
             <RotatingRing radius={1.5} tube={0.05} speed={0.1} axis="x" color={theme.accent} />
             <mesh>
                 <octahedronGeometry args={[0.8, 0]} />
                 <meshBasicMaterial color={theme.accent} />
             </mesh>
             <pointLight color={theme.primary} intensity={8} distance={10} />
        </group>
    )
}
const RotatingRing = ({ radius, tube, speed, axis, color }) => {
    const ref = useRef(null);
    useFrame((state) => {
        if(ref.current) {
            const t = state.clock.getElapsedTime();
            if(axis === 'x') ref.current.rotation.x = t * speed;
            if(axis === 'y') ref.current.rotation.y = t * speed;
            if(axis === 'z') ref.current.rotation.z = t * speed;
        }
    })
    return (
        <mesh ref={ref}>
            <torusGeometry args={[radius, tube, 16, 100]} />
            <meshBasicMaterial color={color} />
        </mesh>
    )
}

const Singularity = ({ theme }) => {
    const particlesRef = useRef(null);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if(particlesRef.current) {
            particlesRef.current.rotation.y = t * 0.2; 
        }
    });
    return (
        <group>
            <mesh>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.2, 0.05, 16, 100]} />
                <meshBasicMaterial color={theme.primary} transparent opacity={0.5} />
            </mesh>
            <group ref={particlesRef}>
                <PointsSphere count={400} color={theme.primary} radius={3.5} />
            </group>
        </group>
    )
}

const OrganicHelix = ({ theme }) => {
    const groupRef = useRef(null);
    const count = 100;
    const points = useMemo(() => {
        const temp = [];
        for(let i=0; i<count; i++) {
            const t = (i / count) * Math.PI * 4; 
            const x = Math.cos(t) * 1.5;
            const z = Math.sin(t) * 1.5;
            const y = (i / count) * 6 - 3;
            temp.push({ pos: [x, y, z], color: theme.primary }); 
            temp.push({ pos: [-x, y, -z], color: theme.accent }); 
        }
        return temp;
    }, [theme]);

    useFrame((state) => {
        if(groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
        }
    });

    return (
        <group ref={groupRef} rotation={[0, 0, Math.PI / 4]}>
            {points.map((p, i) => (
                <mesh key={i} position={p.pos}>
                    <sphereGeometry args={[0.08, 8, 8]} />
                    <meshBasicMaterial color={p.color} />
                </mesh>
            ))}
        </group>
    )
}

const PointsSphere = ({ count, color, radius }) => {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for(let i=0; i<count; i++) {
            const r = radius * (0.8 + Math.random() * 0.4);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            p[i*3] = r * Math.sin(phi) * Math.cos(theta);
            p[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            p[i*3+2] = r * Math.cos(phi);
        }
        return p;
    }, [count, radius]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={points} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.05} color={color} transparent opacity={0.6} sizeAttenuation />
        </points>
    )
}

// --- SHARED SCENE COMPONENTS ---

const Dust = ({ mood, theme }) => {
    const count = mood === Mood.VOID ? 100 : 400;
    const mesh = useRef(null);
    
    const particles = useMemo(() => {
        const temp = [];
        for(let i=0; i<count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = (0.01 + Math.random() / 200) * theme.particleSpeed;
            const x = Math.random() * 60 - 30;
            const y = Math.random() * 60 - 30;
            const z = Math.random() * 60 - 30;
            temp.push({ t, factor, speed, x, y, z });
        }
        return temp;
    }, [mood, theme.particleSpeed]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame(() => {
        if(!mesh.current) return;
        particles.forEach((particle, i) => {
            let { t, factor, speed, x, y, z } = particle;
            t = particle.t += speed;
            const s = Math.cos(t) * 0.5 + 0.5; 
            
            dummy.position.set(
                x + Math.sin(t * 0.1) * 2,
                y + Math.cos(t * 0.2) * 2,
                z
            );
            dummy.scale.set(s, s, s);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.05, 0]} />
            <meshBasicMaterial color={theme.accent} transparent opacity={0.4} />
        </instancedMesh>
    )
}

const Effects = ({ mood, theme }) => {
    return (
        <EffectComposer enableNormalPass={false}>
            <Bloom 
                luminanceThreshold={mood === Mood.UTOPIA ? 0.6 : 0.2} 
                mipmapBlur 
                intensity={theme.intensity} 
                radius={0.6}
            />
            <Noise opacity={mood === Mood.VOID ? 0.4 : 0.12} blendFunction={BlendFunction.OVERLAY} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <ChromaticAberration 
                blendFunction={BlendFunction.NORMAL} 
                offset={new THREE.Vector2(
                    (mood === Mood.CONFLICT || mood === Mood.SCHADENFREUDE) ? 0.005 : 0.002, 
                    0.002
                )} 
            />
            {mood === Mood.MYOPIC && (
                <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={5} height={480} />
            )}
            {(mood === Mood.CONFLICT || mood === Mood.SCHADENFREUDE) && (
                 <Glitch 
                    delay={new THREE.Vector2(1.5, 3.5)}
                    duration={new THREE.Vector2(0.6, 1.0)}
                    strength={new THREE.Vector2(0.3, 1.0)}
                    mode={1} 
                    active 
                    ratio={0.85} 
                />
            )}
        </EffectComposer>
    )
}

const CameraController = ({ mood }) => {
    const { camera } = useThree();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(t / 4) * 0.5, 0.01);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, Math.sin(t / 8) * 0.5, 0.01);
        
        let targetZ = 10;
        if (mood === Mood.VOID) targetZ = 12;
        if (mood === Mood.MYOPIC) targetZ = 6;
        
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.01);
        camera.lookAt(0, 0, 0);
    });
    return null;
}

export const Visualizer3D = ({ mood }) => {
  const theme = THEMES[mood];
  
  let SceneContent;
  switch (mood) {
      case Mood.WAKE:
          SceneContent = <GenesisStructure theme={theme} />;
          break;
      case Mood.ROUTINE:
          SceneContent = <RoutineGrid theme={theme} />;
          break;
      case Mood.DYSTOPIA:
          SceneContent = <DystopianCity theme={theme} />;
          break;
      case Mood.CONFLICT:
          SceneContent = <GlitchSpikes theme={theme} />;
          break;
      case Mood.SCHADENFREUDE:
          SceneContent = <SchadenfreudeFracture theme={theme} />;
          break;
      case Mood.VOID:
          SceneContent = <Singularity theme={theme} />;
          break;
      case Mood.NARCISSISM:
          SceneContent = <NarcissusCore theme={theme} />;
          break;
      case Mood.UTOPIA:
          SceneContent = <UtopianHarmony theme={theme} />;
          break;
      case Mood.PHILOSOPHY:
          SceneContent = <NeuralLattice theme={theme} />;
          break;
      case Mood.SANCTUARY:
          SceneContent = <SeraphimEngine theme={theme} />;
          break;
      case Mood.MYOPIC:
          SceneContent = <MyopicTunnel theme={theme} />;
          break;
      case Mood.HOPE:
          SceneContent = <OrganicHelix theme={theme} />;
          break;
      case Mood.END:
          SceneContent = <GenesisStructure theme={theme} />;
          break;
      default:
          SceneContent = <GenesisStructure theme={theme} />;
  }

  return (
    <div className="absolute inset-0 z-0 bg-black transition-colors duration-2000 ease-in-out" style={{ backgroundColor: theme.fog }}>
      <Canvas dpr={[1, 2]} gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
        <CameraController mood={mood} />
        
        <ambientLight intensity={0.2} color={theme.secondary} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={5} color={theme.primary} />
        <spotLight position={[-10, -10, -10]} angle={0.5} penumbra={1} intensity={5} color={theme.accent} />
        
        {SceneContent}
        
        <Dust mood={mood} theme={theme} />
        
        {[Mood.WAKE, Mood.SANCTUARY, Mood.HOPE, Mood.END, Mood.UTOPIA].includes(mood) && 
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        }
        
        <Effects mood={mood} theme={theme} />
        <fog attach="fog" args={[theme.fog, 5, 25]} />
      </Canvas>
    </div>
  );
};
