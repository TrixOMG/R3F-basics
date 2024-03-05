import {
  MeshWobbleMaterial,
  OrbitControls,
  useHelper,
} from "@react-three/drei";
import {
  Canvas,
  Vector3,
  useFrame,
} from "@react-three/fiber";
import { useControls } from "leva";
import { useRef, useState } from "react";
import {
  DirectionalLight,
  DirectionalLightHelper,
  Mesh,
} from "three";
import "./App.css";

interface CubeProps {
  position: Vector3;
  size: [number, number, number];
  color: string;
}

interface SphereProps {
  position: Vector3;
  args: [number, number, number];
  color: string;
}

interface TorusProps {
  position: Vector3;
  args: [number, number, number, number];
  color: string;
}

interface TorusKnotProps {
  position: Vector3;
  args: [number, number, number, number];
  color: string;
}

const Torus = ({ position, args, color }: TorusProps) => {
  return (
    <mesh position={position}>
      <torusGeometry args={args} />
      {/* <meshStandardMaterial color={color} /> */}
      <MeshWobbleMaterial factor={1.5} speed={0.5} />
    </mesh>
  );
};

const TorusKnot = ({
  position,
  args,
}: // color,
TorusKnotProps) => {
  const ref = useRef<Mesh>(null!);

  const { color, radius } = useControls({
    color: "lightblue",
    radius: { value: 5, min: 1, max: 10, step: 0.5 },
  });

  // useFrame((state, delta) => {
  // ref.current.rotation.x += delta;
  // ref.current.rotation.y += delta;
  // ref.current.rotation.z += delta;
  // });

  return (
    <mesh position={position} ref={ref}>
      <torusKnotGeometry args={[radius, ...args]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Sphere = ({ position, args, color }: SphereProps) => {
  const ref = useRef<Mesh>(null!);
  const [isHovered, setHovered] = useState(false);

  return (
    <mesh
      position={position}
      ref={ref}
      onPointerEnter={(event) => (
        event.stopPropagation(), setHovered(true)
      )}
      onPointerLeave={() => setHovered(false)}
    >
      <sphereGeometry args={args} />
      <meshStandardMaterial
        color={!isHovered ? color : "lightblue"}
        wireframe
      />
    </mesh>
  );
};

const Cube = ({ position, size, color }: CubeProps) => {
  const cubeRef = useRef<Mesh>(null!);

  useFrame((state, delta) => {
    cubeRef.current.rotation.x += delta;
    cubeRef.current.rotation.y += delta;
    cubeRef.current.rotation.z += delta;
    cubeRef.current.position.z +=
      Math.sin(state.clock.elapsedTime) * delta;
  });

  return (
    <mesh position={position} ref={cubeRef}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Scene = () => {
  const diresctionalLightRef = useRef<DirectionalLight>(
    null!
  );

  const { lightColor, lightIntensity } = useControls({
    lightColor: "white",
    lightIntensity: {
      value: 0.5,
      min: 0,
      max: 5,
      step: 0.1,
    },
  });

  useHelper(
    diresctionalLightRef,
    DirectionalLightHelper,
    0.5,
    "white"
  );

  return (
    <>
      <directionalLight
        position={[0, 0, 1]}
        intensity={lightIntensity}
        ref={diresctionalLightRef}
        color={lightColor}
      />
      <ambientLight intensity={0.5} />

      <group position={[0, -1, 0]}>
        <Cube
          position={[1, 0, 0]}
          size={[1, 1, 1]}
          color={"green"}
        />
        <Cube
          position={[-1, 0, 0]}
          size={[1, 1, 1]}
          color={"hotpink"}
        />
        <Cube
          position={[-1, 2, 0]}
          size={[1, 1, 1]}
          color={"orange"}
        />
        <Cube
          position={[1, 2, 0]}
          size={[1, 1, 1]}
          color={"red"}
        />
      </group>
      <Sphere
        position={[0, 0, 0]}
        args={[0.7, 60, 60]}
        color={"green"}
      />
      <Torus
        position={[2, 0, 0]}
        args={[0.8, 0.1, 30, 30]}
        color={"blue"}
      />

      <TorusKnot
        position={[0, -2, 0]}
        args={[0.5, 0.1, 1000, 50]}
        color={"hotpink"}
      />
      <OrbitControls enableZoom={false} />
    </>
  );
};

function App() {
  return (
    <Canvas>
      <Scene />
    </Canvas>
  );
}

export default App;

//Technologies used: React, React Three Fiber, drei, Leva.
