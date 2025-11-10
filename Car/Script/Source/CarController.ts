namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class CarController extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(CarController);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "CarController added to ";
    private speed: number = 0;
    private readonly acceleration: number = 0.000001;

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

    }
    public update = (_event: Event): void => {
      const transform: ƒ.ComponentTransform = this.node.getComponent(ƒ.ComponentTransform)
      if (Input.isInputPressed("accelerate")) {
        //console.log("a")
        this.speed += this.acceleration * ƒ.Loop.timeFrameReal / 10000;
        if (this.speed > 1) {
          this.speed = 1;
        }
      }
      else {
        this.speed -= 0.3 * ƒ.Loop.timeFrameReal / 1000;
        if (this.speed < 0) {
          this.speed = 0;
        }
      }
      if (Input.isInputJustPressed("left")) {

      }
      if (Input.mouseMoved && this.speed != 0) {
        transform.mtxLocal.rotateY(Input.mouseDifference.x / 10);
      }

      transform.mtxLocal.translateZ(this.speed);

    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}