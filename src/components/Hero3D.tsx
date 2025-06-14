
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Center, Text3D, Box } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

const ScalesOfJustice = () => {
  const scaleRef = useRef<Mesh>(null);
  const leftPanRef = useRef<Mesh>(null);
  const rightPanRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (scaleRef.current) {
      scaleRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (leftPanRef.current && rightPanRef.current) {
      const sway = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      leftPanRef.current.rotation.z = sway;
      rightPanRef.current.rotation.z = -sway;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
      <group ref={scaleRef}>
        {/* Main pole */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 3]} />
          <meshStandardMaterial color="#8B7355" metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Top ornament */}
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Horizontal bar */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 2]} />
          <meshStandardMaterial color="#8B7355" metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Left chain */}
        <mesh position={[-0.8, 1.2, 0]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.005, 0.005, 0.3]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.2} />
        </mesh>
        
        {/* Right chain */}
        <mesh position={[0.8, 1.2, 0]} rotation={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.005, 0.005, 0.3]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.2} />
        </mesh>
        
        {/* Left pan */}
        <mesh ref={leftPanRef} position={[-0.8, 1, 0]}>
          <cylinderGeometry args={[0.15, 0.12, 0.02]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Right pan */}
        <mesh ref={rightPanRef} position={[0.8, 1, 0]}>
          <cylinderGeometry args={[0.15, 0.12, 0.02]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Base */}
        <mesh position={[0, -1.4, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 0.2]} />
          <meshStandardMaterial color="#2D1810" metalness={0.3} roughness={0.7} />
        </mesh>
      </group>
    </Float>
  );
};

const LawBook = ({ position }: { position: [number, number, number] }) => {
  const bookRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (bookRef.current) {
      bookRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
      bookRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.7 + position[1]) * 0.1;
    }
  });

  return (
    <Float speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={0.3}>
      <group ref={bookRef} position={position}>
        {/* Book cover */}
        <mesh>
          <boxGeometry args={[0.3, 0.4, 0.05]} />
          <meshStandardMaterial color="#8B0000" metalness={0.1} roughness={0.8} />
        </mesh>
        {/* Book spine */}
        <mesh position={[0, 0, -0.025]}>
          <boxGeometry args={[0.3, 0.4, 0.02]} />
          <meshStandardMaterial color="#654321" metalness={0.1} roughness={0.9} />
        </mesh>
        {/* Gold lettering */}
        <mesh position={[0, 0.05, 0.026]}>
          <boxGeometry args={[0.2, 0.15, 0.001]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  );
};

const Gavel = ({ position }: { position: [number, number, number] }) => {
  const gavelRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (gavelRef.current) {
      gavelRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
      <group ref={gavelRef} position={position}>
        {/* Gavel head */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3]} />
          <meshStandardMaterial color="#8B4513" metalness={0.2} roughness={0.8} />
        </mesh>
        {/* Gavel handle */}
        <mesh position={[0, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
          <meshStandardMaterial color="#654321" metalness={0.1} roughness={0.9} />
        </mesh>
        {/* Metal band */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.05]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
};

const LegalDocument = ({ position }: { position: [number, number, number] }) => {
  const docRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (docRef.current) {
      docRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.4;
      docRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.6} floatIntensity={0.2}>
      <group ref={docRef} position={position}>
        {/* Document */}
        <mesh>
          <planeGeometry args={[0.25, 0.35]} />
          <meshStandardMaterial color="#F8F8FF" metalness={0.0} roughness={0.9} />
        </mesh>
        {/* Text lines */}
        {[0.1, 0.05, 0, -0.05, -0.1].map((y, i) => (
          <mesh key={i} position={[0, y, 0.001]}>
            <planeGeometry args={[0.2, 0.01]} />
            <meshStandardMaterial color="#000080" emissive="#000080" emissiveIntensity={0.1} />
          </mesh>
        ))}
        {/* Seal */}
        <mesh position={[0.08, -0.12, 0.001]}>
          <circleGeometry args={[0.03]} />
          <meshStandardMaterial color="#DC143C" emissive="#DC143C" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </Float>
  );
};

const LegalParticles = () => {
  const particlesRef = useRef<Mesh>(null);
  
  const positions = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      temp.push(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
    }
    return new Float32Array(temp);
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
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
      <pointsMaterial size={0.02} color="#06b6d4" transparent opacity={0.6} />
    </points>
  );
};

export const Hero3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
        <spotLight position={[0, 5, 5]} intensity={0.8} angle={0.3} penumbra={0.5} color="#FFD700" />
        
        {/* Main Scales of Justice */}
        <Center>
          <ScalesOfJustice />
        </Center>
        
        {/* Floating Law Books */}
        <LawBook position={[-3, 2, -2]} />
        <LawBook position={[3.5, -1, 1]} />
        <LawBook position={[-2, -2.5, 2]} />
        <LawBook position={[2.5, 2.5, -1]} />
        
        {/* Floating Gavels */}
        <Gavel position={[-4, 0, 3]} />
        <Gavel position={[4, 1, -3]} />
        <Gavel position={[0, -3, 2]} />
        
        {/* Legal Documents */}
        <LegalDocument position={[-2.5, 1, 4]} />
        <LegalDocument position={[3, -0.5, -4]} />
        <LegalDocument position={[1, 3, 1]} />
        <LegalDocument position={[-1.5, -1.5, -2]} />
        <LegalDocument position={[0, 1.5, 3]} />
        
        {/* Particle System */}
        <LegalParticles />
        
        {/* Orbit Controls */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
};
