
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Center, Text3D } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { Group, Points } from 'three';
import { useFrame } from '@react-three/fiber';

const ScalesOfJustice = () => {
  const scaleRef = useRef<Group>(null);
  const leftPanRef = useRef<Group>(null);
  const rightPanRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (scaleRef.current) {
      scaleRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
    if (leftPanRef.current && rightPanRef.current) {
      const sway = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      leftPanRef.current.rotation.z = sway;
      rightPanRef.current.rotation.z = -sway;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.3}>
      <group ref={scaleRef}>
        {/* Main pole with marble texture */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 4]} />
          <meshStandardMaterial 
            color="#F5F5DC" 
            metalness={0.1} 
            roughness={0.2}
            emissive="#2a2a2a"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Ornate top with glow */}
        <mesh position={[0, 2.2, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial 
            color="#FFD700" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#FFD700"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Horizontal crossbeam */}
        <mesh position={[0, 1.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 3]} />
          <meshStandardMaterial 
            color="#8B7355" 
            metalness={0.7} 
            roughness={0.3}
          />
        </mesh>
        
        {/* Enhanced chains with links */}
        {[-1.2, 1.2].map((x, i) => (
          <group key={i} position={[x, 1.8, 0]}>
            {[0, -0.1, -0.2, -0.3, -0.4].map((y, j) => (
              <mesh key={j} position={[0, y, 0]} rotation={[0, 0, j * 0.1]}>
                <torusGeometry args={[0.02, 0.008, 8, 16]} />
                <meshStandardMaterial 
                  color="#C0C0C0" 
                  metalness={0.9} 
                  roughness={0.1}
                />
              </mesh>
            ))}
          </group>
        ))}
        
        {/* Left justice pan with detail */}
        <group ref={leftPanRef} position={[-1.2, 1.3, 0]}>
          <mesh>
            <cylinderGeometry args={[0.25, 0.2, 0.03]} />
            <meshStandardMaterial 
              color="#FFD700" 
              metalness={0.8} 
              roughness={0.2}
              emissive="#FFD700"
              emissiveIntensity={0.1}
            />
          </mesh>
          {/* Pan rim */}
          <mesh position={[0, 0.015, 0]}>
            <torusGeometry args={[0.25, 0.01, 8, 32]} />
            <meshStandardMaterial color="#B8860B" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
        
        {/* Right justice pan */}
        <group ref={rightPanRef} position={[1.2, 1.3, 0]}>
          <mesh>
            <cylinderGeometry args={[0.25, 0.2, 0.03]} />
            <meshStandardMaterial 
              color="#FFD700" 
              metalness={0.8} 
              roughness={0.2}
              emissive="#FFD700"
              emissiveIntensity={0.1}
            />
          </mesh>
          {/* Pan rim */}
          <mesh position={[0, 0.015, 0]}>
            <torusGeometry args={[0.25, 0.01, 8, 32]} />
            <meshStandardMaterial color="#B8860B" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
        
        {/* Ornate base */}
        <mesh position={[0, -1.8, 0]}>
          <cylinderGeometry args={[0.5, 0.6, 0.3]} />
          <meshStandardMaterial 
            color="#2F1B14" 
            metalness={0.3} 
            roughness={0.7}
          />
        </mesh>
      </group>
    </Float>
  );
};

const LawBook = ({ position }: { position: [number, number, number] }) => {
  const bookRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (bookRef.current) {
      bookRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.3;
      bookRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.5 + position[1]) * 0.1;
      bookRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + position[0]) * 0.1;
    }
  });

  const colors = ['#8B0000', '#006400', '#191970', '#8B4513'];
  const bookColor = colors[Math.floor(Math.abs(position[0] + position[1]) * 10) % colors.length];

  return (
    <Float speed={1 + Math.random() * 0.5} rotationIntensity={0.6} floatIntensity={0.4}>
      <group ref={bookRef} position={position}>
        {/* Book cover with depth */}
        <mesh>
          <boxGeometry args={[0.4, 0.5, 0.08]} />
          <meshStandardMaterial 
            color={bookColor} 
            metalness={0.1} 
            roughness={0.8}
          />
        </mesh>
        {/* Book spine detail */}
        <mesh position={[0, 0, -0.04]}>
          <boxGeometry args={[0.4, 0.5, 0.02]} />
          <meshStandardMaterial 
            color="#654321" 
            metalness={0.1} 
            roughness={0.9}
          />
        </mesh>
        {/* Embossed title */}
        <mesh position={[0, 0.08, 0.041]}>
          <boxGeometry args={[0.25, 0.12, 0.002]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFD700" 
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Legal symbol */}
        <mesh position={[0, -0.15, 0.041]}>
          <cylinderGeometry args={[0.05, 0.05, 0.002]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFD700" 
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
};

const Gavel = ({ position }: { position: [number, number, number] }) => {
  const gavelRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (gavelRef.current) {
      gavelRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.4;
      gavelRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.8 + position[1]) * 0.2;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={gavelRef} position={position}>
        {/* Gavel head with wood grain effect */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.4]} />
          <meshStandardMaterial 
            color="#8B4513" 
            metalness={0.2} 
            roughness={0.8}
          />
        </mesh>
        {/* Gavel handle */}
        <mesh position={[0, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.5]} />
          <meshStandardMaterial 
            color="#654321" 
            metalness={0.1} 
            roughness={0.9}
          />
        </mesh>
        {/* Metal ferrule */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.06]} />
          <meshStandardMaterial 
            color="#C0C0C0" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#404040"
            emissiveIntensity={0.1}
          />
        </mesh>
        {/* Sound block */}
        <mesh position={[0.6, -0.1, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1]} />
          <meshStandardMaterial 
            color="#8B4513" 
            metalness={0.1} 
            roughness={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
};

const LegalDocument = ({ position }: { position: [number, number, number] }) => {
  const docRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (docRef.current) {
      docRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.5;
      docRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.9 + position[0]) * 0.15;
    }
  });

  return (
    <Float speed={0.9} rotationIntensity={0.7} floatIntensity={0.3}>
      <group ref={docRef} position={position}>
        {/* Document with curl effect */}
        <mesh rotation={[0, 0, Math.sin(position[0]) * 0.1]}>
          <planeGeometry args={[0.35, 0.45]} />
          <meshStandardMaterial 
            color="#FFFEF7" 
            metalness={0.0} 
            roughness={0.9}
            transparent
            opacity={0.95}
          />
        </mesh>
        {/* Text lines with legal formatting */}
        {[0.15, 0.1, 0.05, 0, -0.05, -0.1, -0.15].map((y, i) => (
          <mesh key={i} position={[0, y, 0.001]}>
            <planeGeometry args={[i === 0 ? 0.25 : 0.28, 0.008]} />
            <meshStandardMaterial 
              color={i === 0 ? "#8B0000" : "#191970"} 
              emissive={i === 0 ? "#8B0000" : "#191970"} 
              emissiveIntensity={0.1}
            />
          </mesh>
        ))}
        {/* Official seal */}
        <mesh position={[0.1, -0.15, 0.001]}>
          <circleGeometry args={[0.04]} />
          <meshStandardMaterial 
            color="#DC143C" 
            emissive="#DC143C" 
            emissiveIntensity={0.3}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        {/* Signature line */}
        <mesh position={[-0.05, -0.18, 0.001]}>
          <planeGeometry args={[0.15, 0.002]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
    </Float>
  );
};

const LegalParticles = () => {
  const particlesRef = useRef<Points>(null);
  
  const positions = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 80; i++) {
      temp.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );
    }
    return new Float32Array(temp);
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        color="#06b6d4" 
        transparent 
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
};

export const Hero3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        {/* Enhanced Lighting Setup */}
        <ambientLight intensity={0.4} color="#f0f8ff" />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#06b6d4" />
        <spotLight 
          position={[0, 8, 8]} 
          intensity={1} 
          angle={0.4} 
          penumbra={0.5} 
          color="#FFD700"
          castShadow
        />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.5} 
          color="#ffffff"
        />
        
        {/* Main Scales of Justice - Centerpiece */}
        <Center>
          <ScalesOfJustice />
        </Center>
        
        {/* Floating Law Books - Strategic Placement */}
        <LawBook position={[-4, 3, -3]} />
        <LawBook position={[4.5, -1.5, 2]} />
        <LawBook position={[-3, -3, 3]} />
        <LawBook position={[3.5, 3.5, -1.5]} />
        <LawBook position={[-1.5, 4, 1]} />
        <LawBook position={[2, -4, -2]} />
        
        {/* Floating Gavels - Authority Symbols */}
        <Gavel position={[-5, 0.5, 4]} />
        <Gavel position={[5, 1.5, -4]} />
        <Gavel position={[0, -4, 3]} />
        <Gavel position={[-2, 2, -3]} />
        
        {/* Legal Documents - Swirling Around */}
        <LegalDocument position={[-3.5, 1.5, 5]} />
        <LegalDocument position={[4, -0.8, -5]} />
        <LegalDocument position={[1.5, 4, 2]} />
        <LegalDocument position={[-2, -2, -3]} />
        <LegalDocument position={[0.5, 2.5, 4]} />
        <LegalDocument position={[-4, -1, 1]} />
        
        {/* Enhanced Particle System */}
        <LegalParticles />
        
        {/* Improved Orbit Controls */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 3}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};
