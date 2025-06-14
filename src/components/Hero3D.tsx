
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Center } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

const ScaleIcon3D = () => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.3, 2, 0.1]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.2, 0.1, 0.1]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[1.2, 0.1, 0.1]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.2} />
      </mesh>
    </Float>
  );
};

const FloatingElements = () => {
  const elements = [];
  
  for (let i = 0; i < 10; i++) {
    elements.push(
      <Float
        key={i}
        speed={1 + Math.random() * 2}
        rotationIntensity={0.5}
        floatIntensity={0.3}
        position={[
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ]}
      >
        <mesh>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial 
            color={Math.random() > 0.5 ? "#06b6d4" : "#3b82f6"} 
            emissive={Math.random() > 0.5 ? "#06b6d4" : "#3b82f6"} 
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>
    );
  }
  
  return <>{elements}</>;
};

export const Hero3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
        
        <Center>
          <ScaleIcon3D />
        </Center>
        
        <FloatingElements />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
