import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";

export default class Model {
  constructor(obj) {
    this.default = obj.default;
    this.name = obj.name;
    this.file = obj.file;
    this.colorA = obj.colorA;
    this.colorB = obj.colorB;
    this.scene = obj.scene;

    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath("./draco/");
    this.loader.setDRACOLoader(this.dracoLoader);

    this.init();
  }

  init() {
    this.loader.load(this.file, (res) => {
      // 3D Model Mesh
      this.mesh = res.scene.children[0];

      // Material Mesh
      this.material = new THREE.MeshBasicMaterial({
        color: "red",
        wireframe: true,
      });
      this.mesh.material = this.material;

      // Geometry Mesh
      this.geometry = this.mesh.geometry;

      // Particles Material
      //   this.particlesMaterial = new THREE.PointsMaterial({
      //     color: "red",
      //     size: 0.02,
      //   });
      this.particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uColorA: { value: new THREE.Color(this.colorA) },
          uColorB: { value: new THREE.Color(this.colorB) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      // Partciles Geometry
      const numParticles = 20000;
      // MeshSurfaceSampler: Utility class for sampling weighted random points on the surface of a mesh.
      const sampler = new MeshSurfaceSampler(this.mesh).build();
      this.particlesGeometry = new THREE.BufferGeometry();
      const particlesPosition = new Float32Array(numParticles * 3);

      for (let i = 0; i < numParticles; i++) {
        const newPosition = new THREE.Vector3();
        sampler.sample(newPosition);
        particlesPosition.set(
          [newPosition.x, newPosition.y, newPosition.z],
          i * 3
        );
      }

      this.particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(particlesPosition, 3)
      );

      // Particles
      this.particles = new THREE.Points(
        this.particlesGeometry,
        this.particlesMaterial
      );

      if (this.default) this.add();
    });
  }

  add() {
    this.scene.add(this.particles);
  }

  remove() {
    this.scene.remove(this.particles);
  }
}
