

namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class CarController extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(CarController);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "CarController added to ";
    public possessed: boolean = false;
    private speed: number = 0;

    private wheels: ƒ.Node[];


    private readonly acceleration: number = 0.000001;
    private readonly breakFactor: number = 0.7;
    private readonly frictionFactor: number = 0.8;
    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Debug.log(this.message, this.node);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          this.setup();
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }
    public setup = (): void => {
      this.wheels = this.node.getChildren().slice(0, 4);
    }


    public update = (_event: Event): void => {
      this.decelerate();

    }


    public accelerate(): void {
      this.speed += this.acceleration * ƒ.Loop.timeFrameReal / 10000;
    }


    public turn(_mouseDistanceToCenterX: number): void {
      const transform: ƒ.ComponentTransform = this.node.getComponent(ƒ.ComponentTransform)
      if (Math.abs(_mouseDistanceToCenterX) > 50) {
        if (this.speed != 0) {
          let turnAngle: number = - 0.003 * (_mouseDistanceToCenterX - Math.sign(_mouseDistanceToCenterX) * 100)
          if (Math.abs(turnAngle) > 1) {
            turnAngle = Math.sign(turnAngle);
          }
          transform.mtxLocal.rotateY(turnAngle);
        }
        for (let i = 0; i < 2; i++) {
          const pivot: ƒ.Matrix4x4 = this.wheels[i].getComponent(ƒ.ComponentMesh).mtxPivot
          pivot.rotation = new ƒ.Vector3(-_mouseDistanceToCenterX / 10, pivot.rotation.y, pivot.rotation.z);
        }
      }
      else {
        for (let i = 0; i < 2; i++) {
          const pivot: ƒ.Matrix4x4 = this.wheels[i].getComponent(ƒ.ComponentMesh).mtxPivot
          pivot.rotation = new ƒ.Vector3(_mouseDistanceToCenterX / 10, pivot.rotation.y, pivot.rotation.z)
        }
      }
    }


    public break(): void {
      this.speed -= Math.sign(this.speed) * this.breakFactor * ƒ.Loop.timeFrameReal / 1000;

    }


    public decelerate(): void {
      const transform: ƒ.ComponentTransform = this.node.getComponent(ƒ.ComponentTransform)
      if (this.speed != 0) {
        this.speed -= this.speed * this.frictionFactor * ƒ.Loop.timeFrameReal / 1000;

        if (Math.abs(this.speed) > 1) {
          this.speed = Math.sign(this.speed);
        }
        transform.mtxLocal.translateZ(this.speed);
      }
      if (Math.abs(this.speed) < 0.0003) {
        this.speed = 0;
      }
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}