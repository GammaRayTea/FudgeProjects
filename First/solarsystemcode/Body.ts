

namespace Script {
  import ƒ = FudgeCore;


  export class Body extends ƒ.ComponentScript {
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(Body);
    private data: Data.BodyData;
    public constructor(_id: Data.BODY) {
      super(Data.getData(_id)?.name!);
      this.data = Data.getData(_id)!;

      this.addComponent(new ƒ.ComponentMesh(mesh));
      this.addComponent(new ƒ.ComponentMaterial(material));
      this.addComponent(new ƒ.ComponentTransform());
      this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(this.data.size, this.data.size, this.data.size))

      this.mtxLocal.translateX(this.data.orbitalRadius / 10);
    }

    public update(): void {
      
    }
  }
}