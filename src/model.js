import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export default class Model {
  constructor(obj) {
    console.log(obj);
    this.name = obj.name;
    this.file = obj.file;
    this.default = obj.default;
    this.scene = obj.scene;

    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath("./draco/");
    this.loader.setDRACOLoader(this.dracoLoader);

    this.init();
  }

  init() {
    this.loader.load(this.file, (res) => {
      this.mesh = res.scene.children[0];
      this.material = new THREE.MeshBasicMaterial({
        color: "red",
        wireframe: true,
      });
      this.mesh.material = this.material;

      if (this.default) this.add();
    });
  }

  add() {
    this.scene.add(this.mesh);
  }

  remove() {
    this.scene.remove(this.mesh);
  }
}
